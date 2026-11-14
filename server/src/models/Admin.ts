import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import './Role.js';

export interface IAdmin extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  passwordHash: string;
  role: Types.ObjectId;
  isMfaEnabled: boolean;
  mfaSecret?: string;
  failedLoginAttempts: number;
  lockUntil?: Date;
  status: 'active' | 'suspended';
  lastLoginAt?: Date;
  comparePassword(candidate: string): Promise<boolean>;
  isLocked(): boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true, index: true },
    isMfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, select: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    status: { type: String, enum: ['active', 'suspended'], default: 'active', index: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

adminSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

adminSchema.methods.isLocked = function (): boolean {
  return Boolean(this.lockUntil && this.lockUntil.getTime() > Date.now());
};

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
