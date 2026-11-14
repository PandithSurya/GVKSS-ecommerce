import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDeliveryTier {
  range: string;
  minOrder: number;
  fee: number;
  conditionEn: string;
  conditionTe: string;
}

export interface IStoreSettings extends Document {
  _id: Types.ObjectId;
  singletonKey: string; // 'DEFAULT_SETTINGS'
  businessNameEn: string;
  businessNameTe: string;
  taglineEn: string;
  taglineTe: string;
  supportEmail: string;
  primaryPhone: string;
  secondaryPhone: string;
  mainStoreAddress: string;
  
  // UPI Payment Configuration
  businessUpiId: string;
  businessDisplayName: string;
  qrCodeImageUrl: string;
  upiPaymentInstructions: string;
  paymentVerificationDeadlineMinutes: number; // e.g. 120 mins
  
  // Shipping & Delivery Settings
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  deliveryTiers: IDeliveryTier[];
  
  // Cash on Delivery Settings
  isCodEnabled: boolean;
  codMinOrderAmount: number;
  codMaxOrderAmount: number;
  codEligiblePinCodes: string[]; // empty means all pin codes
  
  // Store Operating Controls
  isStoreAcceptingOrders: boolean;
  maintenanceMode: boolean;
  taxRatePercentage: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const storeSettingsSchema = new Schema<IStoreSettings>(
  {
    singletonKey: { type: String, required: true, unique: true, default: 'DEFAULT_SETTINGS' },
    businessNameEn: { type: String, default: 'GVKSS - Go Vishwa Kalyana Voluntary Service Organization' },
    businessNameTe: { type: String, default: 'GVKSS గో విశ్వ కళ్యాణ స్వచ్ఛంద సేవా సంస్థ' },
    taglineEn: { type: String, default: 'Go Vishwa Kalyana Voluntary Service Organization • Regd. No. 320 of 2024' },
    taglineTe: { type: String, default: 'గో విశ్వ కళ్యాణ స్వచ్ఛంద సేవా సంస్థ • రిజి. నెం. 320/2024' },
    supportEmail: { type: String, default: 'ddshyderabad@gmail.com' },
    primaryPhone: { type: String, default: '9391628344' },
    secondaryPhone: { type: String, default: '9346749301' },
    mainStoreAddress: {
      type: String,
      default: 'Shop No. 7, H.No. 13-23-130, Janapriya Soudha, Saroornagar, Hyderabad - 500060.',
    },

    businessUpiId: { type: String, default: 'gvkssorganics@upi' },
    businessDisplayName: { type: String, default: 'GVKSS Organics Collectives' },
    qrCodeImageUrl: { type: String, default: '' },
    upiPaymentInstructions: {
      type: String,
      default: 'Scan this official UPI QR code with Google Pay, PhonePe, or Paytm, complete the transfer, and submit your 12-digit UTR transaction reference number below.',
    },
    paymentVerificationDeadlineMinutes: { type: Number, default: 120 },

    standardDeliveryFee: { type: Number, default: 50 },
    freeDeliveryThreshold: { type: Number, default: 1000 },
    deliveryTiers: [
      {
        range: { type: String, default: '0 – 5 Km' },
        minOrder: { type: Number, default: 1000 },
        fee: { type: Number, default: 0 },
        conditionEn: { type: String, default: 'Free Home Delivery on orders above ₹1,000/-' },
        conditionTe: { type: String, default: '₹1,000/- పైబడిన ఆర్డర్లకు 5 కి.మీ వరకు ఉచిత డెలివరీ' },
      },
    ],

    isCodEnabled: { type: Boolean, default: true },
    codMinOrderAmount: { type: Number, default: 200 },
    codMaxOrderAmount: { type: Number, default: 15000 },
    codEligiblePinCodes: [{ type: String }],

    isStoreAcceptingOrders: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    taxRatePercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const StoreSettings = mongoose.model<IStoreSettings>('StoreSettings', storeSettingsSchema);
