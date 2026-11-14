import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProductImage extends Document {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const productImageSchema = new Schema<IProductImage>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    url: { type: String, required: true },
    altText: { type: String },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProductImage = mongoose.model<IProductImage>('ProductImage', productImageSchema);
