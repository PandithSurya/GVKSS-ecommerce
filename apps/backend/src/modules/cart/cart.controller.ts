import { Response, NextFunction } from 'express';
import { CartService } from './cart.service.js';
import { AuthenticatedUserRequest } from '../../middleware/auth.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class CartController {
  static async getCart(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await CartService.getCart(req.userId!);
      sendResponse(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId, quantity } = req.body;
      await CartService.addItem(req.userId!, productId, Number(quantity || 1));
      const data = await CartService.getCart(req.userId!);
      sendResponse(res, { statusCode: 200, message: 'Item added to cart.', data });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantity(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = req.params.productId as string;
      const { quantity } = req.body;
      await CartService.updateQuantity(req.userId!, productId, Number(quantity));
      const data = await CartService.getCart(req.userId!);
      sendResponse(res, { statusCode: 200, message: 'Cart updated.', data });
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const productId = req.params.productId as string;
      await CartService.removeItem(req.userId!, productId);
      const data = await CartService.getCart(req.userId!);
      sendResponse(res, { statusCode: 200, message: 'Item removed from cart.', data });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await CartService.clearCart(req.userId!);
      sendResponse(res, { statusCode: 200, message: 'Cart cleared.' });
    } catch (error) {
      next(error);
    }
  }

  static async sync(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await CartService.syncGuestCart(req.userId!, req.body.items || []);
      const data = await CartService.getCart(req.userId!);
      sendResponse(res, { statusCode: 200, message: 'Guest cart synced successfully.', data });
    } catch (error) {
      next(error);
    }
  }
}
