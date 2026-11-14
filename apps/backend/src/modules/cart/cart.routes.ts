import { Router } from 'express';
import { CartController } from './cart.controller.js';
import { authenticateCustomer } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateCustomer);

router.get('/', CartController.getCart);
router.post('/items', CartController.addItem);
router.put('/items/:productId', CartController.updateQuantity);
router.delete('/items/:productId', CartController.removeItem);
router.delete('/', CartController.clearCart);
router.post('/sync', CartController.sync);

export default router;
