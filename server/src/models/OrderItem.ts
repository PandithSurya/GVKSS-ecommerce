import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem extends Document {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  sku: string;
  name: string;
  teluguName: string;
  unitPack: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageSnapshot?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    teluguName: { type: String, required: true },
    unitPack: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
    imageSnapshot: { type: String },
  },
  { timestamps: true }
);

export const OrderItem = mongoose.model<IOrderItem>('OrderItem', orderItemSchema);
