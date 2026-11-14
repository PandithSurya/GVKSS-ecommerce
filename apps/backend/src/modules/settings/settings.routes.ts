import { Router, Request, Response, NextFunction } from 'express';
import { StoreSettings } from '../../models/StoreSettings.js';
import { sendResponse } from '../../utils/apiResponse.js';

const router = Router();

router.get('/public', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await StoreSettings.findOne({ singletonKey: 'DEFAULT_SETTINGS' });
    if (!settings) {
      settings = await StoreSettings.create({ singletonKey: 'DEFAULT_SETTINGS' });
    }

    sendResponse(res, {
      statusCode: 200,
      data: {
        businessNameEn: settings.businessNameEn,
        businessNameTe: settings.businessNameTe,
        taglineEn: settings.taglineEn,
        taglineTe: settings.taglineTe,
        supportEmail: settings.supportEmail,
        primaryPhone: settings.primaryPhone,
        secondaryPhone: settings.secondaryPhone,
        mainStoreAddress: settings.mainStoreAddress,
        businessUpiId: settings.businessUpiId,
        businessDisplayName: settings.businessDisplayName,
        qrCodeImageUrl: settings.qrCodeImageUrl,
        upiPaymentInstructions: settings.upiPaymentInstructions,
        standardDeliveryFee: settings.standardDeliveryFee,
        freeDeliveryThreshold: settings.freeDeliveryThreshold,
        deliveryTiers: settings.deliveryTiers,
        isCodEnabled: settings.isCodEnabled,
        codMinOrderAmount: settings.codMinOrderAmount,
        codMaxOrderAmount: settings.codMaxOrderAmount,
        isStoreAcceptingOrders: settings.isStoreAcceptingOrders,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
