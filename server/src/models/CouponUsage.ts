import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICouponUsage extends Document {
  _id: Types.ObjectId;
  couponId: Types.ObjectId;
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  discountAmount: number;
  usedAt: Date;
}

const couponUsageSchema = new Schema<ICouponUsage>(
  {
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    discountAmount: { type: Number, required: true, min: 0 },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

couponUsageSchema.index({ couponId: 1, userId: 1 });

export const CouponUsage = mongoose.model<ICouponUsage>('CouponUsage', couponUsageSchema);
