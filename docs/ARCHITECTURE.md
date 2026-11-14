# GVKSS Organics - Production Target Architecture & System Blueprint

## 1. System Overview & Monorepo Layout

The GVKSS Organic E-Commerce platform is architected as an enterprise-grade, high-security monorepo separating customer-facing retail, administrative operations, and the central API service while operating over a unified MongoDB Atlas transactional cluster.

```
Organic-Products-Website/
│
├── apps/
│   ├── storefront/             # Customer-Facing SPA (React 19 + Vite + Tailwind)
│   │   ├── src/                # Bilingual catalog, Cart, Checkout, Order Tracking
│   │   ├── vercel.json         # SPA fallback rewrite rules
│   │   └── package.json        # Port 5173
│   │
│   ├── admin/                  # Administrative Operations SPA (React 19 + Vite + Tailwind)
│   │   ├── src/                # UPI Verification Desk, Orders, Products, Inventory Ledger
│   │   ├── vercel.json         # SPA fallback rewrite rules
│   │   └── package.json        # Port 5174
│   │
│   └── backend/                # Centralized Express API (Node.js + TypeScript + Mongoose)
│       ├── src/                # Modular domain services, controllers, middlewares, routes
│       ├── dist/               # Compiled JavaScript bundle
│       └── package.json        # Port 5000
│
├── packages/
│   ├── shared-types/           # Shared TypeScript domain contracts (Product, Order, etc.)
│   └── shared-utils/           # Shared utilities (formatINR, formatDate, isValidUTR)
│
├── docs/
│   ├── ARCHITECTURE.md         # System blueprint, security boundaries, and data flow
│   ├── API_DOCUMENTATION.md    # OpenAPI / Swagger and endpoint specifications
│   ├── DATABASE_SCHEMA.md      # Mongoose schemas, indexes, and transactional safeguards
│   └── DEPLOYMENT_GUIDE.md     # Production deployment instructions for Vercel and Render
│
├── ARCHITECTURE_AUDIT.md       # Pre-migration audit, security assessment, and findings
├── package.json                # Root workspaces orchestrator
└── README.md                   # Operational quickstart and repo overview
```

---

## 2. Multi-Subdomain Production Topology

Each layer is independently deployed with dedicated scaling, failure isolation, and zero cross-bundle contamination:

| Application | Production Subdomain | Dev Port | Deployment Target | Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| **Storefront** | `https://www.YOURDOMAIN.com` | `5173` | **Vercel** | Public product browsing, Telugu/English bilingual display, shopping cart, customer registration, checkout, UPI QR preview, UTR submission, customer profile, and real-time order tracking. |
| **Admin Console** | `https://admin.YOURDOMAIN.com` | `5174` | **Vercel** | Dedicated operations console, staff login with MFA, dashboard KPI analytics, manual UPI bank statement verification desk, order lifecycle management, consignment tracking, catalog CRUD, atomic warehouse stock replenishment, and security audit trail. |
| **Central Backend API** | `https://api.YOURDOMAIN.com` | `5000` | **Render / AWS ECS** | Central Express API, MongoDB Atlas Mongoose connection, atomic inventory reservations, JWT signing, bcrypt password hashing, session rotation, Zod payload validation, and notification dispatches. |
| **Database** | *Internal Atlas Replica Set* | `27017` | **MongoDB Atlas** | Distributed replica set with multi-document ACID transactions, unique indexes, and audit log persistence. |

---

## 3. Cross-Subdomain Authentication & Session Isolation

To guarantee that customer sessions cannot be abused to gain administrative privileges, and to allow concurrent administrator and customer sessions on separate browser tabs, session authentication uses partitioned cookie namespaces:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (www.YOURDOMAIN.com)
    actor Admin as Admin (admin.YOURDOMAIN.com)
    participant API as Central Backend (api.YOURDOMAIN.com)
    participant DB as MongoDB Atlas

    Note over Customer,API: Customer Session Flow
    Customer->>API: POST /api/v1/auth/login
    API->>DB: Verify customer password (bcrypt)
    API-->>Customer: Return short-lived Access Token in memory<br/>Set-Cookie: gvkss_customer_refresh (HttpOnly, Secure, SameSite=None)

    Note over Admin,API: Admin Session Flow
    Admin->>API: POST /api/v1/admin/auth/login (+ MFA)
    Admin->>API: Verify admin credentials & role
    API-->>Admin: Return short-lived Access Token in memory<br/>Set-Cookie: gvkss_admin_refresh (HttpOnly, Secure, SameSite=None)

    Note over Admin,API: Access Isolation
    Customer->>API: GET /api/v1/admin/orders
    API-->>Customer: 403 Forbidden (Missing or invalid admin session scope)
```

### Security Safeguards Implemented:
1. **Access Tokens in Memory:** Tokens expire in 15 minutes and are kept strictly in memory closures (`accessTokenMemory` / `adminAccessTokenMemory`). No long-lived sensitive tokens reside in `localStorage` or `sessionStorage` (preventing XSS exfiltration).
2. **HttpOnly Refresh Cookies:** Refresh tokens are signed, hashed in the database, and transmitted with `HttpOnly; Secure; SameSite=None; Path=/api/v1`.
3. **Dedicated Namespaces:** Storefront uses `gvkss_customer_refresh`; Admin portal uses `gvkss_admin_refresh`. Even on a shared machine, admin privileges cannot leak into customer workflows.
4. **Automatic Silent Refresh:** Both frontends intercept 401 responses and seamlessly issue refresh requests behind the scenes without disrupting user activity.
5. **Session Revocation:** On logout or password update, the active session is immediately revoked and blacklisted in `user_sessions`.

---

## 4. End-to-End Business Workflows

### 4.1 Manual UPI QR Verification Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer
    participant Storefront as Storefront App
    participant API as Backend API
    actor Admin as Admin Verifier
    participant AdminApp as Admin App
    participant Bank as Merchant Bank Account

    Customer->>Storefront: Add items to Cart & Proceed to Checkout
    Customer->>Storefront: Select UPI Payment Method
    Storefront->>API: POST /api/v1/checkout/place-order
    API->>API: Atomic stock reservation (locks inventory)
    API-->>Storefront: Order created in PENDING_PAYMENT with dynamic UPI link
    Storefront->>Customer: Displays Vendor UPI QR Code & VPA
    Customer->>Customer: Pays via PhonePe / GPay / Paytm
    Customer->>Storefront: Inputs 12-digit UTR reference
    Storefront->>API: POST /api/v1/payments/submit-utr
    API->>API: Validates UTR uniqueness (prevents replay)
    API-->>Storefront: Status changed to SUBMITTED_FOR_VERIFICATION
    Storefront->>Customer: Confirmation: "Audit Pending"
    
    AdminApp->>API: GET /api/v1/admin/payments/pending
    API-->>AdminApp: Displays pending UTR list
    Admin->>Bank: Verifies bank credit on merchant statement
    alt Credit Confirmed
        Admin->>AdminApp: Click "Confirm Credit"
        AdminApp->>API: POST /api/v1/admin/payments/:id/confirm
        API->>API: Order status updated to CONFIRMED
        API-->>AdminApp: Payment audited & recorded in Audit Log
    else Invalid UTR / No Credit
        Admin->>AdminApp: Click "Reject Payment" with reason
        AdminApp->>API: POST /api/v1/admin/payments/:id/reject
        API->>API: Order status updated to PAYMENT_REJECTED
        API->>API: Releases reserved inventory back to shelf
    end
```

### 4.2 Cash on Delivery (COD) Workflow

1. Customer selects **Cash on Delivery** at checkout.
2. Backend verifies COD availability (`storeSettings.codEnabled === true`).
3. Backend performs atomic stock reservation and creates order in `CONFIRMED` status with `paymentStatus: 'pending'`.
4. Order appears immediately in Admin Order Manager for fulfillment and dispatch.
5. Delivery agent collects physical cash upon package handover.
6. Admin updates order status to `DELIVERED`, which marks `paymentStatus: 'confirmed'`.

---

## 5. Role-Based Access Control (RBAC) Matrix

| Permission / Operation | SUPER_ADMIN | ADMIN | ORDER_MANAGER | PAYMENT_VERIFIER | INVENTORY_MANAGER |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **View Dashboard KPI Metrics** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Verify / Confirm UPI Payments** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Reject UPI Payments (with reason)** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Update Order Fulfillment Status** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Update Consignment Tracking Details** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Catalog CRUD (Add/Edit Products)** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Replenish Stock / Add to Ledger** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Modify Business / UPI Settings** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Manage Staff / Admin Users** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Security Audit Trail** | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## 6. Monorepo Dependency Flow

```mermaid
graph TD
    SharedTypes["packages/shared-types<br/>(TypeScript Contracts)"]
    SharedUtils["packages/shared-utils<br/>(Formatters & Validators)"]
    Storefront["apps/storefront<br/>(Customer Frontend)"]
    Admin["apps/admin<br/>(Admin Console)"]
    Backend["apps/backend<br/>(Centralized Express API)"]

    SharedTypes --> Storefront
    SharedTypes --> Admin
    SharedTypes --> Backend

    SharedUtils --> Storefront
    SharedUtils --> Admin
    SharedUtils --> Backend

    Storefront -.->|HTTPS API /api/v1| Backend
    Admin -.->|HTTPS API /api/v1| Backend
```
