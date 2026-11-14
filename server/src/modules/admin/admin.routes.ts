import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticateAdmin } from '../../middleware/adminAuth.js';
import { roleGuard } from '../../middleware/roleGuard.js';
import { authLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

// Public Admin Auth
router.post('/auth/login', authLimiter, AdminController.login);
router.get('/auth/session', AdminController.getSession);

// Protected Admin Endpoints
router.use(authenticateAdmin);

// 1. Dashboard
router.get(
  '/dashboard/stats',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER', 'PAYMENT_VERIFIER', 'INVENTORY_MANAGER']),
  AdminController.getDashboard
);

// 2. Orders Management
router.get(
  '/orders',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER']),
  AdminController.getOrders
);
router.get(
  '/orders/:id',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER']),
  AdminController.getOrderDetail
);
router.put(
  '/orders/:id/status',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER']),
  AdminController.updateOrderStatus
);
router.put(
  '/orders/:id/tracking',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER']),
  AdminController.updateTracking
);

// 3. Payment Verification Desk
router.get(
  '/payments/pending',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'PAYMENT_VERIFIER']),
  AdminController.getPendingPayments
);
router.post(
  '/payments/:paymentId/confirm',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'PAYMENT_VERIFIER']),
  AdminController.confirmPayment
);
router.post(
  '/payments/:paymentId/reject',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'PAYMENT_VERIFIER']),
  AdminController.rejectPayment
);

// 4. Products & Inventory
router.post(
  '/products',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER']),
  AdminController.createProduct
);
router.put(
  '/products/:id',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER']),
  AdminController.updateProduct
);
router.delete(
  '/products/:id',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER']),
  AdminController.deleteProduct
);
router.get(
  '/inventory',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER']),
  AdminController.getInventory
);
router.post(
  '/inventory/:productId/add',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER']),
  AdminController.addStock
);
router.put(
  '/inventory/:productId',
  roleGuard(['SUPER_ADMIN', 'ADMIN', 'INVENTORY_MANAGER']),
  AdminController.adjustInventory
);

// 5. Customers
router.get(
  '/customers',
  roleGuard(['SUPER_ADMIN', 'ADMIN']),
  AdminController.getCustomers
);
router.put(
  '/customers/:id/status',
  roleGuard(['SUPER_ADMIN', 'ADMIN']),
  AdminController.toggleCustomerStatus
);

// 6. Settings
router.get(
  '/settings',
  roleGuard(['SUPER_ADMIN', 'ADMIN']),
  AdminController.getSettings
);
router.put(
  '/settings',
  roleGuard(['SUPER_ADMIN', 'ADMIN']),
  AdminController.updateSettings
);

// 7. Audit Logs
router.get(
  '/audit-logs',
  roleGuard(['SUPER_ADMIN', 'ADMIN']),
  AdminController.getAuditLogs
);

export default router;
