import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Types } from 'mongoose';
import { config } from '../config/environment.js';
import { UserSession } from '../models/UserSession.js';
import { ApiError } from '../utils/apiError.js';

export interface TokenPayload {
  userId: string;
  email: string;
  userType: 'customer' | 'admin';
  role?: string;
  permissions?: string[];
}

export class TokenService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions['expiresIn'],
    });
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
    } catch {
      throw ApiError.unauthorized('Invalid or expired access token');
    }
  }

  static async createSession(
    entityId: Types.ObjectId,
    userType: 'customer' | 'admin',
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    // 7-day expiration for refresh token session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const sessionData: any = {
      userType,
      refreshTokenHash,
      ipAddress,
      userAgent,
      isRevoked: false,
      expiresAt,
    };

    if (userType === 'customer') {
      sessionData.userId = entityId;
    } else {
      sessionData.adminId = entityId;
    }

    await UserSession.create(sessionData);

    const accessToken = this.generateAccessToken({
      userId: entityId.toString(),
      email: '', // filled by caller if needed
      userType,
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }

  static async rotateSession(
    rawRefreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; newRefreshToken: string; userId: string; userType: 'customer' | 'admin' }> {
    const hash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const session = await UserSession.findOne({ refreshTokenHash: hash, isRevoked: false });

    if (!session || session.expiresAt.getTime() < Date.now()) {
      throw ApiError.unauthorized('Invalid or expired session. Please log in again.');
    }

    // Revoke old session immediately (Token Rotation)
    session.isRevoked = true;
    await session.save();

    // Create fresh session
    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newHash = crypto.createHash('sha256').update(newRawRefreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const entityId = session.userType === 'customer' ? session.userId! : session.adminId!;

    await UserSession.create({
      userId: session.userId,
      adminId: session.adminId,
      userType: session.userType,
      refreshTokenHash: newHash,
      ipAddress: ipAddress || session.ipAddress,
      userAgent: userAgent || session.userAgent,
      isRevoked: false,
      expiresAt,
    });

    const accessToken = this.generateAccessToken({
      userId: entityId.toString(),
      email: '',
      userType: session.userType,
    });

    return {
      accessToken,
      newRefreshToken: newRawRefreshToken,
      userId: entityId.toString(),
      userType: session.userType,
    };
  }

  static async revokeSession(rawRefreshToken: string): Promise<void> {
    const hash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    await UserSession.updateOne({ refreshTokenHash: hash }, { isRevoked: true });
  }

  static async revokeAllUserSessions(entityId: Types.ObjectId, userType: 'customer' | 'admin'): Promise<void> {
    const query = userType === 'customer' ? { userId: entityId } : { adminId: entityId };
    await UserSession.updateMany(query, { isRevoked: true });
  }
}
