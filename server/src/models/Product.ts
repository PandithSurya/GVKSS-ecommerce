import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  legacyId?: string; // e.g. 'prod-01'
  slNo?: number;
  sku: string;
  name: string;
  teluguName: string;
  slug: string;
  category: string; // category slug e.g. 'millets'
  subCategory?: string;
  price: number; // In Rupees (or paise)
  originalPrice?: number;
  discountedPrice?: number;
  quantity: string; // e.g. '1 kg'
  unit: string; // e.g. '1 kg'
  weightGrams?: number;
  image: string;
  additionalImages?: string[];
  description: string;
  teluguDescription: string;
  shortDescription?: string;
  ingredients?: string[];
  nutritionalInfo?: Record<string, string>;
  organicCertDetails?: string;
  available: boolean;
  isReadyToCook?: boolean;
  isReadyToEat?: boolean;
  isFeatured?: boolean;
  isNaturalProduct?: boolean;
  tags: string[];
  source: 'dds_catalog_1' | 'community_center_2' | 'gvkss_palle_santha';
  status: 'active' | 'inactive' | 'draft';
  isSoftDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    legacyId: { type: String, index: true },
    slNo: { type: Number },
    sku: { type: String, required: true, unique: true, index: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true, index: true },
    teluguName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    category: { type: String, required: true, index: true, lowercase: true },
    subCategory: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    quantity: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    weightGrams: { type: Number, default: 1000 },
    image: { type: String, required: true },
    additionalImages: [{ type: String }],
    description: { type: String, required: true },
    teluguDescription: { type: String, required: true },
    shortDescription: { type: String },
    ingredients: [{ type: String }],
    nutritionalInfo: { type: Map, of: String },
    organicCertDetails: { type: String, default: 'DDS Sangham Certified Natural' },
    available: { type: Boolean, default: true, index: true },
    isReadyToCook: { type: Boolean, default: false, index: true },
    isReadyToEat: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isNaturalProduct: { type: Boolean, default: false, index: true },
    tags: [{ type: String, index: true }],
    source: {
      type: String,
      enum: ['dds_catalog_1', 'community_center_2', 'gvkss_palle_santha'],
      default: 'dds_catalog_1',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft'],
      default: 'active',
      index: true,
    },
    isSoftDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Text index for public product search
productSchema.index({ name: 'text', teluguName: 'text', description: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
