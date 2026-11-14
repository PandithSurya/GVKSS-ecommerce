import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { config } from '../../config/environment.js';

const isProduction = config.nodeEnv === 'production';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      // Set secure refresh token cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      sendResponse(res, {
        statusCode: 201,
        message: 'Registration successful! Verification email sent.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login({
        email: req.body.email,
        password: req.body.password,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      sendResponse(res, {
        statusCode: 200,
        message: 'Login successful.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (!rawRefreshToken) {
        res.status(401).json({ success: false, message: 'Refresh token missing.' });
        return;
      }

      const result = await AuthService.refreshToken(
        rawRefreshToken,
        req.ip,
        req.headers['user-agent']
      );

      res.cookie('refreshToken', result.newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      sendResponse(res, {
        statusCode: 200,
        message: 'Token refreshed successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
      const accessToken = bearerToken || req.cookies?.accessToken;
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      const result = await AuthService.getSession(accessToken, refreshToken, req.ip, req.headers['user-agent']);

      if (result.newRefreshToken) {
        res.cookie('refreshToken', result.newRefreshToken, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'strict' : 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      sendResponse(res, {
        statusCode: 200,
        message: 'Session active.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
      if (rawRefreshToken) {
        await AuthService.logout(rawRefreshToken);
      }

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');

      sendResponse(res, {
        statusCode: 200,
        message: 'Successfully logged out.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.forgotPassword(req.body.email);
      sendResponse(res, {
        statusCode: 200,
        message: 'If the email exists, a password reset link has been dispatched.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.resetPassword(req.body.token, req.body.newPassword);
      sendResponse(res, {
        statusCode: 200,
        message: 'Password has been reset successfully. Please log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.verifyEmail(req.params.token as string);
      sendResponse(res, {
        statusCode: 200,
        message: 'Email successfully verified.',
      });
    } catch (error) {
      next(error);
    }
  }
}
