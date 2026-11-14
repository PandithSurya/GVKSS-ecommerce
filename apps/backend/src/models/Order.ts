import mongoose, { Document, Schema, Types } from 'mongoose';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PROCESSING_PAYMENT_VERIFICATION'
  | 'CONFIRMED'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'PAYMENT_REJECTED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'RETURNED';

export type PaymentMethod = 'UPI' | 'COD';

export interface IShippingAddressSnapshot {
  fullName: string;
  phone: string;
  email?: string;
  houseStreet: string;
  areaLocality: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  notes?: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderNumber: string; // e.g. 'GVKSS-20261113-102938'
  userId?: Types.ObjectId;
  customerSnapshot: {
    fullName: string;
    phone: string;
    email: string;
  };
  shippingAddress: IShippingAddressSnapshot;
  itemsSubtotal: number;
  discountAmount: number;
  deliveryFee: number;
  totalPayableAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PENDING' | 'SUBMITTED_FOR_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'COD_PENDING' | 'PAID' | 'REFUNDED';
  orderStatus: OrderStatus;
  cancellationReason?: string;
  cancelledAt?: Date;
  cancelledBy?: string;
  trackingNumber?: string;
  courierName?: string;
  dispatchDate?: Date;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    customerSnapshot: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      houseStreet: { type: String, required: true },
      areaLocality: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true, default: 'Telangana' },
      pinCode: { type: String, required: true },
      landmark: { type: String },
      notes: { type: String },
    },
    itemsSubtotal: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    deliveryFee: { type: Number, required: true, min: 0 },
    totalPayableAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['UPI', 'COD'], required: true, index: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'SUBMITTED_FOR_VERIFICATION', 'VERIFIED', 'REJECTED', 'COD_PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: [
        'PENDING_PAYMENT',
        'PROCESSING_PAYMENT_VERIFICATION',
        'CONFIRMED',
        'PACKED',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'CANCELLED',
        'PAYMENT_REJECTED',
        'REFUND_PENDING',
        'REFUNDED',
        'RETURNED',
      ],
      default: 'PENDING_PAYMENT',
      index: true,
    },
    cancellationReason: { type: String },
    cancelledAt: { type: Date },
    cancelledBy: { type: String },
    trackingNumber: { type: String },
    courierName: { type: String },
    dispatchDate: { type: Date },
    deliveryDate: { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
