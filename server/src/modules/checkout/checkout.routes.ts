import { Router } from 'express';
import { CheckoutController } from './checkout.controller.js';
import { authenticateCustomer, optionalCustomer } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { placeOrderSchema } from './checkout.validation.js';

const router = Router();

router.post('/calculate', optionalCustomer, CheckoutController.calculate);
router.post('/place-order', authenticateCustomer, validate(placeOrderSchema), CheckoutController.placeOrder);

export default router;
