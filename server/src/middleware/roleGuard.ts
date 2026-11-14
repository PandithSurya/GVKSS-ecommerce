import { Response, NextFunction } from 'express';
import { AuthenticatedAdminRequest } from './adminAuth.js';
import { RoleName } from '../models/Role.js';
import { ApiError } from '../utils/apiError.js';

export function roleGuard(allowedRoles: RoleName[]) {
  return (req: AuthenticatedAdminRequest, _res: Response, next: NextFunction): void => {
    if (!req.admin || !req.admin.role) {
      return next(ApiError.forbidden('Administrative authorization missing.'));
    }

    const currentRoleName = req.admin.role.name;

    // Super Admin always bypasses specific role restrictions
    if (currentRoleName === 'SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(currentRoleName)) {
      return next(
        ApiError.forbidden(
          `Permission Denied: Your role '${req.admin.role.displayName}' is not authorized to perform this operation.`
        )
      );
    }

    next();
  };
}
