import { Types } from 'mongoose';
import { Order, IOrder } from '../../models/Order.js';
import { OrderItem } from '../../models/OrderItem.js';
import { Payment } from '../../models/Payment.js';
import { Inventory } from '../../models/Inventory.js';
import { OrderStatusHistory } from '../../models/OrderStatusHistory.js';
import { runInTransaction } from '../../utils/dbTransaction.js';
import { ApiError } from '../../utils/apiError.js';

export class OrderService {
  static async getCustomerOrders(userId: string, page = 1, limit = 20): Promise<{
    orders: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const query = { userId: new Types.ObjectId(userId) };

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(query),
    ]);

    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await OrderItem.find({ orderId: order._id });
        const payment = await Payment.findOne({ orderId: order._id });
        return {
          ...order.toObject(),
          items,
          payment,
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

  static async getOrderByNumber(orderNumber: string, userId?: string): Promise<any> {
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      throw ApiError.notFound(`Order with ID '${orderNumber}' not found.`);
    }

    // Authorization check: if order belongs to a user and caller is authenticated as another user, forbid
    if (order.userId && userId && order.userId.toString() !== userId) {
      throw ApiError.forbidden('You are not authorized to view this order.');
    }

    const [items, payment, statusHistory] = await Promise.all([
      OrderItem.find({ orderId: order._id }),
      Payment.findOne({ orderId: order._id }),
      OrderStatusHistory.find({ orderId: order._id }).sort({ createdAt: 1 }),
    ]);

    return {
      ...order.toObject(),
      items,
      payment,
      statusHistory,
    };
  }

  static async cancelOrder(orderNumber: string, userId?: string, reason?: string): Promise<IOrder> {
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      throw ApiError.notFound('Order not found.');
    }

    if (order.userId && userId && order.userId.toString() !== userId) {
      throw ApiError.forbidden('You are not authorized to cancel this order.');
    }

    const nonCancellableStates = ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (nonCancellableStates.includes(order.orderStatus)) {
      throw ApiError.badRequest(
        `Order cannot be cancelled in its current status '${order.orderStatus}'. Please contact helpline.`
      );
    }

    return runInTransaction(async (session) => {
      const previousStatus = order.orderStatus;
      order.orderStatus = 'CANCELLED';
      order.cancellationReason = reason || 'Cancelled by customer';
      order.cancelledAt = new Date();
      order.cancelledBy = userId ? 'CUSTOMER' : 'GUEST';
      await order.save({ session });

      // Restore inventory
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

      await OrderStatusHistory.create(
        [
          {
            orderId: order._id,
            fromStatus: previousStatus,
            toStatus: 'CANCELLED',
            changedBy: 'CUSTOMER',
            comment: `Order cancelled. Reason: ${reason || 'Customer requested cancellation'}`,
          },
        ],
        { session }
      );

      return order;
    });
  }
}
