import nodemailer from 'nodemailer';
import { config } from '../config/environment.js';
import { logger } from '../config/logger.js';
import { Notification, NotificationType } from '../models/Notification.js';

export interface EmailPayload {
  to: string;
  recipientType: 'CUSTOMER' | 'ADMIN';
  type: NotificationType;
  subject: string;
  htmlContent: string;
  metadata?: Record<string, any>;
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null;

  private static getTransporter(): nodemailer.Transporter | null {
    if (!config.email.enabled) {
      return null;
    }

    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.port === 465,
        auth: {
          user: config.email.user,
          pass: config.email.pass,
        },
      });
    }

    return this.transporter;
  }

  static async sendNotification(payload: EmailPayload): Promise<void> {
    const notification = new Notification({
      recipientEmail: payload.to,
      recipientType: payload.recipientType,
      type: payload.type,
      subject: payload.subject,
      content: payload.htmlContent,
      metadata: payload.metadata,
      isSent: false,
    });

    const transporter = this.getTransporter();

    if (!transporter) {
      // In development / test or when SMTP disabled: log and mark recorded
      logger.info(`[Notification Simulation] Type: ${payload.type} | To: ${payload.to} | Subject: "${payload.subject}"`);
      notification.isSent = true;
      notification.sentAt = new Date();
      await notification.save();
      return;
    }

    try {
      await transporter.sendMail({
        from: config.email.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.htmlContent,
      });

      notification.isSent = true;
      notification.sentAt = new Date();
    } catch (error: any) {
      logger.error(`Failed to send email to ${payload.to}:`, error);
      notification.deliveryError = error?.message || 'Email delivery failed';
    } finally {
      await notification.save();
    }
  }

  // Pre-formatted templates
  static async sendOrderPlaced(orderNumber: string, email: string, total: number, paymentMethod: string): Promise<void> {
    await this.sendNotification({
      to: email,
      recipientType: 'CUSTOMER',
      type: 'ORDER_PLACED',
      subject: `Order Confirmed: ${orderNumber} - GVKSS Organics`,
      htmlContent: `
        <h2>Namaste! Thank you for your order with GVKSS Organics.</h2>
        <p>Order Reference: <strong>${orderNumber}</strong></p>
        <p>Total Amount: <strong>₹${total}</strong></p>
        <p>Payment Mode: <strong>${paymentMethod}</strong></p>
        <p>We are preparing your natural and organic provisions directly from DDS women collectives.</p>
      `,
      metadata: { orderNumber, total, paymentMethod },
    });
  }

  static async sendUtrSubmitted(orderNumber: string, utrNumber: string, email: string): Promise<void> {
    await this.sendNotification({
      to: email,
      recipientType: 'CUSTOMER',
      type: 'UTR_SUBMITTED',
      subject: `Payment Reference Received for Order ${orderNumber}`,
      htmlContent: `
        <h2>UTR Submitted for Verification</h2>
        <p>We have received your payment reference: <strong>${utrNumber}</strong> for Order <strong>${orderNumber}</strong>.</p>
        <p>Our verification team will confirm your payment within 60 minutes and dispatch your order.</p>
      `,
      metadata: { orderNumber, utrNumber },
    });
  }

  static async sendPaymentVerified(orderNumber: string, email: string): Promise<void> {
    await this.sendNotification({
      to: email,
      recipientType: 'CUSTOMER',
      type: 'PAYMENT_CONFIRMED',
      subject: `Payment Verified! Order ${orderNumber} Confirmed`,
      htmlContent: `
        <h2 style="color: #047857;">Payment Successfully Verified</h2>
        <p>Your payment for Order <strong>${orderNumber}</strong> has been verified. Your order is now confirmed and being packed for dispatch.</p>
      `,
      metadata: { orderNumber },
    });
  }

  static async sendPaymentRejected(orderNumber: string, email: string, reason: string): Promise<void> {
    await this.sendNotification({
      to: email,
      recipientType: 'CUSTOMER',
      type: 'PAYMENT_REJECTED',
      subject: `Action Required: Payment Verification for Order ${orderNumber}`,
      htmlContent: `
        <h2 style="color: #b91c1c;">Payment Verification Unsuccessful</h2>
        <p>We could not verify the payment for Order <strong>${orderNumber}</strong>.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please log in or contact our support team at 9391628344 to resubmit your correct transaction reference.</p>
      `,
      metadata: { orderNumber, reason },
    });
  }

  static async notifyAdminNewPayment(orderNumber: string, utrNumber: string, amount: number): Promise<void> {
    await this.sendNotification({
      to: config.business.email,
      recipientType: 'ADMIN',
      type: 'ADMIN_ALERT_NEW_PAYMENT',
      subject: `[ACTION REQUIRED] New UPI Payment Verification - Order ${orderNumber}`,
      htmlContent: `
        <h3>Pending Payment Verification</h3>
        <p>Order: <strong>${orderNumber}</strong></p>
        <p>Amount: <strong>₹${amount}</strong></p>
        <p>Submitted UTR: <strong>${utrNumber}</strong></p>
        <p>Please review bank credit and confirm or reject in the Admin Dashboard.</p>
      `,
      metadata: { orderNumber, utrNumber, amount },
    });
  }
}
