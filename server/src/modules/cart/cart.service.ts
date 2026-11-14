import { Types } from 'mongoose';
import { Cart } from '../../models/Cart.js';
import { CartItem } from '../../models/CartItem.js';
import { Product } from '../../models/Product.js';
import { Inventory } from '../../models/Inventory.js';
import { StoreSettings } from '../../models/StoreSettings.js';
import { ApiError } from '../../utils/apiError.js';

export interface CartCalculationResult {
  items: Array<{
    productId: string;
    product: any;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    inStock: boolean;
    availableStock: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  freeDeliveryThreshold: number;
  remainingForFreeDelivery: number;
}

export class CartService {
  private static async getOrCreateCart(userId: string) {
    let cart = await Cart.findOne({ userId, status: 'active' });
    if (!cart) {
      cart = await Cart.create({ userId, status: 'active' });
    }
    return cart;
  }

  static async getCart(userId: string): Promise<CartCalculationResult> {
    const cart = await this.getOrCreateCart(userId);
    const cartItems = await CartItem.find({ cartId: cart._id }).populate('productId');

    const settings = await StoreSettings.findOne({ singletonKey: 'DEFAULT_SETTINGS' });
    const freeDeliveryThreshold = settings?.freeDeliveryThreshold || 1000;
    const standardFee = settings?.standardDeliveryFee || 50;

    let subtotal = 0;
    const formattedItems = [];

    for (const item of cartItems) {
      const product = item.productId as any;
      if (!product || product.isSoftDeleted || product.status !== 'active') {
        continue;
      }

      const inventory = await Inventory.findOne({ productId: product._id });
      const availableStock = inventory ? inventory.stockQuantity : 0;
      const inStock = availableStock >= item.quantity;

      const currentPrice = product.price;
      const lineTotal = currentPrice * item.quantity;
      subtotal += lineTotal;

      formattedItems.push({
        productId: product._id.toString(),
        product: {
          id: product.legacyId || product._id.toString(),
          _id: product._id,
          name: product.name,
          teluguName: product.teluguName,
          category: product.category,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: product.quantity,
          unit: product.unit,
          image: product.image,
          available: product.available && inStock,
        },
        quantity: item.quantity,
        unitPrice: currentPrice,
        lineTotal,
        inStock,
        availableStock,
      });
    }

    const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : standardFee;
    const total = subtotal + deliveryFee;
    const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

    return {
      items: formattedItems,
      subtotal,
      deliveryFee,
      total,
      freeDeliveryThreshold,
      remainingForFreeDelivery,
    };
  }

  static async addItem(userId: string, productIdOrLegacy: string, quantity: number = 1): Promise<void> {
    if (quantity < 1) throw ApiError.badRequest('Quantity must be at least 1.');

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productIdOrLegacy);
    const product = await Product.findOne(
      isObjectId
        ? { _id: productIdOrLegacy, status: 'active', isSoftDeleted: false }
        : {
            $or: [{ slug: productIdOrLegacy }, { legacyId: productIdOrLegacy }],
            status: 'active',
            isSoftDeleted: false,
          }
    );

    if (!product) {
      throw ApiError.notFound('Product not found.');
    }

    // Validate inventory stock
    const inventory = await Inventory.findOne({ productId: product._id });
    if (inventory && inventory.stockQuantity < quantity) {
      throw ApiError.badRequest(
        `Insufficient stock for '${product.name}'. Only ${inventory.stockQuantity} available.`
      );
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await CartItem.findOne({ cartId: cart._id, productId: product._id });
    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (inventory && inventory.stockQuantity < newQty) {
        throw ApiError.badRequest(
          `Cannot add more. Total in cart would exceed stock (${inventory.stockQuantity} available).`
        );
      }
      existingItem.quantity = newQty;
      existingItem.priceSnapshot = product.price;
      await existingItem.save();
    } else {
      await CartItem.create({
        cartId: cart._id,
        productId: product._id,
        quantity,
        priceSnapshot: product.price,
      });
    }

    cart.lastActivityAt = new Date();
    await cart.save();
  }

  static async updateQuantity(userId: string, productIdOrLegacy: string, quantity: number): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productIdOrLegacy);
    const product = await Product.findOne(
      isObjectId ? { _id: productIdOrLegacy } : { $or: [{ slug: productIdOrLegacy }, { legacyId: productIdOrLegacy }] }
    );

    if (!product) throw ApiError.notFound('Product not found.');

    if (quantity <= 0) {
      await CartItem.findOneAndDelete({ cartId: cart._id, productId: product._id });
      return;
    }

    const inventory = await Inventory.findOne({ productId: product._id });
    if (inventory && inventory.stockQuantity < quantity) {
      throw ApiError.badRequest(`Cannot update quantity: only ${inventory.stockQuantity} available in stock.`);
    }

    await CartItem.findOneAndUpdate(
      { cartId: cart._id, productId: product._id },
      { quantity, priceSnapshot: product.price },
      { upsert: true }
    );
  }

  static async removeItem(userId: string, productIdOrLegacy: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(productIdOrLegacy);
    const product = await Product.findOne(
      isObjectId ? { _id: productIdOrLegacy } : { $or: [{ slug: productIdOrLegacy }, { legacyId: productIdOrLegacy }] }
    );

    if (product) {
      await CartItem.findOneAndDelete({ cartId: cart._id, productId: product._id });
    }
  }

  static async clearCart(userId: string): Promise<void> {
    const cart = await Cart.findOne({ userId, status: 'active' });
    if (cart) {
      await CartItem.deleteMany({ cartId: cart._id });
    }
  }

  static async syncGuestCart(userId: string, guestItems: Array<{ id: string; quantity: number }>): Promise<void> {
    if (!Array.isArray(guestItems) || guestItems.length === 0) return;

    for (const item of guestItems) {
      try {
        await this.addItem(userId, item.id, item.quantity || 1);
      } catch {
        // Continue merging other available items
      }
    }
  }
}
