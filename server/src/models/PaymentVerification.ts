import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPaymentVerification extends Document {
  _id: Types.ObjectId;
  paymentId: Types.ObjectId;
  orderId: Types.ObjectId;
  adminId: Types.ObjectId;
  action: 'CONFIRM' | 'REJECT';
  submittedUtr: string;
  orderAmount: number;
  verifiedAmount?: number;
  notes?: string;
  rejectionReason?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const paymentVerificationSchema = new Schema<IPaymentVerification>(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true, index: true },
    action: { type: String, enum: ['CONFIRM', 'REJECT'], required: true },
    submittedUtr: { type: String, required: true },
    orderAmount: { type: Number, required: true },
    verifiedAmount: { type: Number },
    notes: { type: String },
    rejectionReason: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PaymentVerification = mongoose.model<IPaymentVerification>(
  'PaymentVerification',
  paymentVerificationSchema
);
