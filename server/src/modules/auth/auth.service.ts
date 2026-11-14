import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../../models/User.js';
import { TokenService } from '../../services/token.service.js';
import { EmailService } from '../../services/email.service.js';
import { ApiError } from '../../utils/apiError.js';

export class AuthService {
  static async register(data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ user: Partial<IUser> & { id?: string; role?: string }; accessToken: string; refreshToken: string }> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      passwordHash,
      phone: data.phone,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpiresAt,
      status: 'active',
    });

    // Dispatch verification email in background
    EmailService.sendNotification({
      to: user.email,
      recipientType: 'CUSTOMER',
      type: 'REGISTRATION',
      subject: 'Welcome to GVKSS Organics - Please Verify Your Email',
      htmlContent: `
        <h2>Welcome to GVKSS Organics, ${user.fullName}!</h2>
        <p>Thank you for registering. Please click the link below to verify your email address:</p>
        <p><a href="http://localhost:5000/api/v1/auth/verify-email/${emailVerificationToken}">Verify Email</a></p>
      `,
      metadata: { userId: user._id.toString() },
    }).catch(() => {});

    // Create session
    const { accessToken, refreshToken } = await TokenService.createSession(
      user._id,
      'customer',
      data.ipAddress,
      data.userAgent
    );

    return {
      user: {
        _id: user._id,
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: 'customer',
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login(data: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ user: Partial<IUser> & { id?: string; role?: string }; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email: data.email }).select('+passwordHash');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    if (user.status === 'suspended') {
      throw ApiError.forbidden('Your account has been suspended. Please contact customer care.');
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const { accessToken, refreshToken } = await TokenService.createSession(
      user._id,
      'customer',
      data.ipAddress,
      data.userAgent
    );

    return {
      user: {
        _id: user._id,
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: 'customer',
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(
    rawRefreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; newRefreshToken: string; user?: any }> {
    const result = await TokenService.rotateSession(rawRefreshToken, ipAddress, userAgent);
    let user: any = null;
    if (result.userType === 'customer') {
      const dbUser = await User.findById(result.userId).select('-passwordHash');
      if (dbUser) {
        user = {
          _id: dbUser._id,
          id: dbUser._id.toString(),
          fullName: dbUser.fullName,
          email: dbUser.email,
          phone: dbUser.phone,
          role: 'customer',
          isEmailVerified: dbUser.isEmailVerified,
          status: dbUser.status,
        };
      }
    }
    return {
      accessToken: result.accessToken,
      newRefreshToken: result.newRefreshToken,
      user,
    };
  }

  static async getSession(
    rawAccessToken?: string,
    rawRefreshToken?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ accessToken: string; user: any; newRefreshToken?: string }> {
    if (rawAccessToken) {
      try {
        const payload = TokenService.verifyAccessToken(rawAccessToken);
        if (payload.userType === 'customer') {
          const user = await User.findById(payload.userId).select('-passwordHash');
          if (user && user.status === 'active') {
            return {
              accessToken: rawAccessToken,
              user: {
                _id: user._id,
                id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: 'customer',
                isEmailVerified: user.isEmailVerified,
                status: user.status,
              },
            };
          }
        }
      } catch {
        // Token expired, fall back to refreshToken rotation
      }
    }

    if (rawRefreshToken) {
      const refreshed = await this.refreshToken(rawRefreshToken, ipAddress, userAgent);
      if (refreshed.user) {
        return {
          accessToken: refreshed.accessToken,
          newRefreshToken: refreshed.newRefreshToken,
          user: refreshed.user,
        };
      }
    }

    throw ApiError.unauthorized('No active session.');
  }

  static async logout(rawRefreshToken: string): Promise<void> {
    await TokenService.revokeSession(rawRefreshToken);
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      // Return cleanly to prevent email enumeration
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await EmailService.sendNotification({
      to: user.email,
      recipientType: 'CUSTOMER',
      type: 'PASSWORD_RESET',
      subject: 'GVKSS Organics - Password Reset Request',
      htmlContent: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your GVKSS account.</p>
        <p>Use token: <strong>${resetToken}</strong></p>
        <p>This token will expire in 60 minutes.</p>
      `,
    });
  }

  static async resetPassword(token: string, newPass: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired password reset token.');
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPass, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    // Revoke all existing sessions for security
    await TokenService.revokeAllUserSessions(user._id, 'customer');
  }

  static async verifyEmail(token: string): Promise<void> {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired email verification link.');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();
  }
}
