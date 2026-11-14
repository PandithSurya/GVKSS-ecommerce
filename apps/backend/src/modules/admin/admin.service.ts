import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { Admin, IAdmin } from '../../models/Admin.js';
import { Role } from '../../models/Role.js';
import { Order, OrderStatus } from '../../models/Order.js';
import { OrderItem } from '../../models/OrderItem.js';
import { Payment } from '../../models/Payment.js';
import { Product, IProduct } from '../../models/Product.js';
import { Inventory } from '../../models/Inventory.js';
import { User } from '../../models/User.js';
import { StoreSettings } from '../../models/StoreSettings.js';
import { AuditLog } from '../../models/AuditLog.js';
import { OrderStatusHistory } from '../../models/OrderStatusHistory.js';
import { PaymentVerification } from '../../models/PaymentVerification.js';
import { TokenService } from '../../services/token.service.js';
import { AuditService } from '../../services/audit.service.js';
import { validateOrderStateTransition } from '../../utils/orderStateMachine.js';
import { runInTransaction } from '../../utils/dbTransaction.js';
import { ApiError } from '../../utils/apiError.js';

export class AdminService {
  /**
   * Admin Login with optional/enforced TOTP MFA
   */
  static async login(
    email: string,
    pass: string,
    mfaToken?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ admin: any; accessToken: string; refreshToken: string; requiresMfa?: boolean }> {
    const admin = await Admin.findOne({ email: email.toLowerCase() })
      .select('+passwordHash +mfaSecret')
      .populate('role');

    if (!admin) {
      throw ApiError.unauthorized('Invalid admin credentials.');
    }

    if (admin.status === 'suspended') {
      throw ApiError.forbidden('Admin account suspended.');
    }

    if (admin.isLocked()) {
      throw ApiError.forbidden('Account temporarily locked due to excessive failed attempts.');
    }

    const isMatch = await admin.comparePassword(pass);
    if (!isMatch) {
      admin.failedLoginAttempts += 1;
      if (admin.failedLoginAttempts >= 5) {
        admin.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins lock
      }
      await admin.save();
      throw ApiError.unauthorized('Invalid admin credentials.');
    }

    // Reset failed attempts on valid password
    admin.failedLoginAttempts = 0;
    admin.lockUntil = undefined;
    admin.lastLoginAt = new Date();
    await admin.save();

    // Verify MFA if enabled
    if (admin.isMfaEnabled) {
      if (!mfaToken) {
        return {
          admin: { _id: admin._id, email: admin.email, requiresMfa: true },
          accessToken: '',
          refreshToken: '',
          requiresMfa: true,
        };
      }

      const isValidToken = authenticator.verify({
        token: mfaToken,
        secret: admin.mfaSecret || '',
      });

      if (!isValidToken) {
        throw ApiError.unauthorized('Invalid multi-factor authentication code.');
      }
    }

    const roleName = (admin.role as any)?.name || 'ADMIN';
    const { accessToken, refreshToken } = await TokenService.createSession(
      admin._id,
      'admin',
      ipAddress,
      userAgent
    );

    AuditService.log({
      adminId: admin._id,
      adminEmail: admin.email,
      action: 'ADMIN_LOGIN',
      resource: 'Admin',
      resourceId: admin._id.toString(),
      ipAddress,
      userAgent,
    }).catch(() => {});

    return {
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        roleName,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Get Dashboard Overview Stats
   */
  static async getDashboardStats(): Promise<any> {
    const [
      totalOrders,
      pendingVerificationCount,
      confirmedOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
      cancelledOrdersCount,
      upiVerifiedPayments,
      codCollectedPayments,
      lowStockProducts,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Payment.countDocuments({ status: 'SUBMITTED_FOR_VERIFICATION' }),
      Order.countDocuments({ orderStatus: 'CONFIRMED' }),
      Order.countDocuments({ orderStatus: { $in: ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'] } }),
      Order.countDocuments({ orderStatus: 'DELIVERED' }),
      Order.countDocuments({ orderStatus: 'CANCELLED' }),
      Payment.aggregate([
        { $match: { paymentMethod: 'UPI', status: 'VERIFIED' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Payment.aggregate([
        { $match: { paymentMethod: 'COD', status: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Inventory.find({ stockQuantity: { $lte: 15 } })
        .populate('productId')
        .limit(10),
      Order.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const upiRevenue = upiVerifiedPayments[0]?.total || 0;
    const codRevenue = codCollectedPayments[0]?.total || 0;
    const totalSales = upiRevenue + codRevenue;

    return {
      overview: {
        totalOrders,
        pendingVerifications: pendingVerificationCount,
        confirmedOrders: confirmedOrdersCount,
        processingOrders: shippedOrdersCount,
        deliveredOrders: deliveredOrdersCount,
        cancelledOrders: cancelledOrdersCount,
        totalSales,
        upiCollections: upiRevenue,
        codCollections: codRevenue,
        lowStockCount: lowStockProducts.length,
      },
      lowStockAlerts: lowStockProducts.map((inv) => ({
        productId: inv.productId,
        sku: inv.sku,
        stockQuantity: inv.stockQuantity,
        minThreshold: inv.minThreshold,
      })),
      recentOrders,
    };
  }

  /**
   * Filtered & paginated orders list
   */
  static async getOrders(filters: {
    status?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: any[]; total: number; page: number; pages: number }> {
    const query: any = {};

    if (filters.status && filters.status !== 'ALL') {
      query.orderStatus = filters.status;
    }
    if (filters.paymentMethod && filters.paymentMethod !== 'ALL') {
      query.paymentMethod = filters.paymentMethod;
    }
    if (filters.paymentStatus && filters.paymentStatus !== 'ALL') {
      query.paymentStatus = filters.paymentStatus;
    }
    if (filters.search && filters.search.trim()) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'customerSnapshot.fullName': searchRegex },
        { 'customerSnapshot.phone': searchRegex },
        { 'customerSnapshot.email': searchRegex },
      ];
    }

    const page = Math.max(1, Number(filters.page || 1));
    const limit = Math.max(1, Math.min(100, Number(filters.limit || 25)));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(query),
    ]);

    const populatedOrders = await Promise.all(
      orders.map(async (o) => {
        const payment = await Payment.findOne({ orderId: o._id });
        const items = await OrderItem.find({ orderId: o._id });
        const mappedItems = items.map((it) => {
          const obj = it.toObject();
          const lineTotal = obj.lineTotal ?? (obj.unitPrice * obj.quantity);
          return {
            ...obj,
            subtotal: lineTotal,
            lineTotal,
          };
        });
        return {
          ...o.toObject(),
          totalAmount: o.totalPayableAmount,
          totalPayableAmount: o.totalPayableAmount,
          subtotal: o.itemsSubtotal,
          itemsSubtotal: o.itemsSubtotal,
          payment,
          itemsCount: items.length,
          items: mappedItems,
        };
      })
    );

    return {
      orders: populatedOrders,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single order details for admin inspection
   */
  static async getOrderDetail(orderIdOrNumber: string): Promise<any> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(orderIdOrNumber);
    const order = await Order.findOne(isObjectId ? { _id: orderIdOrNumber } : { orderNumber: orderIdOrNumber });
    if (!order) throw ApiError.notFound('Order not found.');

    const [items, payment, statusHistory, paymentVerification, customer] = await Promise.all([
      OrderItem.find({ orderId: order._id }),
      Payment.findOne({ orderId: order._id }),
      OrderStatusHistory.find({ orderId: order._id }).sort({ createdAt: 1 }),
      PaymentVerification.findOne({ orderId: order._id }).populate('adminId', 'fullName email'),
      order.userId ? User.findById(order.userId).select('fullName email phone status createdAt') : null,
    ]);

    const mappedItems = items.map((it) => {
      const obj = it.toObject();
      const lineTotal = obj.lineTotal ?? (obj.unitPrice * obj.quantity);
      return {
        ...obj,
        subtotal: lineTotal,
        lineTotal,
      };
    });

    return {
      ...order.toObject(),
      totalAmount: order.totalPayableAmount,
      totalPayableAmount: order.totalPayableAmount,
      subtotal: order.itemsSubtotal,
      itemsSubtotal: order.itemsSubtotal,
      customer: customer || order.customerSnapshot,
      items: mappedItems,
      payment,
      statusHistory,
      paymentVerification,
    };
  }

  /**
   * Update order status through strict state machine validation
   */
  static async updateOrderStatus(
    orderId: string,
    targetStatus: OrderStatus,
    adminId: string,
    comment?: string
  ): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found.');

    const payment = await Payment.findOne({ orderId: order._id });

    // Validate state machine rule
    validateOrderStateTransition(
      order.orderStatus,
      targetStatus,
      order.paymentMethod,
      payment?.status || 'PENDING'
    );

    return runInTransaction(async (session) => {
      const previousStatus = order.orderStatus;
      order.orderStatus = targetStatus;

      // If COD order is marked as DELIVERED, automatically mark payment as PAID
      if (order.paymentMethod === 'COD' && targetStatus === 'DELIVERED') {
        if (payment && payment.status === 'COD_PENDING') {
          payment.status = 'PAID';
          payment.verifiedAt = new Date();
          payment.verifiedByAdminId = new Types.ObjectId(adminId);
          await payment.save({ session });
          order.paymentStatus = 'PAID';
        }
      }

      // If cancelled by admin, restore inventory
      if (targetStatus === 'CANCELLED' && previousStatus !== 'CANCELLED') {
        order.cancellationReason = comment || 'Cancelled by admin';
        order.cancelledAt = new Date();
        order.cancelledBy = 'ADMIN';

        const items = await OrderItem.find({ orderId: order._id }).session(session);
        for (const item of items) {
          await Inventory.findOneAndUpdate(
            { productId: item.productId },
            {
              $inc: {
                stockQuantity: item.quantity,
                reservedQuantity: -item.quantity,
              },
            },
            { session }
          );
        }
      }

      await order.save({ session });

      await OrderStatusHistory.create(
        [
          {
            orderId: order._id,
            fromStatus: previousStatus,
            toStatus: targetStatus,
            changedBy: 'ADMIN',
            changedById: new Types.ObjectId(adminId),
            comment: comment || `Status updated to ${targetStatus}`,
          },
        ],
        { session }
      );

      return order;
    });
  }

  /**
   * Add tracking info to order
   */
  static async updateTracking(
    orderId: string,
    courierName: string,
    trackingNumber: string
  ): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) throw ApiError.notFound('Order not found.');

    order.courierName = courierName;
    order.trackingNumber = trackingNumber;
    order.dispatchDate = new Date();
    if (order.orderStatus === 'PACKED' || order.orderStatus === 'CONFIRMED') {
      order.orderStatus = 'SHIPPED';
    }
    await order.save();

    await OrderStatusHistory.create({
      orderId: order._id,
      fromStatus: order.orderStatus,
      toStatus: order.orderStatus,
      changedBy: 'ADMIN',
      comment: `Dispatched via ${courierName}. Tracking: ${trackingNumber}`,
    });

    return order;
  }

  /**
   * Product CRUD for Admin
   */
  static async createProduct(data: any): Promise<IProduct> {
    if (!data.name || !data.category || data.price === undefined) {
      throw ApiError.badRequest('Product name, category, and price are required.');
    }

    let slug = (data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')).trim();
    if (!slug) slug = `product-${Date.now()}`;
    const sku = (data.sku || `GVK-${Date.now().toString().slice(-6)}`).toUpperCase().trim();

    // Prevent duplicate SKU
    const existingSku = await Product.findOne({ sku });
    if (existingSku) {
      throw ApiError.badRequest(`A product with SKU '${sku}' already exists.`);
    }

    // Handle slug uniqueness
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      if (data.slug) {
        throw ApiError.badRequest(`A product with slug '${slug}' already exists.`);
      } else {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const initialStock = Number(data.stockQuantity !== undefined ? data.stockQuantity : 100);
    const image = data.image || data.imageUrl || data.primaryImage || '/images/products/placeholder.png';
    const teluguName = data.teluguName || data.name;
    const description = data.description || data.name;
    const teluguDescription = data.teluguDescription || description || teluguName;
    const unit = data.unit || '1 kg';
    const quantity = data.quantity || unit || '1 kg';

    const product = await Product.create({
      ...data,
      slug,
      sku,
      image,
      teluguName,
      description,
      teluguDescription,
      unit,
      quantity,
      price: Number(data.price),
      discountedPrice: data.discountedPrice ? Number(data.discountedPrice) : undefined,
      status: data.status || 'active',
      available: initialStock > 0,
      isAvailable: initialStock > 0,
      isSoftDeleted: false,
    });

    // Create corresponding Inventory record
    await Inventory.create({
      productId: product._id,
      sku: product.sku,
      stockQuantity: initialStock,
      reservedQuantity: 0,
      minThreshold: Number(data.lowStockThreshold || data.minThreshold || 10),
    });

    return product;
  }

  static async updateProduct(productId: string, data: any): Promise<IProduct> {
    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound('Product not found.');

    Object.assign(product, data);
    await product.save();

    if (data.stockQuantity !== undefined) {
      await Inventory.findOneAndUpdate(
        { productId: product._id },
        { stockQuantity: Number(data.stockQuantity) },
        { upsert: true }
      );
    }

    return product;
  }

  static async deleteProduct(productId: string): Promise<void> {
    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound('Product not found.');

    product.isSoftDeleted = true;
    product.status = 'inactive';
    await product.save();
  }

  /**
   * Inventory stock list with live product and stock calculations
   */
  static async getInventory(): Promise<any[]> {
    const inventories = await Inventory.find().populate({
      path: 'productId',
      select: 'name slug sku price category primaryImage image isAvailable available status isSoftDeleted',
    });

    return inventories
      .filter((inv) => inv.productId && !(inv.productId as any).isSoftDeleted)
      .map((inv) => {
        const prod = inv.productId as any;
        const availableStock = inv.stockQuantity;
        const reservedStock = inv.reservedQuantity || 0;
        const totalStock = availableStock + reservedStock;
        const isLowStock = availableStock <= (inv.minThreshold || 10);
        return {
          _id: prod._id,
          id: prod._id,
          inventoryId: inv._id,
          productId: prod._id,
          name: prod.name,
          productName: prod.name,
          sku: prod.sku,
          category: prod.category,
          image: prod.primaryImage || prod.image || '/images/products/placeholder.png',
          stockQuantity: availableStock,
          availableStock,
          reservedStock,
          totalStock,
          minThreshold: inv.minThreshold || 10,
          lowStockThreshold: inv.minThreshold || 10,
          isLowStock,
          status: prod.status,
          product: prod,
          updatedAt: inv.updatedAt || inv.lastRestockedAt || new Date(),
        };
      });
  }

  /**
   * Add physical stock units with reference note and audit trail
   */
  static async addStock(
    productId: string,
    quantityToAdd: number,
    referenceNote: string,
    adminId: string
  ): Promise<any> {
    if (!productId || productId === 'undefined') {
      throw ApiError.badRequest('A valid product identifier is required to add stock.');
    }

    if (quantityToAdd <= 0) {
      throw ApiError.badRequest('Quantity to add must be greater than zero.');
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
    // Find inventory by productId, or if an inventoryId was supplied, by _id
    let inventory = isObjectId
      ? await Inventory.findOne({ $or: [{ productId }, { _id: productId }] })
      : null;

    if (!inventory) {
      const prod = await Product.findOne(
        isObjectId
          ? { _id: productId }
          : { $or: [{ legacyId: productId }, { sku: productId }, { slug: productId }] }
      );
      if (prod) {
        inventory = await Inventory.findOne({ productId: prod._id });
        if (!inventory) {
          inventory = await Inventory.create({
            productId: prod._id,
            sku: prod.sku || `GVK-${Date.now().toString().slice(-6)}`,
            stockQuantity: 0,
            reservedQuantity: 0,
            minThreshold: 10,
          });
        }
      }
    }

    if (!inventory) throw ApiError.notFound('Inventory record not found for product.');

    const previousQty = inventory.stockQuantity;
    inventory.stockQuantity += quantityToAdd;
    inventory.lastRestockedAt = new Date();
    await inventory.save();

    await Product.findByIdAndUpdate(inventory.productId, {
      available: inventory.stockQuantity > 0,
      isAvailable: inventory.stockQuantity > 0,
    });

    AuditService.log({
      adminId,
      action: 'STOCK_ADDED',
      resource: 'Inventory',
      resourceId: inventory._id.toString(),
      details: {
        productId: inventory.productId,
        previousQuantity: previousQty,
        addedQuantity: quantityToAdd,
        newQuantity: inventory.stockQuantity,
        referenceNote,
      },
    }).catch(() => {});

    return {
      productId: inventory.productId,
      previousQuantity: previousQty,
      addedQuantity: quantityToAdd,
      newQuantity: inventory.stockQuantity,
      referenceNote,
    };
  }

  /**
   * Inventory stock adjustment (manual override)
   */
  static async adjustInventory(
    productId: string,
    newQuantity: number,
    reason: string,
    adminId: string
  ): Promise<any> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productId);
    let inventory = isObjectId ? await Inventory.findOne({ productId }) : null;

    if (!inventory) {
      const prod = await Product.findOne(
        isObjectId
          ? { _id: productId }
          : { $or: [{ legacyId: productId }, { sku: productId }, { slug: productId }] }
      );
      if (prod) {
        inventory = await Inventory.findOne({ productId: prod._id });
      }
    }

    if (!inventory) throw ApiError.notFound('Inventory record not found.');

    const previousQty = inventory.stockQuantity;
    inventory.stockQuantity = Math.max(0, newQuantity);
    inventory.lastRestockedAt = new Date();
    await inventory.save();

    await Product.findByIdAndUpdate(inventory.productId, {
      available: inventory.stockQuantity > 0,
      isAvailable: inventory.stockQuantity > 0,
    });

    AuditService.log({
      adminId,
      action: 'INVENTORY_ADJUSTED',
      resource: 'Inventory',
      resourceId: inventory._id.toString(),
      details: {
        productId: inventory.productId,
        previousQuantity: previousQty,
        newQuantity: inventory.stockQuantity,
        reason,
      },
    }).catch(() => {});

    return inventory;
  }

  /**
   * Customer Accounts Management with accurate order metrics
   */
  static async getCustomers(search?: string, page = 1, limit = 25): Promise<any> {
    const query: any = {};
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ fullName: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    const populatedCustomers = await Promise.all(
      customers.map(async (c) => {
        const userOrders = await Order.find({
          userId: c._id,
          orderStatus: { $ne: 'CANCELLED' },
        }).sort({ createdAt: -1 });

        const orderCount = userOrders.length;
        const totalPurchaseAmount = userOrders.reduce((sum, ord) => {
          if (
            ['CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(ord.orderStatus) ||
            ord.paymentStatus === 'PAID' ||
            ord.paymentStatus === 'VERIFIED'
          ) {
            return sum + (ord.totalPayableAmount || 0);
          }
          return sum;
        }, 0);

        const lastOrderDate = userOrders.length > 0 ? userOrders[0].createdAt : null;

        return {
          _id: c._id,
          fullName: c.fullName,
          email: c.email,
          phone: c.phone,
          isEmailVerified: c.isEmailVerified,
          status: c.status,
          orderCount,
          totalPurchaseAmount,
          lastOrderDate,
          registrationDate: c.createdAt,
          createdAt: c.createdAt,
        };
      })
    );

    return { customers: populatedCustomers, total, page, pages: Math.ceil(total / limit) };
  }

  static async getSession(
    rawAdminAccessToken?: string
  ): Promise<{ accessToken: string; admin: any }> {
    if (rawAdminAccessToken) {
      try {
        const payload = TokenService.verifyAccessToken(rawAdminAccessToken);
        if (payload.userType === 'admin') {
          const admin = await Admin.findById(payload.userId).populate('role');
          if (admin && admin.status === 'active' && !admin.isLocked()) {
            const roleName = (admin.role as any)?.name || 'ADMIN';
            return {
              accessToken: rawAdminAccessToken,
              admin: {
                _id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role,
                roleName,
              },
            };
          }
        }
      } catch {
        // Token invalid or expired
      }
    }

    throw ApiError.unauthorized('No active admin session.');
  }

  static async toggleCustomerStatus(userId: string, status: 'active' | 'suspended'): Promise<any> {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found.');

    user.status = status;
    await user.save();

    if (status === 'suspended') {
      await TokenService.revokeAllUserSessions(user._id, 'customer');
    }

    return user;
  }

  /**
   * Store Settings
   */
  static async getSettings(): Promise<any> {
    let settings = await StoreSettings.findOne({ singletonKey: 'DEFAULT_SETTINGS' });
    if (!settings) {
      settings = await StoreSettings.create({ singletonKey: 'DEFAULT_SETTINGS' });
    }
    return settings;
  }

  static async updateSettings(data: any, adminId: string): Promise<any> {
    let settings = await StoreSettings.findOne({ singletonKey: 'DEFAULT_SETTINGS' });
    if (!settings) {
      settings = new StoreSettings({ singletonKey: 'DEFAULT_SETTINGS' });
    }

    Object.assign(settings, data);
    await settings.save();

    AuditService.log({
      adminId,
      action: 'STORE_SETTINGS_UPDATED',
      resource: 'StoreSettings',
      details: data,
    }).catch(() => {});

    return settings;
  }

  /**
   * Audit Logs
   */
  static async getAuditLogs(page = 1, limit = 50): Promise<any> {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments(),
    ]);

    return { logs, total, page, pages: Math.ceil(total / limit) };
  }
}
