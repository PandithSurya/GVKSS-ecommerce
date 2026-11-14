import { Types } from 'mongoose';
import { Payment, IPayment } from '../../models/Payment.js';
import { Order } from '../../models/Order.js';
import { PaymentVerification } from '../../models/PaymentVerification.js';
import { OrderStatusHistory } from '../../models/OrderStatusHistory.js';
import { EmailService } from '../../services/email.service.js';
import { AuditService } from '../../services/audit.service.js';
import { runInTransaction } from '../../utils/dbTransaction.js';
import { ApiError } from '../../utils/apiError.js';

export class PaymentService {
  /**
   * Customer submits UTR for a pending UPI payment
   */
  static async submitUtr(orderNumberOrId: string, utrNumber: string): Promise<IPayment> {
    const cleanUtr = utrNumber.trim().toUpperCase();

    // Validate UTR format: standard Indian UPI UTR is 12 digits (or alphanumeric reference)
    if (!/^[A-Za-z0-9]{10,22}$/.test(cleanUtr)) {
      throw ApiError.badRequest('Invalid UTR reference format. Must be a 12-digit bank reference number.');
    }

    // Check if this UTR has already been submitted for any payment (Replay Protection)
    const existingPaymentWithUtr = await Payment.findOne({ utrNumber: cleanUtr });
    if (existingPaymentWithUtr) {
      throw ApiError.conflict(
        `This UTR reference number '${cleanUtr}' has already been submitted for another order. Replay is strictly forbidden.`
      );
    }

    // Locate the payment record for this order
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(orderNumberOrId);
    const query = isObjectId ? { orderId: orderNumberOrId } : { orderNumber: orderNumberOrId };

    const payment = await Payment.findOne(query);
    if (!payment) {
      throw ApiError.notFound('Payment record not found for this order.');
    }

    if (payment.paymentMethod !== 'UPI') {
      throw ApiError.badRequest('UTR submission is only valid for UPI orders.');
    }

    if (payment.status === 'VERIFIED') {
      throw ApiError.badRequest('This payment has already been verified and confirmed.');
    }

    return runInTransaction(async (session) => {
      payment.utrNumber = cleanUtr;
      payment.submittedAt = new Date();
      payment.status = 'SUBMITTED_FOR_VERIFICATION';
      payment.retryCount += 1;
      await payment.save({ session });

      // Update Order status
      const order = await Order.findById(payment.orderId).session(session);
      if (order) {
        const previousStatus = order.orderStatus;
        order.paymentStatus = 'SUBMITTED_FOR_VERIFICATION';
        order.orderStatus = 'PROCESSING_PAYMENT_VERIFICATION';
        await order.save({ session });

        await OrderStatusHistory.create(
          [
            {
              orderId: order._id,
              fromStatus: previousStatus,
              toStatus: 'PROCESSING_PAYMENT_VERIFICATION',
              changedBy: 'CUSTOMER',
              comment: `Customer submitted UTR: ${cleanUtr}`,
            },
          ],
          { session }
        );

        // Notifications
        EmailService.sendUtrSubmitted(order.orderNumber, cleanUtr, order.customerSnapshot.email).catch(() => {});
        EmailService.notifyAdminNewPayment(order.orderNumber, cleanUtr, payment.amount).catch(() => {});
      }

      return payment;
    });
  }

  /**
   * Admin confirms payment verification after checking actual bank transaction
   */
  static async confirmPayment(
    paymentId: string,
    adminId: string,
    adminEmail?: string,
    notes?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ payment: IPayment; order: any }> {
    if (!paymentId || paymentId === 'undefined' || paymentId === 'null') {
      throw ApiError.badRequest('A valid payment ID is required.');
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(paymentId);
    let payment = isObjectId ? await Payment.findById(paymentId) : null;
    if (!payment && isObjectId) {
      payment = await Payment.findOne({ orderId: paymentId });
    }
    if (!payment) {
      payment = await Payment.findOne({ orderNumber: paymentId });
    }

    if (!payment) {
      throw ApiError.notFound('Payment record not found.');
    }

    if (payment.status === 'VERIFIED') {
      throw ApiError.badRequest('This payment is already verified.');
    }

    if (!payment.utrNumber) {
      throw ApiError.badRequest('Cannot confirm payment: No UTR reference has been submitted by the customer.');
    }

    return runInTransaction(async (session) => {
      // 1. Update Payment
      payment.status = 'VERIFIED';
      payment.verifiedAt = new Date();
      payment.verifiedByAdminId = new Types.ObjectId(adminId);
      payment.adminVerificationNotes = notes;
      await payment.save({ session });

      // 2. Update Order
      const order = await Order.findById(payment.orderId).session(session);
      if (!order) {
        throw ApiError.notFound('Associated order not found.');
      }

      const previousStatus = order.orderStatus;
      order.paymentStatus = 'VERIFIED';
      order.orderStatus = 'CONFIRMED';
      await order.save({ session });

      // 3. Status History
      await OrderStatusHistory.create(
        [
          {
            orderId: order._id,
            fromStatus: previousStatus,
            toStatus: 'CONFIRMED',
            changedBy: 'ADMIN',
            changedById: new Types.ObjectId(adminId),
            comment: `Payment confirmed by Admin. Verified UTR: ${payment.utrNumber}. Notes: ${notes || 'None'}`,
          },
        ],
        { session }
      );

      // 4. Verification Audit Log
      await PaymentVerification.create(
        [
          {
            paymentId: payment._id,
            orderId: order._id,
            adminId: new Types.ObjectId(adminId),
            action: 'CONFIRM',
            submittedUtr: payment.utrNumber,
            orderAmount: payment.amount,
            verifiedAmount: payment.amount,
            notes,
            ipAddress,
            userAgent,
          },
        ],
        { session }
      );

      // 5. Admin Security Audit Log
      AuditService.log({
        adminId,
        adminEmail,
        action: 'PAYMENT_CONFIRMED',
        resource: 'Payment',
        resourceId: payment._id.toString(),
        ipAddress,
        userAgent,
        details: {
          orderNumber: order.orderNumber,
          amount: payment.amount,
          utrNumber: payment.utrNumber,
        },
      }).catch(() => {});

      // 6. Notify customer
      EmailService.sendPaymentVerified(order.orderNumber, order.customerSnapshot.email).catch(() => {});

      return { payment, order };
    });
  }

  /**
   * Admin rejects payment with a mandatory reason
   */
  static async rejectPayment(
    paymentId: string,
    adminId: string,
    reason: string,
    adminEmail?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ payment: IPayment; order: any }> {
    if (!paymentId || paymentId === 'undefined' || paymentId === 'null') {
      throw ApiError.badRequest('A valid payment ID is required.');
    }

    if (!reason || reason.trim().length < 5) {
      throw ApiError.badRequest('A clear rejection reason (minimum 5 characters) is required.');
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(paymentId);
    let payment = isObjectId ? await Payment.findById(paymentId) : null;
    if (!payment && isObjectId) {
      payment = await Payment.findOne({ orderId: paymentId });
    }
    if (!payment) {
      payment = await Payment.findOne({ orderNumber: paymentId });
    }

    if (!payment) {
      throw ApiError.notFound('Payment record not found.');
    }

    if (payment.status === 'VERIFIED') {
      throw ApiError.badRequest('Cannot reject an already verified payment.');
    }

    return runInTransaction(async (session) => {
      const rejectedUtr = payment.utrNumber || 'N/A';

      // Reset UTR so customer can re-enter or another order isn't permanently blocked if customer made a typo
      payment.status = 'REJECTED';
      payment.rejectedAt = new Date();
      payment.rejectionReason = reason.trim();
      payment.utrNumber = undefined; // Clears unique index lock to allow retry
      await payment.save({ session });

      const order = await Order.findById(payment.orderId).session(session);
      if (!order) {
        throw ApiError.notFound('Associated order not found.');
      }

      const previousStatus = order.orderStatus;
      order.paymentStatus = 'REJECTED';
      order.orderStatus = 'PAYMENT_REJECTED';
      await order.save({ session });

      await OrderStatusHistory.create(
        [
          {
            orderId: order._id,
            fromStatus: previousStatus,
            toStatus: 'PAYMENT_REJECTED',
            changedBy: 'ADMIN',
            changedById: new Types.ObjectId(adminId),
            comment: `Payment rejected by Admin. Reason: ${reason}`,
          },
        ],
        { session }
      );

      await PaymentVerification.create(
        [
          {
            paymentId: payment._id,
            orderId: order._id,
            adminId: new Types.ObjectId(adminId),
            action: 'REJECT',
            submittedUtr: rejectedUtr,
            orderAmount: payment.amount,
            rejectionReason: reason.trim(),
            ipAddress,
            userAgent,
          },
        ],
        { session }
      );

      AuditService.log({
        adminId,
        adminEmail,
        action: 'PAYMENT_REJECTED',
        resource: 'Payment',
        resourceId: payment._id.toString(),
        ipAddress,
        userAgent,
        details: {
          orderNumber: order.orderNumber,
          reason,
          rejectedUtr,
        },
      }).catch(() => {});

      EmailService.sendPaymentRejected(order.orderNumber, order.customerSnapshot.email, reason).catch(() => {});

      return { payment, order };
    });
  }

  /**
   * Fetch pending UPI payments for Admin Verification Desk
   */
  static async getPendingPayments(): Promise<any[]> {
    const payments = await Payment.find({ status: 'SUBMITTED_FOR_VERIFICATION' })
      .sort({ submittedAt: 1 })
      .populate('orderId');

    return payments.map((p) => {
      const order = p.orderId as any;
      return {
        _id: p._id,
        id: p._id,
        paymentId: p._id,
        orderId: order?._id,
        orderNumber: p.orderNumber,
        customerName: order?.customerSnapshot?.fullName || 'N/A',
        customerPhone: order?.customerSnapshot?.phone || 'N/A',
        customerEmail: order?.customerSnapshot?.email || 'N/A',
        amount: p.amount,
        utrNumber: p.utrNumber,
        submittedAt: p.submittedAt,
        status: p.status,
        paymentMethod: p.paymentMethod,
        retryCount: p.retryCount,
      };
    });
  }
}
