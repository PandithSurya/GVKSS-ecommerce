import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICartItem extends Document {
  _id: Types.ObjectId;
  cartId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  priceSnapshot: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    cartId: { type: Schema.Types.ObjectId, ref: 'Cart', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    priceSnapshot: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// Unique compound index: a product can only appear once per cart
cartItemSchema.index({ cartId: 1, productId: 1 }, { unique: true });

export const CartItem = mongoose.model<ICartItem>('CartItem', cartItemSchema);
