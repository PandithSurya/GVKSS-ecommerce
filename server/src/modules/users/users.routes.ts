import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticateCustomer } from '../../middleware/auth.js';

const router = Router();

router.use(authenticateCustomer);
router.get('/me', UsersController.getMe);
router.put('/me', UsersController.updateMe);

export default router;
