# Architecture Audit & Production Monorepo Migration Plan

**Project:** GVKSS Organic Products E-commerce Platform  
**Target Architecture:** Decoupled Monorepo (`apps/storefront`, `apps/admin`, `apps/backend`, `packages/shared-types`, `packages/shared-utils`)  
**Date:** November 2026  
**Auditor:** Antigravity AI Engineering  

---

## 1. Executive Summary & Current Architecture

### 1.1 Current Architecture Overview
The current codebase is organized in a single repository with a hybrid layout:
- **Root Directory (`/`):** Contains the customer-facing React Vite frontend (`src/`), configuration files, and an embedded `AdminDashboard.tsx` component (87KB).
- **Embedded Server (`/server`):** Contains the Node.js / Express / TypeScript REST API communicating with MongoDB Atlas via Mongoose.
- **Embedded Admin Portal:** Currently rendered conditionally within the storefront application (`App.tsx` tab switching to `<AdminDashboard />`).
- **Data Layer:** 25 Mongoose schema models in `/server/src/models/`, seed data in `/server/src/seeds/`, and frontend static fallback catalogs in `/src/data/`.

```
CURRENT (TIGHTLY COUPLED):
┌────────────────────────────────────────────────────────────────────────┐
│ Root Repository (Vite + React)                                         │
│ ┌────────────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ Customer Storefront (src/pages/..) │ │ Embedded AdminDashboard.tsx │ │
│ └────────────────────────────────────┘ └─────────────────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ /api/v1 (Vite Proxy)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ /server (Express + TypeScript + Mongoose + JWT)                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ MONGODB_URI
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ MongoDB Atlas Cluster                                                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Audit of Existing Working Functionality

| Business Domain | Working Implementation Status | Files & Endpoints |
| :--- | :--- | :--- |
| **Public Browsing** | Fully working; products, categories, bilingual toggle (Telugu/English), search, health benefit chips. | `src/components/shop/*`, `GET /api/v1/products`, `GET /api/v1/categories` |
| **Customer Auth** | JWT access token (in-memory) + HttpOnly refresh token cookie; session restoration on refresh; 401 retry interceptor. | `src/context/AuthContext.tsx`, `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/session` |
| **Cart Management**| In-memory cart context, free delivery threshold indicator (₹1000), quantity controls. | `src/context/CartContext.tsx`, `src/components/cart/CartDrawer.tsx` |
| **Checkout Guard**  | Strict server-side and client-side auth guard on `/place-order`; prevents guest checkout. | `src/components/checkout/CheckoutModal.tsx`, `POST /api/v1/checkout/place-order` |
| **UPI QR & UTR**    | Dynamic UPI QR code generation (`upi://pay?pa=...`); 12-digit UTR submission; replay attack & duplicate UTR rejection. | `POST /api/v1/payments/submit-utr`, `PaymentService.submitUtr` |
| **Cash on Delivery**| Server validates COD eligibility; generates confirmed order with pending cash collection. | `POST /api/v1/checkout/place-order` |
| **Customer Orders** | Customer "My Orders" modal showing order status timeline, items, delivery fee, tracking, and cancellation. | `src/components/orders/MyOrdersModal.tsx`, `GET /api/v1/orders/my-orders` |
| **Admin Operations**| Dedicated role-based endpoints; pending UPI verification desk; order status management; add/edit products; stock adjustment; customer metrics. | `src/components/admin/AdminDashboard.tsx`, `/api/v1/admin/*` |
| **Database Models** | 25 production-ready Mongoose schemas covering users, admins, roles, permissions, orders, payments, audit logs, inventory. | `server/src/models/*` |
| **Automated Tests** | 30/30 integration tests passing in Vitest covering auth, checkout, UTR replay prevention, payment confirmation, COD. | `server/src/tests/backend.test.ts` |

---

## 3. Existing Weaknesses, Bugs & Security Deficiencies

### 3.1 Security & Architectural Deficiencies in Current Layout
1. **Admin Portal Bundled in Customer Bundle:**
   - The 87KB `AdminDashboard.tsx` is bundled into the storefront's JavaScript bundle. Although backend routes are protected by JWT, bundling admin UI code into public bundles exposes administrative routes, API shapes, role names, and state machines to public scrutiny.
2. **Shared Session Scope & Cookie Collisions:**
   - Customer and admin currently share the cookie namespace (`refreshToken` cookie name), which risks cross-subdomain cookie conflicts when storefront is on `www.YOURDOMAIN.com` and admin is on `admin.YOURDOMAIN.com`.
3. **Hardcoded Proxies & API Base URLs:**
   - Frontend relied on Vite's `/api` proxy in dev. In multi-subdomain production deployments (`www.`, `admin.`, `api.`), frontends must explicitly configure `VITE_API_BASE_URL` pointing to the API domain with appropriate CORS and cookie settings.
4. **Monorepo Separation Needed:**
   - Both frontends and backend share root configurations (`package.json`, `tsconfig.json`, `tailwind.config.js`), preventing independent zero-downtime deployment pipelines on Vercel and Render.
5. **CORS Configuration for Multi-Subdomain Production:**
   - The backend currently allows single origins or wildcards; in production, it must explicitly allow both `https://www.YOURDOMAIN.com` and `https://admin.YOURDOMAIN.com` with `credentials: true`.

---

## 4. Components Reusability & Refactoring Analysis

### 4.1 Reusable Components (Keep & Extract)
- **Domain Models & Schemas:** All 25 models in `server/src/models/` are completely preserved and modularized in `apps/backend/`.
- **Customer UI Components:** Hero, Header, Footer, TopBanner, ProductCard, ProductGrid, ProductFilters, CategoryGrid, BalancedDietSection, OrganicProcessShowcase, FeaturedPacks, CartDrawer, CheckoutModal, OrderReceipt, MyOrdersModal, AuthModal, and pages (`ShopView`, `AboutView`, `ContactView`, `MonthlyPackView`, `ReadyToCookView`, `NaturalProductsView`) moved cleanly to `apps/storefront/`.
- **Admin UI Components:** Extracted from `AdminDashboard.tsx` into a standalone, modular React SPA in `apps/admin/` with its own router, authentication layout, dashboard metric widgets, product management, stock ledger, payment verification desk, and order inspector.
- **Shared Types:** TypeScript interfaces for Product, Category, Order, CartItem, Payment, User, Admin, and API response envelopes extracted to `packages/shared-types/`.
- **Shared Utilities:** Currency formatting (`formatINR`), date formatting, Indian phone number masking, and status badge helpers extracted to `packages/shared-utils/`.

---

## 5. Target Monorepo Architecture

```
organic-store/
│
├── apps/
│   ├── storefront/             # Customer Frontend (Vite + React + Tailwind)
│   │   ├── src/                # Customer components, pages, context, services
│   │   ├── public/             # Brand images, logo, favicon
│   │   ├── package.json        # Independent dependencies & build scripts
│   │   ├── vite.config.ts      # VITE_API_BASE_URL integration
│   │   └── vercel.json         # Vercel deployment configuration
│   │
│   ├── admin/                  # Dedicated Admin Frontend (Vite + React + Tailwind)
│   │   ├── src/                # Admin auth, dashboard, stock, payments, orders
│   │   ├── public/             # Admin assets
│   │   ├── package.json        # Independent dependencies & build scripts
│   │   ├── vite.config.ts      # VITE_API_BASE_URL integration
│   │   └── vercel.json         # Vercel deployment configuration
│   │
│   └── backend/                # Centralized Express REST API
│       ├── src/
│       │   ├── config/         # Environment, CORS, DB, Logger
│       │   ├── models/         # 25 Mongoose Domain Models
│       │   ├── modules/        # Modular domains (auth, admin, products, orders...)
│       │   ├── middleware/     # Auth, RBAC, Rate Limiter, Error Handler
│       │   ├── routes/         # v1 REST API Router
│       │   ├── seeds/          # Database seeding scripts
│       │   ├── tests/          # Vitest integration test suite (30 tests)
│       │   ├── app.ts          # Express App configuration
│       │   └── server.ts       # Server entry point
│       ├── package.json        # Backend dependencies & scripts
│       └── tsconfig.json       # Backend TypeScript config
│
├── packages/
│   ├── shared-types/           # Shared TypeScript definitions (Products, Orders, Auth)
│   │   ├── src/index.ts
│   │   └── package.json
│   │
│   └── shared-utils/           # Reusable formatters & helpers
│       ├── src/index.ts
│       └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md         # Comprehensive system architecture & data flow
│   ├── API_DOCUMENTATION.md    # Swagger & REST API endpoint specifications
│   ├── DATABASE_SCHEMA.md      # MongoDB Atlas collection schemas & indexing
│   └── DEPLOYMENT_GUIDE.md     # Production deployment instructions (Vercel & Render)
│
├── .gitignore
├── package.json                # Monorepo Root (npm workspaces)
└── README.md                   # Monorepo setup and command guide
```

---

## 6. Subdomain & Authentication Architecture

| Application | Production Domain | Staging / Dev Domain | Session Mechanism |
| :--- | :--- | :--- | :--- |
| **Customer Storefront** | `https://www.YOURDOMAIN.com` | `http://localhost:5173` | In-memory Access Token + `gvkss_customer_refresh` HttpOnly cookie |
| **Admin Portal** | `https://admin.YOURDOMAIN.com` | `http://localhost:5174` | In-memory Access Token + `gvkss_admin_refresh` HttpOnly cookie |
| **Central Backend API** | `https://api.YOURDOMAIN.com` | `http://localhost:5000` | Issues scoped tokens; validates CORS allowlist with credentials |

### Cross-Subdomain Cookie Configuration:
- In production, cookies are issued with `domain: '.YOURDOMAIN.com'`, `secure: true`, `sameSite: 'lax'`, `httpOnly: true`.
- Distinct cookie names (`gvkss_customer_refresh` vs `gvkss_admin_refresh`) completely prevent session leakage between customer accounts and administrative roles.

---

## 7. Step-by-Step Migration Plan (Phased Execution)

1. **Phase 1 & 2: Audit & Planning** *(Complete)*
   - Produce `ARCHITECTURE_AUDIT.md`.
2. **Phase 3: Monorepo Setup & Package Extraction**
   - Initialize root `package.json` with npm workspaces (`apps/*`, `packages/*`).
   - Create `packages/shared-types` and `packages/shared-utils`.
3. **Phase 4: Backend Relocation to `apps/backend`**
   - Relocate `/server` into `apps/backend/`.
   - Update cookie naming to separate customer (`gvkss_customer_refresh`) and admin (`gvkss_admin_refresh`) cookies.
   - Configure dynamic multi-origin CORS supporting `www.`, `admin.`, and local dev ports (`5173`, `5174`).
4. **Phase 5: Customer Storefront Isolation to `apps/storefront`**
   - Move storefront files (`src/`, `public/`, `index.html`) to `apps/storefront/`.
   - Strip out `AdminDashboard.tsx` from storefront.
   - Configure `VITE_API_BASE_URL` with environment variable support.
5. **Phase 6: Standalone Admin Application Creation (`apps/admin`)**
   - Create clean, dedicated Vite React SPA in `apps/admin/` with port `5174`.
   - Implement clean routing: Admin Login (`/login`), Operations Console (`/`), Products, Stock, Orders, UPI Payments, Customers, Settings, Audit.
   - Connect directly to `VITE_API_BASE_URL`.
6. **Phase 7: Database & Integrity Validation**
   - Retain existing MongoDB Atlas collections and schema integrity.
   - Ensure zero data loss for existing users, products, categories, orders, and payments.
7. **Phase 8: Comprehensive Testing & Verification**
   - Verify storefront builds (`npm run --workspace=apps/storefront build`).
   - Verify admin builds (`npm run --workspace=apps/admin build`).
   - Verify backend builds (`npm run --workspace=apps/backend build`).
   - Run backend test suite (30/30 tests passing).
8. **Phase 9: Production Deployment Documentation & Configurations**
   - Generate `docs/ARCHITECTURE.md`, `docs/API_DOCUMENTATION.md`, `docs/DATABASE_SCHEMA.md`, and `docs/DEPLOYMENT_GUIDE.md`.
   - Add Vercel and Render deployment configuration files (`vercel.json`, `render.yaml`).
