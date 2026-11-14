import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import usersRoutes from '../modules/users/users.routes.js';
import addressRoutes from '../modules/addresses/address.routes.js';
import productRoutes from '../modules/products/product.routes.js';
import categoryRoutes from '../modules/categories/category.routes.js';
import cartRoutes from '../modules/cart/cart.routes.js';
import checkoutRoutes from '../modules/checkout/checkout.routes.js';
import orderRoutes from '../modules/orders/order.routes.js';
import paymentRoutes from '../modules/payments/payment.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import settingsRoutes from '../modules/settings/settings.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/addresses', addressRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/settings', settingsRoutes);

export default router;
