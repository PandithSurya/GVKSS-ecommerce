import { Router } from 'express';
import { OrderController } from './order.controller.js';
import { authenticateCustomer, optionalCustomer } from '../../middleware/auth.js';

const router = Router();

// Customer authenticated order history
router.get('/my-orders', authenticateCustomer, OrderController.getMyOrders);

// Tracking / Receipt lookup (accessible to guest or authenticated user)
router.get('/:orderNumber', optionalCustomer, OrderController.getOrder);
router.post('/:orderNumber/cancel', optionalCustomer, OrderController.cancelOrder);

export default router;
