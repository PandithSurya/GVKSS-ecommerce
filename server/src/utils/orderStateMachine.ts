import { OrderStatus, PaymentMethod } from '../models/Order.js';
import { ApiError } from './apiError.js';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['PROCESSING_PAYMENT_VERIFICATION', 'CANCELLED'],
  PROCESSING_PAYMENT_VERIFICATION: ['CONFIRMED', 'PAYMENT_REJECTED', 'CANCELLED'],
  PAYMENT_REJECTED: ['PROCESSING_PAYMENT_VERIFICATION', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'DELIVERED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'RETURNED'],
  DELIVERED: [], // Terminal
  CANCELLED: [], // Terminal
  RETURNED: ['REFUND_PENDING', 'REFUNDED'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [], // Terminal
};

export function validateOrderStateTransition(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  paymentMethod: PaymentMethod,
  paymentStatus: string
): void {
  if (currentStatus === targetStatus) {
    return;
  }

  const validTargets = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!validTargets.includes(targetStatus)) {
    throw ApiError.badRequest(
      `Invalid order state transition from '${currentStatus}' to '${targetStatus}'. Allowed next states: [${validTargets.join(', ')}]`
    );
  }

  // Business rule 1: An order cannot be shipped or packed without confirmed status
  if (['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(targetStatus)) {
    if (paymentMethod === 'UPI' && paymentStatus !== 'VERIFIED') {
      throw ApiError.badRequest('Cannot progress order: UPI payment must be verified first.');
    }
  }

  // Business rule 2: Delivered orders cannot be changed back
  if (currentStatus === 'DELIVERED') {
    throw ApiError.badRequest('Delivered orders cannot be modified.');
  }

  // Business rule 3: Cancelled orders cannot be resurrected
  if (currentStatus === 'CANCELLED') {
    throw ApiError.badRequest('Cancelled orders cannot be altered.');
  }
}
