import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/token.service.js';
import { Admin, IAdmin } from '../models/Admin.js';
import { IRole } from '../models/Role.js';
import { ApiError } from '../utils/apiError.js';

export interface AuthenticatedAdminRequest extends Request {
  admin?: IAdmin & { role: IRole };
  adminId?: string;
}

export async function authenticateAdmin(
  req: AuthenticatedAdminRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.adminAccessToken) {
      token = req.cookies.adminAccessToken;
    }

    if (!token) {
      throw ApiError.unauthorized('Admin access token missing. Please log in.');
    }

    const payload = TokenService.verifyAccessToken(token);

    if (payload.userType !== 'admin') {
      throw ApiError.forbidden('Administrative privileges required.');
    }

    const admin = await Admin.findById(payload.userId).populate<{ role: IRole }>('role');
    if (!admin) {
      throw ApiError.unauthorized('Admin account not found.');
    }

    if (admin.status === 'suspended') {
      throw ApiError.forbidden('Admin account suspended.');
    }

    if (admin.isLocked()) {
      throw ApiError.forbidden('Admin account temporarily locked due to failed attempts.');
    }

    req.admin = admin as any;
    req.adminId = admin._id.toString();
    next();
  } catch (error) {
    next(error);
  }
}
