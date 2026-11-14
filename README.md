# GVKSS Organic Products E-Commerce Platform
### Enterprise-Grade, Decoupled Monorepo Architecture

A secure, production-ready fullstack e-commerce system architected as an isolated monorepo. The platform cleanly separates **Customer Storefront**, **Admin Console**, and a **Centralized Backend API** backed by a shared **MongoDB Atlas** transactional cluster.

---

## 1. Monorepo Architecture

```
Organic-Products-Website/
│
├── apps/
│   ├── storefront/             # Customer-Facing Storefront (Port 5173 -> www.YOURDOMAIN.com)
│   │   ├── src/                # Bilingual catalog, shopping cart, checkout, order tracking
│   │   ├── vercel.json         # SPA fallback routing
│   │   └── package.json
│   │
│   ├── admin/                  # Dedicated Admin Console (Port 5174 -> admin.YOURDOMAIN.com)
│   │   ├── src/                # UPI verification desk, orders, inventory ledger, settings
│   │   ├── vercel.json         # SPA fallback routing
│   │   └── package.json
│   │
│   └── backend/                # Centralized Express API (Port 5000 -> api.YOURDOMAIN.com)
│       ├── src/                # Modular domain services, controllers, middlewares, routes
│       ├── dist/               # Compiled JavaScript bundle
│       └── package.json
│
├── packages/
│   ├── shared-types/           # Shared TypeScript domain contracts (Product, Order, User, etc.)
│   └── shared-utils/           # Shared utilities (formatINR, formatDate, isValidUTR)
│
├── docs/
│   ├── ARCHITECTURE.md         # Monorepo architecture, subdomain isolation, security
│   ├── API_DOCUMENTATION.md    # API endpoints, request/response formats
│   ├── DATABASE_SCHEMA.md      # Mongoose models, indexes, transactions
│   └── DEPLOYMENT_GUIDE.md     # Production deployment instructions (Vercel & Render)
│
├── ARCHITECTURE_AUDIT.md       # Pre-migration audit and security analysis
├── package.json                # Workspace orchestrator
└── README.md
```

---

## 2. Independent Applications & Domains

| Application | Local Port | Production Domain | Platform | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Customer Storefront** | `http://localhost:5173` | `https://www.YOURDOMAIN.com` | **Vercel** | Responsive artisan customer UI, Telugu/English bilingual support, dynamic catalog, cart, checkout, manual UPI QR, UTR submission, COD, customer profile, and order tracking. |
| **Admin Operations** | `http://localhost:5174` | `https://admin.YOURDOMAIN.com` | **Vercel** | Isolated administration console, MFA staff login, real-time metrics, manual UPI bank statement audit desk, order dispatch & tracking updater, catalog CRUD, warehouse stock replenishment, and security audit trail. |
| **Central Backend API** | `http://localhost:5000` | `https://api.YOURDOMAIN.com` | **Render** | High-security Node.js/Express API, MongoDB Atlas Mongoose connection, atomic stock reservations, isolated customer/admin JWT sessions, Zod validation, and email notification dispatches. |

---

## 3. Quick Start (Development)

### Prerequisites
- Node.js 20+ or 22+
- Local MongoDB or MongoDB Atlas connection string

### 1. Install & Build Monorepo
```bash
# Run from repository root
npm install
npm run build:all
```

### 2. Configure Environment Variables
- `apps/backend/.env` (see `apps/backend/.env.example`)
- `apps/storefront/.env` (see `apps/storefront/.env.example`)
- `apps/admin/.env` (see `apps/admin/.env.example`)

### 3. Launch Development Servers
```bash
# In Terminal 1: Central Backend API (Port 5000)
npm run dev:backend

# In Terminal 2: Customer Storefront (Port 5173)
npm run dev:storefront

# In Terminal 3: Admin Console (Port 5174)
npm run dev:admin
```

### 4. Run Automated Integration Test Suite
```bash
npm run test:backend
# Executes all 30/30 integration tests in apps/backend
```

---

## 4. Administrative Credentials (Default Seed)

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Master Admin** | `admin@gvkss.org` | `AdminSecure@2026!` | All administrative domains, payments, inventory, settings |

---

## 5. Security & Architectural Safeguards

1. **Subdomain Session Partitioning:** Storefront uses `gvkss_customer_refresh` cookie; Admin console uses `gvkss_admin_refresh` cookie. Sessions cannot cross-contaminate.
2. **Tokens in Memory:** 15-minute access tokens are retained in memory closures—never in `localStorage`—protecting against XSS exfiltration.
3. **No Automatic Payment Confirmation:** Customer UTR submissions transition orders into `SUBMITTED_FOR_VERIFICATION`. Only an authorized administrator auditing the merchant bank credit can confirm the payment.
4. **Duplicate UTR Replay Prevention:** Database unique sparse indexes and atomic locks prevent reusing UTR numbers across orders.
5. **Atomic Inventory Reservation:** Prevents overselling during concurrent checkouts via `$inc` conditional queries.
6. **Zero Data Loss Guarantee:** Existing MongoDB Atlas customer records, product catalogs, and order histories are 100% preserved.

---

## 6. Detailed Documentation

- [System Architecture Blueprint](file:///./docs/ARCHITECTURE.md)
- [Complete API Reference](file:///./docs/API_DOCUMENTATION.md)
- [Database Schemas & Transactions](file:///./docs/DATABASE_SCHEMA.md)
- [Production Deployment Guide](file:///./docs/DEPLOYMENT_GUIDE.md)
- [Pre-Migration Architecture Audit](file:///./ARCHITECTURE_AUDIT.md)
