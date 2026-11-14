import { Router, Response, NextFunction } from 'express';
import { Address } from '../../models/Address.js';
import { AuthenticatedUserRequest, authenticateCustomer } from '../../middleware/auth.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { ApiError } from '../../utils/apiError.js';

const router = Router();
router.use(authenticateCustomer);

// GET /api/v1/addresses
router.get('/', async (req: AuthenticatedUserRequest, res: Response, next: NextFunction) => {
  try {
    const addresses = await Address.find({ userId: req.userId }).sort({ isDefault: -1, createdAt: -1 });
    sendResponse(res, { statusCode: 200, data: addresses });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/addresses
router.post('/', async (req: AuthenticatedUserRequest, res: Response, next: NextFunction) => {
  try {
    const { fullName, phone, houseStreet, areaLocality, city, state, pinCode, landmark, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ userId: req.userId }, { isDefault: false });
    }

    const address = await Address.create({
      userId: req.userId,
      fullName,
      phone,
      houseStreet,
      areaLocality,
      city: city || 'Hyderabad',
      state: state || 'Telangana',
      pinCode,
      landmark,
      isDefault: Boolean(isDefault),
    });

    sendResponse(res, { statusCode: 201, message: 'Address created successfully.', data: address });
  } catch (error) {
    next(error);
  }
});

// PUT /api/v1/addresses/:id
router.put('/:id', async (req: AuthenticatedUserRequest, res: Response, next: NextFunction) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, userId: req.userId });
    if (!address) {
      throw ApiError.notFound('Address not found.');
    }

    if (req.body.isDefault) {
      await Address.updateMany({ userId: req.userId }, { isDefault: false });
    }

    Object.assign(address, req.body);
    await address.save();

    sendResponse(res, { statusCode: 200, message: 'Address updated successfully.', data: address });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/addresses/:id
router.delete('/:id', async (req: AuthenticatedUserRequest, res: Response, next: NextFunction) => {
  try {
    const result = await Address.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) {
      throw ApiError.notFound('Address not found.');
    }
    sendResponse(res, { statusCode: 200, message: 'Address deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
