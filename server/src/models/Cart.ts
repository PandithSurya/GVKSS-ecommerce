import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICart extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  status: 'active' | 'converted' | 'abandoned';
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    status: { type: String, enum: ['active', 'converted', 'abandoned'], default: 'active', index: true },
    lastActivityAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
