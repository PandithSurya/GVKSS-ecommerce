import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service.js';
import { User, IUser } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

export interface AuthenticatedUserRequest extends Request {
  user?: IUser;
  userId?: string;
}

export async function authenticateCustomer(
  req: AuthenticatedUserRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication token is missing. Please log in.');
    }

    const payload = TokenService.verifyAccessToken(token);

    if (payload.userType !== 'customer') {
      throw ApiError.forbidden('Access restricted to customer accounts.');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw ApiError.unauthorized('User account not found.');
    }

    if (user.status === 'suspended') {
      throw ApiError.forbidden('Your account has been suspended. Please contact support.');
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional customer authentication: parses user if token exists, but doesn't block if guest.
 */
export async function optionalCustomer(
  req: AuthenticatedUserRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const payload = TokenService.verifyAccessToken(token);
        if (payload.userType === 'customer') {
          const user = await User.findById(payload.userId);
          if (user && user.status === 'active') {
            req.user = user;
            req.userId = user._id.toString();
          }
        }
      } catch {
        // Ignore invalid token for optional auth
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
