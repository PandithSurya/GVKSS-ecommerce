import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service.js';
import { StoreSettings } from '../../models/StoreSettings.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class PaymentController {
  static async submitUtr(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderNumber, utrNumber } = req.body;
      const payment = await PaymentService.submitUtr(orderNumber, utrNumber);
      sendResponse(res, {
        statusCode: 200,
        message: 'UTR submitted successfully. Our verification desk will review and confirm.',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUpiSettings(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await StoreSettings.findOne({ singletonKey: 'DEFAULT_SETTINGS' });
      sendResponse(res, {
        statusCode: 200,
        data: {
          upiId: settings?.businessUpiId || 'gvkssorganics@upi',
          displayName: settings?.businessDisplayName || 'GVKSS Organic Collectives',
          instructions: settings?.upiPaymentInstructions,
          qrCodeImageUrl: settings?.qrCodeImageUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
