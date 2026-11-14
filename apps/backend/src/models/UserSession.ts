import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserSession extends Document {
  _id: Types.ObjectId;
  userId?: Types.ObjectId;
  adminId?: Types.ObjectId;
  userType: 'customer' | 'admin';
  refreshTokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSessionSchema = new Schema<IUserSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', index: true },
    userType: { type: String, enum: ['customer', 'admin'], required: true },
    refreshTokenHash: { type: String, required: true, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    isRevoked: { type: Boolean, default: false, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL Index
  },
  { timestamps: true }
);

export const UserSession = mongoose.model<IUserSession>('UserSession', userSessionSchema);
