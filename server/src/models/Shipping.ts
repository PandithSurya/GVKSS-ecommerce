import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IShipping extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  orderNumber: string;
  courierPartner: string;
  trackingNumber: string;
  shippingLabelUrl?: string;
  status: 'PENDING' | 'DISPATCHED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED';
  shippedAt?: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  trackingHistory: {
    status: string;
    location: string;
    timestamp: Date;
    note?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const shippingSchema = new Schema<IShipping>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
    orderNumber: { type: String, required: true, index: true },
    courierPartner: { type: String, required: true, default: 'Direct Home Delivery' },
    trackingNumber: { type: String, required: true },
    shippingLabelUrl: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    shippedAt: { type: Date },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    trackingHistory: [
      {
        status: { type: String, required: true },
        location: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Shipping = mongoose.model<IShipping>('Shipping', shippingSchema);
