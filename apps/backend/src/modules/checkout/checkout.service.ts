import { Types } from 'mongoose';
import { Product } from '../../models/Product.js';
import { Inventory } from '../../models/Inventory.js';
import { User } from '../../models/User.js';
import { Order, IShippingAddressSnapshot, PaymentMethod } from '../../models/Order.js';
import { OrderItem } from '../../models/OrderItem.js';
import { Payment } from '../../models/Payment.js';
import { OrderStatusHistory } from '../../models/OrderStatusHistory.js';
import { StoreSettings } from '../../models/StoreSettings.js';
import { Coupon } from '../../models/Coupon.js';
import { CouponUsage } from '../../models/CouponUsage.js';
import { Cart } from '../../models/Cart.js';
import { CartItem } from '../../models/CartItem.js';
import { QrService } from '../../services/qr.service.js';
import { EmailService } from '../../services/email.service.js';
import { runInTransaction } from '../../utils/dbTransaction.js';
import { ApiError } from '../../utils/apiError.js';

export interface PlaceOrderDto {
  userId: string;
  shippingAddress: IShippingAddressSnapshot;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export class CheckoutService {
  static async calculateOrderTotals(
    items: Array<{ productId: string; quantity: number }>,
    couponCode?: string,
    pinCode?: string
  ) {
    if (!items || items.length === 0) {
      throw ApiError.badRequest('Cart is empty.');
    }

    const settings = await StoreSettings.findOne({ singletonKey: 'DEFAULT_SETTINGS' });
    const freeDeliveryThreshold = settings?.freeDeliveryThreshold ?? 1000;
    const standardFee = settings?.standardDeliveryFee ?? 50;

    let subtotal = 0;
    const verifiedItems: any[] = [];

    for (const item of items) {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(item.productId);
      const product = await Product.findOne(
        isObjectId
          ? { _id: item.productId, status: 'active', isSoftDeleted: false }
          : {
              $or: [{ slug: item.productId }, { legacyId: item.productId }],
              status: 'active',
              isSoftDeleted: false,
            }
      );

      if (!product) {
        throw ApiError.badRequest(`Product with ID '${item.productId}' is not available.`);
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      verifiedItems.push({
        product,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal,
      });
    }

    // Discounts
    let discountAmount = 0;
    let appliedCoupon: any = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() },
      });

      if (coupon) {
        if (subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
              discountAmount = coupon.maxDiscountAmount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
          appliedCoupon = coupon;
        }
      }
    }

    const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : standardFee;
    const totalPayableAmount = Math.max(0, subtotal - discountAmount + deliveryFee);

    // COD eligibility check
    let isCodEligible = Boolean(settings?.isCodEnabled);
    let codIneligibilityReason = '';

    if (settings && isCodEligible) {
      if (totalPayableAmount < settings.codMinOrderAmount) {
        isCodEligible = false;
        codIneligibilityReason = `Minimum order for COD is ₹${settings.codMinOrderAmount}`;
      } else if (totalPayableAmount > settings.codMaxOrderAmount) {
        isCodEligible = false;
        codIneligibilityReason = `Maximum order for COD is ₹${settings.codMaxOrderAmount}`;
      } else if (
        pinCode &&
        settings.codEligiblePinCodes &&
        settings.codEligiblePinCodes.length > 0 &&
        !settings.codEligiblePinCodes.includes(pinCode.trim())
      ) {
        isCodEligible = false;
        codIneligibilityReason = `COD is currently not available for PIN code ${pinCode}`;
      }
    }

    return {
      items: verifiedItems,
      subtotal,
      discountAmount,
      deliveryFee,
      totalPayableAmount,
      isCodEligible,
      codIneligibilityReason,
      appliedCoupon: appliedCoupon ? appliedCoupon.code : undefined,
    };
  }

  static async placeOrder(dto: PlaceOrderDto): Promise<{
    order: any;
    payment: any;
    upiDetails?: {
      upiId: string;
      merchantName: string;
      amount: number;
      qrCodeDataUrl: string;
      instructions: string;
    };
  }> {
    if (!dto.userId) {
      throw ApiError.unauthorized('Authentication required to place an order.');
    }
    const customerUser = await User.findById(dto.userId);
    if (!customerUser) {
      throw ApiError.unauthorized('Customer account not found.');
    }
    if (customerUser.status === 'suspended') {
      throw ApiError.forbidden('Customer account is suspended. Please contact support.');
    }

    const settings = await StoreSettings.findOne({ singletonKey: 'DEFAULT_SETTINGS' });
    if (settings && !settings.isStoreAcceptingOrders) {
      throw ApiError.badRequest('Store is temporarily not accepting orders. Please try again later.');
    }

    const calculation = await this.calculateOrderTotals(
      dto.items,
      dto.couponCode,
      dto.shippingAddress.pinCode
    );

    // Check COD conditions if customer picked COD
    if (dto.paymentMethod === 'COD') {
      if (!calculation.isCodEligible) {
        throw ApiError.badRequest(
          calculation.codIneligibilityReason || 'Cash on Delivery is not available for this order.'
        );
      }
    }

    // Unique order number generator
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `SNG-${randomSuffix}`;

    return runInTransaction(async (session) => {
      // 1. Inventory reservation & stock validation
      for (const item of calculation.items) {
        const inventory = await Inventory.findOne({ productId: item.product._id }).session(session);
        if (!inventory || inventory.stockQuantity < item.quantity) {
          throw ApiError.badRequest(
            `Insufficient stock for '${item.product.name}'. Required: ${item.quantity}, Available: ${inventory?.stockQuantity ?? 0}`
          );
        }

        // Conditional atomic update to prevent overselling
        const updateCondition: any = {
          productId: item.product._id,
          stockQuantity: { $gte: item.quantity },
        };

        const updatedInventory = await Inventory.findOneAndUpdate(
          updateCondition,
          {
            $inc: {
              stockQuantity: -item.quantity,
              reservedQuantity: item.quantity,
            },
          },
          { session, new: true }
        );

        if (!updatedInventory) {
          throw ApiError.badRequest(
            `Stock conflict for '${item.product.name}'. Please refresh your cart.`
          );
        }
      }

      // 2. Initial order and payment statuses
      const initialOrderStatus =
        dto.paymentMethod === 'COD' ? 'CONFIRMED' : 'PENDING_PAYMENT';
      const initialPaymentStatus =
        dto.paymentMethod === 'COD' ? 'COD_PENDING' : 'PENDING';

      // 3. Create Master Order
      const [order] = await Order.create(
        [
          {
            orderNumber,
            userId: dto.userId ? new Types.ObjectId(dto.userId) : undefined,
            customerSnapshot: {
              fullName: dto.shippingAddress.fullName,
              phone: dto.shippingAddress.phone,
              email: dto.shippingAddress.email || '',
            },
            shippingAddress: dto.shippingAddress,
            itemsSubtotal: calculation.subtotal,
            discountAmount: calculation.discountAmount,
            deliveryFee: calculation.deliveryFee,
            totalPayableAmount: calculation.totalPayableAmount,
            paymentMethod: dto.paymentMethod,
            paymentStatus: initialPaymentStatus,
            orderStatus: initialOrderStatus,
          },
        ],
        { session }
      );

      // 4. Create OrderItems (Immutable snapshot)
      const orderItemDocs = calculation.items.map((item) => ({
        orderId: order._id,
        productId: item.product._id,
        sku: item.product.sku,
        name: item.product.name,
        teluguName: item.product.teluguName,
        unitPack: item.product.quantity || item.product.unit,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
        imageSnapshot: item.product.image,
      }));

      await OrderItem.create(orderItemDocs, { session });

      // 5. Create Payment Record
      const [payment] = await Payment.create(
        [
          {
            orderId: order._id,
            orderNumber: order.orderNumber,
            paymentMethod: dto.paymentMethod,
            amount: calculation.totalPayableAmount,
            currency: 'INR',
            status: initialPaymentStatus,
          },
        ],
        { session }
      );

      // 6. Record Status History
      await OrderStatusHistory.create(
        [
          {
            orderId: order._id,
            fromStatus: 'NONE' as any,
            toStatus: initialOrderStatus,
            changedBy: dto.userId ? 'CUSTOMER' : 'SYSTEM',
            comment:
              dto.paymentMethod === 'COD'
                ? 'COD order placed and confirmed.'
                : 'UPI order created. Waiting for customer UTR submission.',
          },
        ],
        { session }
      );

      // 7. Record coupon usage if applied
      if (dto.couponCode && dto.userId) {
        const coupon = await Coupon.findOne({ code: dto.couponCode.toUpperCase() }).session(session);
        if (coupon) {
          await CouponUsage.create(
            [
              {
                couponId: coupon._id,
                userId: new Types.ObjectId(dto.userId),
                orderId: order._id,
                discountAmount: calculation.discountAmount,
              },
            ],
            { session }
          );
          coupon.timesUsed += 1;
          await coupon.save({ session });
        }
      }

      // 8. Clear customer cart if authenticated
      if (dto.userId) {
        const cart = await Cart.findOne({ userId: dto.userId }).session(session);
        if (cart) {
          await CartItem.deleteMany({ cartId: cart._id }).session(session);
        }
      }

      // 9. Generate UPI QR details if payment method is UPI
      let upiDetails: any = undefined;
      if (dto.paymentMethod === 'UPI') {
        const upiId = settings?.businessUpiId || 'gvkssorganics@upi';
        const merchantName = settings?.businessDisplayName || 'GVKSS Organic Collectives';
        
        const qrCodeDataUrl = await QrService.generateUpiQrDataUrl({
          upiId,
          merchantName,
          amount: calculation.totalPayableAmount,
          orderNumber: order.orderNumber,
        });

        upiDetails = {
          upiId,
          merchantName,
          amount: calculation.totalPayableAmount,
          qrCodeDataUrl,
          instructions:
            settings?.upiPaymentInstructions ||
            'Scan this official UPI QR code with Google Pay, PhonePe, or Paytm, complete the transfer, and submit your 12-digit UTR transaction reference number.',
        };
      }

      // 10. Send order notification
      EmailService.sendOrderPlaced(
        order.orderNumber,
        dto.shippingAddress.email || '',
        calculation.totalPayableAmount,
        dto.paymentMethod
      ).catch(() => {});

      return {
        order,
        payment,
        upiDetails,
      };
    });
  }
}
