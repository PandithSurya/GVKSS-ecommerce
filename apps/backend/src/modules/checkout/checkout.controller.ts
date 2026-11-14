import { Response, NextFunction } from 'express';
import { CheckoutService } from './checkout.service.js';
import { AuthenticatedUserRequest } from '../../middleware/auth.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class CheckoutController {
  static async calculate(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { items, couponCode, pinCode } = req.body;
      const data = await CheckoutService.calculateOrderTotals(items, couponCode, pinCode);
      sendResponse(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  static async placeOrder(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required. Please log in to place an order.',
        });
        return;
      }
      const { shippingAddress, items, paymentMethod, couponCode } = req.body;
      const result = await CheckoutService.placeOrder({
        userId: req.userId,
        shippingAddress,
        items,
        paymentMethod,
        couponCode,
      });

      sendResponse(res, {
        statusCode: 201,
        message: 'Order created successfully!',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
