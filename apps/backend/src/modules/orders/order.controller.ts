import { Response, NextFunction } from 'express';
import { OrderService } from './order.service.js';
import { AuthenticatedUserRequest } from '../../middleware/auth.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class OrderController {
  static async getMyOrders(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const data = await OrderService.getCustomerOrders(req.userId!, page, limit);
      sendResponse(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  static async getOrder(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await OrderService.getOrderByNumber(req.params.orderNumber as string, req.userId);
      sendResponse(res, { statusCode: 200, data: order });
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: AuthenticatedUserRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await OrderService.cancelOrder(req.params.orderNumber as string, req.userId, req.body.reason);
      sendResponse(res, { statusCode: 200, message: 'Order successfully cancelled.', data: order });
    } catch (error) {
      next(error);
    }
  }
}
