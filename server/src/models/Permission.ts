import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPermission extends Document {
  _id: Types.ObjectId;
  name: string;
  code: string;
  module: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, index: true },
    module: { type: String, required: true, trim: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema);
