import mongoose, { Document, Schema, Types } from 'mongoose';

export type PaymentStatus =
  | 'PENDING'
  | 'SUBMITTED_FOR_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED'
  | 'COD_PENDING'
  | 'PAID'
  | 'REFUNDED';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  orderNumber: string;
  paymentMethod: 'UPI' | 'COD';
  amount: number;
  currency: string;
  status: PaymentStatus;
  utrNumber?: string;
  submittedAt?: Date;
  verifiedAt?: Date;
  verifiedByAdminId?: Types.ObjectId;
  rejectedAt?: Date;
  rejectionReason?: string;
  adminVerificationNotes?: string;
  retryCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    orderNumber: { type: String, required: true, index: true },
    paymentMethod: { type: String, enum: ['UPI', 'COD'], required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['PENDING', 'SUBMITTED_FOR_VERIFICATION', 'VERIFIED', 'REJECTED', 'COD_PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    utrNumber: {
      type: String,
      trim: true,
      sparse: true,
      unique: true, // Prevents duplicate UTR across all payments
    },
    submittedAt: { type: Date },
    verifiedAt: { type: Date },
    verifiedByAdminId: { type: Schema.Types.ObjectId, ref: 'Admin' },
    rejectedAt: { type: Date },
    rejectionReason: { type: String },
    adminVerificationNotes: { type: String },
    retryCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
