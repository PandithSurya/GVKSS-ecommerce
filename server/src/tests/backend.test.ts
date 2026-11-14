import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import { config } from '../config/environment.js';

describe('GVKSS E-commerce Backend Integration Test Suite', () => {
  let customerToken = '';
  let adminToken = '';
  let createdOrderId = '';
  let createdOrderNumber = '';
  let paymentId = '';
  const testUtr = `UTR${Date.now().toString().slice(-9)}`;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.mongodbUri);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('1. Health and Public Catalog Endpoints', () => {
    it('GET /health should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('GET /api/v1/categories should return active categories', async () => {
      const res = await request(app).get('/api/v1/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/products should return products with pagination', async () => {
      const res = await request(app).get('/api/v1/products?limit=10');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.meta).toHaveProperty('total');
    });

    it('GET /api/v1/products/featured should return featured products', async () => {
      const res = await request(app).get('/api/v1/products/featured');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('2. Customer Authentication & Sessions', () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    it('POST /api/v1/auth/register should create customer account', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Sita Devi',
          email: uniqueEmail,
          password: 'Password@2026',
          phone: '9876543210',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data.user.email).toBe(uniqueEmail);

      customerToken = res.body.data.accessToken;
    });

    it('POST /api/v1/auth/register should reject duplicate email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          fullName: 'Duplicate User',
          email: uniqueEmail,
          password: 'Password@2026',
          phone: '9876543210',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/auth/login should authenticate customer', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: uniqueEmail,
          password: 'Password@2026',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      customerToken = res.body.data.accessToken;
    });

    it('POST /api/v1/auth/login should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: uniqueEmail,
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/v1/users/me should return authenticated customer profile', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(uniqueEmail);
    });
  });

  describe('3. Shopping Cart & Price Calculation', () => {
    it('POST /api/v1/cart/items should add product to customer cart', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          productId: 'prod-01',
          quantity: 2,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.subtotal).toBe(140); // 70 * 2
    });

    it('POST /api/v1/checkout/calculate should compute server-side totals independently', async () => {
      const res = await request(app)
        .post('/api/v1/checkout/calculate')
        .send({
          items: [{ productId: 'prod-01', quantity: 2 }],
          pinCode: '500060',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.subtotal).toBe(140);
      expect(res.body.data.deliveryFee).toBe(50); // Under 1000
      expect(res.body.data.totalPayableAmount).toBe(190);
    });
  });

  describe('4. Checkout, UPI QR & UTR Replay Prevention', () => {
    it('POST /api/v1/checkout/place-order should create UPI order in PENDING_PAYMENT', async () => {
      const res = await request(app)
        .post('/api/v1/checkout/place-order')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            fullName: 'Sita Devi',
            phone: '9876543210',
            email: 'sitadevi@example.com',
            houseStreet: 'Flat 302, Green Meadows',
            areaLocality: 'Kothapet',
            city: 'Hyderabad',
            state: 'Telangana',
            pinCode: '500060',
          },
          items: [{ productId: 'prod-01', quantity: 2 }],
          paymentMethod: 'UPI',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.order.orderStatus).toBe('PENDING_PAYMENT');
      expect(res.body.data.order.paymentStatus).toBe('PENDING');
      expect(res.body.data).toHaveProperty('upiDetails');
      expect(res.body.data.upiDetails).toHaveProperty('qrCodeDataUrl');

      createdOrderId = res.body.data.order._id;
      createdOrderNumber = res.body.data.order.orderNumber;
      paymentId = res.body.data.payment._id;
    });

    it('POST /api/v1/payments/submit-utr should accept valid UTR and update status', async () => {
      const res = await request(app)
        .post('/api/v1/payments/submit-utr')
        .send({
          orderNumber: createdOrderNumber,
          utrNumber: testUtr,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('SUBMITTED_FOR_VERIFICATION');
    });

    it('POST /api/v1/checkout/place-order should REJECT unauthenticated checkout with HTTP 401', async () => {
      const res = await request(app)
        .post('/api/v1/checkout/place-order')
        .send({
          shippingAddress: {
            fullName: 'Guest User',
            phone: '9876543210',
            email: 'guest@example.com',
            houseStreet: 'H.No 1, Guest Street',
            areaLocality: 'Guest Area',
            city: 'Hyderabad',
            state: 'Telangana',
            pinCode: '500060',
          },
          items: [{ productId: 'prod-01', quantity: 1 }],
          paymentMethod: 'UPI',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/v1/payments/submit-utr should REJECT duplicate UTR submission (Replay Prevention)', async () => {
      // Create a second order with customer token
      const secondOrderRes = await request(app)
        .post('/api/v1/checkout/place-order')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            fullName: 'Second Customer',
            phone: '9876543210',
            email: 'second@example.com',
            houseStreet: 'H.No 12, Saroornagar',
            areaLocality: 'Saroornagar',
            city: 'Hyderabad',
            state: 'Telangana',
            pinCode: '500060',
          },
          items: [{ productId: 'prod-01', quantity: 1 }],
          paymentMethod: 'UPI',
        });

      expect(secondOrderRes.status).toBe(201);
      const secondOrderNumber = secondOrderRes.body.data.order.orderNumber;

      // Attempt to submit identical UTR
      const duplicateRes = await request(app)
        .post('/api/v1/payments/submit-utr')
        .send({
          orderNumber: secondOrderNumber,
          utrNumber: testUtr,
        });

      expect(duplicateRes.status).toBe(409);
      expect(duplicateRes.body.success).toBe(false);
      expect(duplicateRes.body.message).toContain('already been submitted');
    });
  });

  describe('5. Admin Authentication, Payment Verification Desk & State Transitions', () => {
    it('POST /api/v1/admin/auth/login should authenticate Master Admin', async () => {
      const res = await request(app)
        .post('/api/v1/admin/auth/login')
        .send({
          email: 'admin@gvkss.org',
          password: 'AdminSecure@2026!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');

      adminToken = res.body.data.accessToken;
    });

    it('GET /api/v1/admin/dashboard/stats should return overview KPI metrics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('overview');
      expect(res.body.data.overview).toHaveProperty('totalOrders');
      expect(res.body.data.overview).toHaveProperty('pendingVerifications');
    });

    it('GET /api/v1/admin/payments/pending should list submitted UTR', async () => {
      const res = await request(app)
        .get('/api/v1/admin/payments/pending')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      const match = res.body.data.find((p: any) => p.utrNumber === testUtr);
      expect(match).toBeDefined();
    });

    it('POST /api/v1/admin/payments/:id/confirm should confirm payment and update order to CONFIRMED', async () => {
      const res = await request(app)
        .post(`/api/v1/admin/payments/${paymentId}/confirm`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          notes: 'Bank transaction credited and verified on HDFC portal.',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.payment.status).toBe('VERIFIED');
      expect(res.body.data.order.orderStatus).toBe('CONFIRMED');
    });

    it('PUT /api/v1/admin/orders/:id/status should forbid illegal status transitions', async () => {
      // Attempting to jump directly from CONFIRMED to DELIVERED or invalid status
      const res = await request(app)
        .put(`/api/v1/admin/orders/${createdOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'DELIVERED', // Must go through PACKED -> SHIPPED -> OUT_FOR_DELIVERY -> DELIVERED
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid order state transition');
    });

    it('PUT /api/v1/admin/orders/:id/status should successfully progress to PACKED', async () => {
      const res = await request(app)
        .put(`/api/v1/admin/orders/${createdOrderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'PACKED',
          comment: 'Provisions packaged in eco bag',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.orderStatus).toBe('PACKED');
    });

    it('GET /api/v1/admin/orders/:id should return complete order details with items and payment', async () => {
      const res = await request(app)
        .get(`/api/v1/admin/orders/${createdOrderId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('items');
      expect(res.body.data).toHaveProperty('payment');
      expect(res.body.data).toHaveProperty('statusHistory');
      expect(res.body.data.orderNumber).toBe(createdOrderNumber);
    });

    it('POST /api/v1/admin/products should create new product with initial stock', async () => {
      const newSku = `TEST-SKU-${Date.now().toString().slice(-4)}`;
      const res = await request(app)
        .post('/api/v1/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Organic Kodo Millet',
          teluguName: 'అరికలు',
          category: 'millets',
          price: 150,
          sku: newSku,
          stockQuantity: 40,
          quantity: '1 kg',
          unit: 'kg',
          description: 'Unpolished traditional kodo millet directly from Deccan farmers.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Organic Kodo Millet');
      expect(res.body.data.sku).toBe(newSku);
    });

    it('GET /api/v1/admin/inventory should return inventory with stock metrics', async () => {
      const res = await request(app)
        .get('/api/v1/admin/inventory')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('availableStock');
      expect(res.body.data[0]).toHaveProperty('sku');
    });

    it('POST /api/v1/admin/inventory/:productId/add should add stock units with note', async () => {
      const res = await request(app)
        .post('/api/v1/admin/inventory/prod-01/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 25,
          referenceNote: 'Batch Inward Restock',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.addedQuantity).toBe(25);
    });

    it('GET /api/v1/admin/customers should list customers with accurate orderCount and totalPurchaseAmount', async () => {
      const res = await request(app)
        .get('/api/v1/admin/customers')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('customers');
      expect(Array.isArray(res.body.data.customers)).toBe(true);
      expect(res.body.data.customers.length).toBeGreaterThan(0);
      const customerRecord = res.body.data.customers.find((c: any) => c.email === 'customer@gvkss.org');
      expect(customerRecord).toBeDefined();
      expect(customerRecord).toHaveProperty('totalPurchaseAmount');
    });

    it('GET /api/v1/auth/session should restore customer session using token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/session')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user.role).toBe('customer');
    });

    it('GET /api/v1/admin/auth/session should restore admin session using token', async () => {
      const res = await request(app)
        .get('/api/v1/admin/auth/session')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('admin');
      expect(res.body.data.admin.email).toBe('admin@gvkss.org');
    });

    it('GET /api/v1/orders/my-orders should list orders for authenticated customer', async () => {
      const res = await request(app)
        .get('/api/v1/orders/my-orders')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('orders');
      expect(Array.isArray(res.body.data.orders)).toBe(true);
    });
  });

  describe('6. Cash on Delivery (COD) Workflow', () => {
    it('POST /api/v1/checkout/place-order should create confirmed COD order', async () => {
      const res = await request(app)
        .post('/api/v1/checkout/place-order')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          shippingAddress: {
            fullName: 'COD Customer',
            phone: '9391628344',
            email: 'cod@example.com',
            houseStreet: 'Shop 7, Janapriya Soudha',
            areaLocality: 'Saroornagar',
            city: 'Hyderabad',
            state: 'Telangana',
            pinCode: '500060',
          },
          items: [{ productId: 'prod-01', quantity: 3 }],
          paymentMethod: 'COD',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.order.orderStatus).toBe('CONFIRMED');
      expect(res.body.data.order.paymentStatus).toBe('COD_PENDING');
      expect(res.body.data.order.paymentMethod).toBe('COD');
    });
  });
});
