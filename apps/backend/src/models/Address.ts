import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAddress extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  fullName: string;
  phone: string;
  houseStreet: string;
  areaLocality: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    houseStreet: { type: String, required: true, trim: true },
    areaLocality: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, default: 'Hyderabad' },
    state: { type: String, required: true, trim: true, default: 'Telangana' },
    pinCode: { type: String, required: true, trim: true, match: [/^[0-9]{6}$/, 'Must be a 6-digit pin code'] },
    landmark: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Address = mongoose.model<IAddress>('Address', addressSchema);
