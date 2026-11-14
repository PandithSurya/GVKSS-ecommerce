# GVKSS Organics - Central Backend API Reference

**Base URL (Production):** `https://api.YOURDOMAIN.com/api/v1`  
**Base URL (Local Development):** `http://localhost:5000/api/v1`  
**Interactive Swagger UI:** Available at `/api/v1/docs` in development mode.

---

## 1. Authentication & Security Headers

All protected endpoints require either an **Authorization Header** containing a short-lived Bearer token:
```http
Authorization: Bearer <jwt_access_token>
```
Or use the signed HttpOnly partitioned refresh cookie for session restoration:
- Customer: `gvkss_customer_refresh`
- Admin: `gvkss_admin_refresh`

All state-modifying requests must include:
```http
Content-Type: application/json
Accept: application/json
```

---

## 2. Customer Authentication Endpoints

### 2.1 Register New Customer
`POST /api/v1/auth/register`

**Request Body:**
```json
{
  "name": "Sita Devi",
  "email": "sitadevi@example.com",
  "password": "StrongPassword@123",
  "phone": "9876543210"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "id": "6732f7a90b1c2d3e4f5a6b7c",
      "name": "Sita Devi",
      "email": "sitadevi@example.com",
      "phone": "9876543210",
      "isVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.2 Customer Login
`POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "sitadevi@example.com",
  "password": "StrongPassword@123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "6732f7a90b1c2d3e4f5a6b7c",
      "name": "Sita Devi",
      "email": "sitadevi@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
*Note: Sets `gvkss_customer_refresh` cookie.*

### 2.3 Restore Customer Session
`GET /api/v1/auth/session`

Restores session from HttpOnly cookie on page reload.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.4 Customer Logout
`POST /api/v1/auth/logout`

Revokes the active session token in MongoDB and clears the browser cookie.

---

## 3. Administrative Authentication Endpoints

### 3.1 Admin Login
`POST /api/v1/admin/auth/login`

**Request Body:**
```json
{
  "email": "admin@gvkss.org",
  "password": "AdminSecure@2026!",
  "mfaToken": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "6732f7a90b1c2d3e4f5a6b99",
      "email": "admin@gvkss.org",
      "name": "GVKSS Master Admin",
      "roleName": "SUPER_ADMIN"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
*Note: Sets `gvkss_admin_refresh` cookie.*

### 3.2 Restore Admin Session
`GET /api/v1/admin/auth/session`

Restores admin session on dashboard refresh.

### 3.3 Admin Logout
`POST /api/v1/admin/auth/logout`

---

## 4. Public Catalog & Storefront Endpoints

### 4.1 Get Active Products
`GET /api/v1/products?category=millets&search=foxtail&page=1&limit=20`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "6732f7a90b1c2d3e4f5a6b01",
        "name": "Foxtail Millets (Korralu)",
        "teluguName": "కొర్రలు",
        "category": "millets",
        "price": 120,
        "discountedPrice": 140,
        "quantity": "1 kg",
        "unit": "kg",
        "image": "https://images.unsplash.com/...",
        "description": "Unpolished indigenous organic korralu.",
        "inStock": true,
        "stock": 45
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 1 }
  }
}
```

### 4.2 Get Product by ID
`GET /api/v1/products/:id`

### 4.3 Get Categories
`GET /api/v1/categories`

### 4.4 Get Public Store Settings
`GET /api/v1/settings/public`

Returns merchant UPI ID, QR code URL, COD availability, and free shipping threshold.

---

## 5. Checkout & Payment Endpoints

### 5.1 Place Order
`POST /api/v1/checkout/place-order`  
*Requires Customer Authentication.*

**Request Body:**
```json
{
  "customerName": "Sita Devi",
  "phone": "9876543210",
  "secondaryPhone": "9876543211",
  "email": "sitadevi@example.com",
  "deliveryAddress": "Flat 302, Green Acres, Madhapur, Hyderabad, Telangana - 500081",
  "pincode": "500081",
  "paymentMethod": "upi",
  "items": [
    {
      "productId": "6732f7a90b1c2d3e4f5a6b01",
      "quantity": 2
    }
  ],
  "notes": "Please deliver after 2 PM"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully. Please complete UPI payment.",
  "data": {
    "order": {
      "id": "6732f7a90b1c2d3e4f5a6b88",
      "orderNumber": "GVK-782120",
      "totalAmount": 290,
      "subtotal": 240,
      "deliveryFee": 50,
      "orderStatus": "pending",
      "paymentMethod": "upi",
      "paymentStatus": "pending",
      "upi": {
        "upiId": "9494300473@okbizaxis",
        "payeeName": "GVKSS Organics",
        "amount": 290,
        "upiLink": "upi://pay?pa=9494300473@okbizaxis&pn=GVKSS%20Organics&am=290&cu=INR&tr=GVK-782120"
      }
    }
  }
}
```

### 5.2 Submit Payment UTR Reference
`POST /api/v1/payments/submit-utr`  
*Requires Customer Authentication.*

**Request Body:**
```json
{
  "orderNumber": "GVK-782120",
  "utrNumber": "432109876543"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment reference submitted for verification. Staff will audit your credit shortly.",
  "data": {
    "orderNumber": "GVK-782120",
    "paymentStatus": "submitted",
    "utrNumber": "432109876543"
  }
}
```

---

## 6. Admin Management Endpoints

All endpoints require `Authorization: Bearer <admin_token>` and appropriate RBAC role.

### 6.1 Dashboard Statistics
`GET /api/v1/admin/dashboard/stats`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalSales": 142500,
    "totalOrders": 124,
    "pendingVerifications": 3,
    "lowStockCount": 2,
    "statusBreakdown": {
      "pending": 3,
      "confirmed": 15,
      "shipped": 22,
      "delivered": 84
    }
  }
}
```

### 6.2 Get Pending UPI Verifications
`GET /api/v1/admin/payments/pending`

### 6.3 Confirm UPI Payment
`POST /api/v1/admin/payments/:id/confirm`

**Request Body:**
```json
{
  "notes": "Verified against Axis Bank merchant statement"
}
```

### 6.4 Reject UPI Payment
`POST /api/v1/admin/payments/:id/reject`

**Request Body:**
```json
{
  "reason": "UTR not found on bank statement"
}
```

### 6.5 Get Orders (with filters & search)
`GET /api/v1/admin/orders?status=confirmed&search=9876543210&page=1&limit=50`

### 6.6 Update Order Status
`PUT /api/v1/admin/orders/:id/status`

**Request Body:**
```json
{
  "status": "shipped",
  "comment": "Packed and dispatched via direct courier"
}
```

### 6.7 Update Consignment Tracking
`PUT /api/v1/admin/orders/:id/tracking`

**Request Body:**
```json
{
  "courierName": "Delhivery Express",
  "trackingNumber": "DEL982123910",
  "estimatedDelivery": "2026-11-20"
}
```

### 6.8 Inventory Stock Replenishment
`POST /api/v1/admin/inventory/:productId/add`

**Request Body:**
```json
{
  "quantity": 50,
  "referenceNote": "Received fresh batch from Nizamabad farmer cluster"
}
```

### 6.9 Product CRUD
- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `PUT /api/v1/admin/products/:id`
- `DELETE /api/v1/admin/products/:id`

### 6.10 Audit Logs
`GET /api/v1/admin/audit-logs?page=1`
