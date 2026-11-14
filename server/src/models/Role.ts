import mongoose, { Document, Schema, Types } from 'mongoose';

export type RoleName =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'ORDER_MANAGER'
  | 'PAYMENT_VERIFIER'
  | 'INVENTORY_MANAGER';

export interface IRole extends Document {
  _id: Types.ObjectId;
  name: RoleName;
  displayName: string;
  description: string;
  permissions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      enum: ['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER', 'PAYMENT_VERIFIER', 'INVENTORY_MANAGER'],
    },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', roleSchema);
