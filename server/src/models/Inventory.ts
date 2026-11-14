import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInventory extends Document {
  _id: Types.ObjectId;
  productId: Types.ObjectId;
  sku: string;
  stockQuantity: number;
  reservedQuantity: number;
  minThreshold: number;
  reorderLevel: number;
  lowStockAlertTriggered: boolean;
  lastRestockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    stockQuantity: { type: Number, required: true, min: 0, default: 100 },
    reservedQuantity: { type: Number, required: true, min: 0, default: 0 },
    minThreshold: { type: Number, default: 10 },
    reorderLevel: { type: Number, default: 20 },
    lowStockAlertTriggered: { type: Boolean, default: false },
    lastRestockedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
