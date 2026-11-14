import mongoose, { Document, Schema, Types } from 'mongoose';

export type NotificationType =
  | 'REGISTRATION'
  | 'EMAIL_VERIFICATION'
  | 'PASSWORD_RESET'
  | 'ORDER_PLACED'
  | 'UTR_SUBMITTED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_REJECTED'
  | 'ORDER_PACKED'
  | 'ORDER_SHIPPED'
  | 'ORDER_DELIVERED'
  | 'ORDER_CANCELLED'
  | 'ADMIN_ALERT_NEW_PAYMENT'
  | 'ADMIN_ALERT_NEW_ORDER';

export interface INotification extends Document {
  _id: Types.ObjectId;
  recipientEmail: string;
  recipientPhone?: string;
  recipientType: 'CUSTOMER' | 'ADMIN';
  type: NotificationType;
  subject: string;
  content: string;
  metadata?: Record<string, any>;
  isSent: boolean;
  sentAt?: Date;
  deliveryError?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientEmail: { type: String, required: true, index: true },
    recipientPhone: { type: String },
    recipientType: { type: String, enum: ['CUSTOMER', 'ADMIN'], required: true },
    type: { type: String, required: true, index: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    isSent: { type: Boolean, default: false, index: true },
    sentAt: { type: Date },
    deliveryError: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

notificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
