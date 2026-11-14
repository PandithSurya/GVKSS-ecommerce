import { Response, NextFunction } from 'express';
import { UsersService } from './users.service.js';
import { AuthenticatedUserRequest } from '../../middleware/auth.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class UsersController {
  static async getMe(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await UsersService.getProfile(req.userId!);
      sendResponse(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await UsersService.updateProfile(req.userId!, req.body);
      sendResponse(res, { statusCode: 200, message: 'Profile updated successfully.', data });
    } catch (error) {
      next(error);
    }
  }
}
