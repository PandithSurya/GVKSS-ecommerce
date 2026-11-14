import mongoose, { Document, Schema, Types } from 'mongoose';
import { OrderStatus } from './Order.js';

export interface IOrderStatusHistory extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  changedBy: 'CUSTOMER' | 'ADMIN' | 'SYSTEM';
  changedById?: Types.ObjectId;
  comment?: string;
  createdAt: Date;
}

const orderStatusHistorySchema = new Schema<IOrderStatusHistory>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    fromStatus: { type: String, required: true },
    toStatus: { type: String, required: true },
    changedBy: { type: String, enum: ['CUSTOMER', 'ADMIN', 'SYSTEM'], required: true },
    changedById: { type: Schema.Types.ObjectId },
    comment: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const OrderStatusHistory = mongoose.model<IOrderStatusHistory>(
  'OrderStatusHistory',
  orderStatusHistorySchema
);
