# GVKSS Organics - Production Deployment Guide

This guide details the step-by-step instructions for deploying the 3 independent production applications across **Vercel** and **Render** with centralized **MongoDB Atlas** persistence and SSL/TLS DNS configuration.

---

## 1. Architecture & Domain Topology

```
+---------------------------------------------------------------+
|                       DNS: YOURDOMAIN.com                     |
+-------------------------------+-------------------------------+
                                |
      +-------------------------+-------------------------+
      |                         |                         |
      v                         v                         v
[ www.YOURDOMAIN.com ]   [ admin.YOURDOMAIN.com ]  [ api.YOURDOMAIN.com ]
  Customer Storefront       Admin Operations          Central Express API
     (Vercel SPA)             (Vercel SPA)              (Render Web Svc)
```

---

## 2. DNS Configuration (Cloudflare / Namecheap / GoDaddy)

Add the following DNS records in your domain registrar or Cloudflare dashboard:

| Type | Host / Name | Target / Value | TTL | Proxy Status |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `cname.vercel-dns.com` | Auto | DNS only / Proxied |
| **CNAME** | `admin` | `cname.vercel-dns.com` | Auto | DNS only / Proxied |
| **CNAME** | `api` | `<your-backend-app-name>.onrender.com` | Auto | DNS only / Proxied |

---

## 3. Deployment 1: Central Backend API (Render)

### Option A: 1-Click Render Blueprint (Recommended)
Because the repository contains a pre-configured `render.yaml` at the root:
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Select your GitHub repository (`PandithSurya/GVKSS-ecommerce`).
4. Render automatically parses `render.yaml`, configures the build & start commands, health check `/health`, and auto-generates secure JWT/cookie secrets.
5. Provide your MongoDB Atlas connection string when prompted for `DATABASE_URL` and `MONGODB_URI`.
6. Click **Apply** to deploy.

### Option B: Manual Web Service Setup
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository (`PandithSurya/GVKSS-ecommerce`).
4. Configure the service settings:
   - **Name:** `gvkss-organic-backend`
   - **Region:** Singapore / Mumbai (closest to India users)
   - **Branch:** `main`
   - **Root Directory:** `apps/backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Plan:** Starter ($7/mo) or standard

### Step 2: Configure Environment Variables
In the Render dashboard under **Environment**, add:

| Key | Example Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enforces production security optimizations |
| `PORT` | `5000` | Port Render injects internally |
| `API_PREFIX` | `/api/v1` | Uniform API route prefix |
| `DATABASE_URL` | `mongodb+srv://user:pass@cluster0.mongodb.net/organic_products_db?retryWrites=true&w=majority` | Atlas connection string |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0.mongodb.net/organic_products_db?retryWrites=true&w=majority` | Primary Atlas URI |
| `CLIENT_URL` | `https://www.YOURDOMAIN.com` | Customer storefront origin |
| `ADMIN_URL` | `https://admin.YOURDOMAIN.com` | Admin operations origin |
| `CORS_ORIGIN` | `https://www.YOURDOMAIN.com,https://admin.YOURDOMAIN.com` | Strict CORS allowlist (no wildcards) |
| `JWT_ACCESS_SECRET` | `generate-random-64-char-hex-string` | Used for signing 15m access tokens |
| `JWT_REFRESH_SECRET`| `generate-random-64-char-hex-string` | Used for signing 7d refresh tokens |
| `COOKIE_SECRET` | `generate-random-64-char-hex-string` | Cookie signing |
| `COOKIE_DOMAIN` | `.YOURDOMAIN.com` | Enables cookie sharing across subdomains |
| `INITIAL_ADMIN_EMAIL` | `admin@gvkss.org` | Initial administrator account |
| `INITIAL_ADMIN_PASSWORD` | `YourSecretAdminPassword2026!` | Initial administrator password |

### Step 3: Custom Domain
1. In Render, go to **Settings** -> **Custom Domains**.
2. Add `api.YOURDOMAIN.com`.
3. Verify Render issues a valid Let's Encrypt SSL/TLS certificate.

---

## 4. Deployment 2: Customer Storefront (Vercel)

### Step 1: Create Vercel Project
1. Log in to [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your repository.
4. Configure Project Settings:
   - **Project Name:** `gvkss-storefront`
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and set to `apps/storefront`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 2: Configure Environment Variables
Add the following variable in Vercel:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://api.YOURDOMAIN.com/api/v1` |

### Step 3: Custom Domain
1. In Vercel, navigate to **Settings** -> **Domains**.
2. Add `www.YOURDOMAIN.com` and redirect `YOURDOMAIN.com` to `www.YOURDOMAIN.com`.
3. Vercel automatically configures the SSL certificate.

---

## 5. Deployment 3: Admin Console (Vercel)

### Step 1: Create Vercel Project
1. In Vercel, click **Add New...** -> **Project**.
2. Select the same repository.
3. Configure Project Settings:
   - **Project Name:** `gvkss-admin-console`
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and set to `apps/admin`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 2: Configure Environment Variables
Add the following variable:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://api.YOURDOMAIN.com/api/v1` |

### Step 3: Custom Domain
1. In Vercel, navigate to **Settings** -> **Domains**.
2. Add `admin.YOURDOMAIN.com`.
3. Verify SSL certificate generation.

---

## 6. Post-Deployment Verification Checklist

Execute the following smoke tests on production subdomains:

- [ ] **Storefront (`https://www.YOURDOMAIN.com`):**
  - [ ] Homepage renders Telugu & English translations properly.
  - [ ] Products load dynamically from `https://api.YOURDOMAIN.com/api/v1/products`.
  - [ ] Customer registration and login succeed; session persists after hard refresh.
  - [ ] Add item to cart and proceed to checkout.
  - [ ] Checkout creates order and renders UPI QR code with correct merchant VPA.
  - [ ] Submit 12-digit UTR reference. Verify screen displays "Audit Pending".
- [ ] **Admin Console (`https://admin.YOURDOMAIN.com`):**
  - [ ] Login using administrative credentials.
  - [ ] KPI cards display gross sales and pending count.
  - [ ] Navigate to **Payment Desk**; verify newly submitted customer order and UTR appear.
  - [ ] Click "Confirm Credit". Verify order status transitions to `CONFIRMED`.
  - [ ] Check customer order tracking on storefront; verify it immediately reflects `CONFIRMED`.
  - [ ] Check **Inventory Ledger**; verify atomic stock reduction occurred.
- [ ] **Security Audits:**
  - [ ] Inspect DevTools Network tab; verify `gvkss_customer_refresh` and `gvkss_admin_refresh` cookies have `HttpOnly; Secure; SameSite=None`.
  - [ ] Verify guest order placements without authentication are rejected (HTTP 401).
  - [ ] Verify duplicate UTR submissions are rejected (HTTP 400).
  - [ ] Verify no secrets (`JWT_ACCESS_SECRET`, `DATABASE_URL`) are leaked in client bundles.
