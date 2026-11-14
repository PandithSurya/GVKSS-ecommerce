import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICategory extends Document {
  _id: Types.ObjectId;
  slug: string; // e.g. 'millets', 'flours'
  name: string;
  teluguName: string;
  icon: string;
  description: string;
  teluguDescription: string;
  image: string;
  badge?: string;
  benefitEn?: string;
  benefitTe?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    teluguName: { type: String, required: true, trim: true },
    icon: { type: String, required: true, default: 'Leaf' },
    description: { type: String, required: true },
    teluguDescription: { type: String, required: true },
    image: { type: String, required: true },
    badge: { type: String },
    benefitEn: { type: String },
    benefitTe: { type: String },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
