import { Router } from 'express';
import { PaymentController } from './payment.controller.js';
import { paymentLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.get('/upi-info', PaymentController.getUpiSettings);
router.post('/submit-utr', paymentLimiter, PaymentController.submitUtr);

export default router;
