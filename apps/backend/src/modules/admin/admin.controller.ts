import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service.js';
import { PaymentService } from '../payments/payment.service.js';
import { AuthenticatedAdminRequest } from '../../middleware/adminAuth.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { config } from '../../config/environment.js';

const isProduction = config.nodeEnv === 'production';

export class AdminController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, mfaToken } = req.body;
      const result = await AdminService.login(
        email,
        password,
        mfaToken,
        req.ip,
        req.headers['user-agent']
      );

      if (result.requiresMfa) {
        sendResponse(res, {
          statusCode: 200,
          message: 'MFA token required.',
          data: { requiresMfa: true },
        });
        return;
      }

      res.cookie('adminAccessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 8 * 60 * 60 * 1000,
      });

      sendResponse(res, {
        statusCode: 200,
        message: 'Admin authentication successful.',
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
      const adminAccessToken = bearerToken || req.cookies?.adminAccessToken;

      const result = await AdminService.getSession(adminAccessToken);

      res.cookie('adminAccessToken', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
        maxAge: 8 * 60 * 60 * 1000,
      });

      sendResponse(res, {
        statusCode: 200,
        message: 'Admin session active.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();
      sendResponse(res, { statusCode: 200, data: stats });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, paymentMethod, paymentStatus, search, page, limit } = req.query;
      const data = await AdminService.getOrders({
        status: status as string,
        paymentMethod: paymentMethod as string,
        paymentStatus: paymentStatus as string,
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 25,
      });
      sendResponse(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderDetail(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await AdminService.getOrderDetail(req.params.id as string);
      sendResponse(res, { statusCode: 200, data: order });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, comment } = req.body;
      const order = await AdminService.updateOrderStatus(
        req.params.id as string,
        status,
        req.adminId!,
        comment
      );
      sendResponse(res, { statusCode: 200, message: 'Order status updated.', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async updateTracking(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { courierName, trackingNumber } = req.body;
      const order = await AdminService.updateTracking(req.params.id as string, courierName, trackingNumber);
      sendResponse(res, { statusCode: 200, message: 'Tracking updated.', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async getPendingPayments(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await PaymentService.getPendingPayments();
      sendResponse(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  static async confirmPayment(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentId = req.params.paymentId as string;
      const { notes } = req.body;
      const result = await PaymentService.confirmPayment(
        paymentId,
        req.adminId!,
        req.admin?.email,
        notes,
        req.ip,
        req.headers['user-agent']
      );
      sendResponse(res, { statusCode: 200, message: 'Payment confirmed and verified!', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async rejectPayment(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentId = req.params.paymentId as string;
      const { reason } = req.body;
      const result = await PaymentService.rejectPayment(
        paymentId,
        req.adminId!,
        reason,
        req.admin?.email,
        req.ip,
        req.headers['user-agent']
      );
      sendResponse(res, { statusCode: 200, message: 'Payment rejected.', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await AdminService.createProduct(req.body);
      sendResponse(res, { statusCode: 201, message: 'Product created.', data: product });
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await AdminService.updateProduct(req.params.id as string, req.body);
      sendResponse(res, { statusCode: 200, message: 'Product updated.', data: product });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await AdminService.deleteProduct(req.params.id as string);
      sendResponse(res, { statusCode: 200, message: 'Product archived.' });
    } catch (error) {
      next(error);
    }
  }

  static async getInventory(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await AdminService.getInventory();
      sendResponse(res, { statusCode: 200, data: inventory });
    } catch (error) {
      next(error);
    }
  }

  static async addStock(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quantity, referenceNote } = req.body;
      const result = await AdminService.addStock(
        req.params.productId as string,
        Number(quantity),
        referenceNote || 'Inward Purchase Restock',
        req.adminId!
      );
      sendResponse(res, { statusCode: 200, message: 'Stock added successfully.', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async adjustInventory(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quantity, reason } = req.body;
      const inventory = await AdminService.adjustInventory(
        req.params.productId as string,
        Number(quantity),
        reason,
        req.adminId!
      );
      sendResponse(res, { statusCode: 200, message: 'Inventory adjusted.', data: inventory });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomers(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, page, limit } = req.query;
      const data = await AdminService.getCustomers(
        search as string,
        page ? Number(page) : 1,
        limit ? Number(limit) : 25
      );
      sendResponse(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  static async toggleCustomerStatus(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const user = await AdminService.toggleCustomerStatus(req.params.id as string, status);
      sendResponse(res, { statusCode: 200, message: `Customer status updated to ${status}.`, data: user });
    } catch (error) {
      next(error);
    }
  }

  static async getSettings(_req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await AdminService.getSettings();
      sendResponse(res, { statusCode: 200, data: settings });
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await AdminService.updateSettings(req.body, req.adminId!);
      sendResponse(res, { statusCode: 200, message: 'Store settings updated.', data: settings });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: AuthenticatedAdminRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query;
      const data = await AdminService.getAuditLogs(
        page ? Number(page) : 1,
        limit ? Number(limit) : 50
      );
      sendResponse(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }
}
