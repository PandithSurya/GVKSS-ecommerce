# MongoDB Atlas Setup, Architecture & Database Operations Guide
## GVKSS Organic Products E-Commerce Platform

This document details the MongoDB Atlas configuration, replica set transaction support, schema architecture, performance indexing, replication failover, backup strategies, and database versioning/seeding strategy for the GVKSS Organic Products platform.

---

## 1. MongoDB Atlas Quick Setup (Cloud Deployment)

### Step 1: Create a MongoDB Atlas Account & Cluster
1. Navigate to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Click **Create** to deploy a new database cluster.
3. Choose **M0 (Free Shared)** for development or **M10+ (Dedicated Cluster)** for production.
4. Select your preferred Cloud Provider (AWS / Google Cloud / Azure) and Region (e.g., `ap-south-1` Mumbai for Indian operations).
5. Ensure the cluster is configured as a **Replica Set** (Default across all Atlas tiers, providing multi-document ACID transactions).

### Step 2: Configure Database Access (RBAC)
1. In the Atlas navigation menu, go to **Security > Database Access**.
2. Click **Add New Database User**.
3. Choose **Password** authentication method.
4. Set Username (e.g., `gvkss_app_admin`) and generate a secure password.
5. Under **Database User Privileges**, select **Read and write to any database** (or assign custom role limited to `organic_products_db`).
6. Click **Add User**.

### Step 3: Configure Network Access (IP Whitelist)
1. Go to **Security > Network Access**.
2. Click **Add IP Address**.
3. For local development, add your current IP address (or `0.0.0.0/0` with appropriate authentication guards).
4. For production, specify your application server's static IP address or configure VPC Peering / AWS PrivateLink.

### Step 4: Obtain Connection String
1. Go to **Database > Clusters > Connect**.
2. Select **Drivers** (Node.js version 6.0 or later).
3. Copy the SRV URI formatted like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/organic_products_db?retryWrites=true&w=majority&appName=GVKSSCluster
   ```

### Step 5: Configure Application Environment
Update `server/.env` with your Atlas credentials:
```env
MONGODB_URI=mongodb+srv://gvkss_app_admin:YourStrongPasswordHere@cluster0.abcde.mongodb.net/organic_products_db?retryWrites=true&w=majority
```

---

## 2. Local vs. Cloud MongoDB Operation

The backend in `server/src/config/database.ts` and `server/src/utils/dbTransaction.ts` is architected to automatically adapt to the environment:

| Feature | Local Development (Standalone) | MongoDB Atlas (3-Node Replica Set) |
| :--- | :--- | :--- |
| **Connection URI** | `mongodb://127.0.0.1:27017/organic_products_db` | `mongodb+srv://<user>:<pwd>@cluster...` |
| **Replica Set Detection** | Auto-detected (`isReplicaSet: false`) | Auto-detected (`isReplicaSet: true`) |
| **ACID Transactions** | Conditional atomic operations (`$gte`, `$inc`) | Full multi-document ACID sessions (`client.startSession()`, `withTransaction()`) |
| **Overselling Prevention** | Atomic filter: `{ stockQuantity: { $gte: quantity } }` | Session snapshot + atomic reservation |
| **Failover & High Availability** | Manual restart | Automatic primary election in < 3 seconds |

---

## 3. Database Schemas (24 Collections)

All 24 collections are strictly typed with Mongoose schemas and enforce validation constraints:

| Collection | Model Path | Purpose & Key Features |
| :--- | :--- | :--- |
| **User** | `models/User.ts` | Customer identities, hashed passwords (bcrypt), email verification tokens, account status |
| **Admin** | `models/Admin.ts` | Admin personnel, RBAC role reference, MFA secrets, department, audit metadata |
| **Role** | `models/Role.ts` | Role definitions (`SUPER_ADMIN`, `ADMIN`, `PAYMENT_VERIFIER`, etc.) |
| **Permission** | `models/Permission.ts` | Granular action permissions (`payments:verify`, `orders:update`, etc.) |
| **UserSession** | `models/UserSession.ts` | Rotating refresh tokens, SHA-256 hashed sessions, IP, user-agent, TTL expiration |
| **Address** | `models/Address.ts` | Customer shipping addresses with Indian PIN code validation and default flags |
| **Category** | `models/Category.ts` | Product taxonomic hierarchy with slug generation, Telugu/English labels, and display order |
| **Product** | `models/Product.ts` | E-commerce catalog with prices, SKU, organic certifications, nutritional info, dietary flags |
| **ProductImage** | `models/ProductImage.ts` | Primary and gallery image URLs with alt text and ordering |
| **Inventory** | `models/Inventory.ts` | Real-time stock tracking, low-stock threshold triggers, reserved vs available counts |
| **Cart** | `models/Cart.ts` | Customer shopping carts, coupon links, computed subtotal, delivery charges |
| **CartItem** | `models/CartItem.ts` | Line items with quantity, unit price, and weight attributes |
| **Order** | `models/Order.ts` | Master orders with tracking numbers, status machine, customer contact, snapshot pricing |
| **OrderItem** | `models/OrderItem.ts` | Immutable snapshot of product SKU, name, price, and quantity at time of checkout |
| **Payment** | `models/Payment.ts` | Payment attempts, UPI UTR numbers, amounts, timestamps, verification statuses |
| **PaymentVerification** | `models/PaymentVerification.ts` | Audit record of admin confirmation/rejection, verification notes, and bank reference |
| **OrderStatusHistory** | `models/OrderStatusHistory.ts` | Immutable log of status transitions with actor IDs and notes |
| **Coupon** | `models/Coupon.ts` | Promotional discounts with expiration dates, min order amounts, max usages |
| **CouponUsage** | `models/CouponUsage.ts` | Per-customer coupon redemption logs to prevent discount abuse |
| **Review** | `models/Review.ts` | Verified customer reviews and ratings (1 to 5 stars) |
| **Shipping** | `models/Shipping.ts` | Courier metadata, dispatch dates, tracking URLs, and delivery milestones |
| **Notification** | `models/Notification.ts` | System notification log with delivery channel, payload, and read status |
| **StoreSettings** | `models/StoreSettings.ts` | Singleton configuration (UPI ID, QR code URL, COD limits, eligible PIN codes, tax) |
| **AuditLog** | `models/AuditLog.ts` | Security audit trail recording all admin actions, IP addresses, and state changes |

---

## 4. Performance Indexes & Uniqueness Constraints

The application creates explicit compound and unique indexes to guarantee high query throughput and data integrity:

```javascript
// 1. Payment UTR Replay Prevention Index (Sparse Unique)
// Ensures no two orders can claim the exact same bank transaction UTR
db.payments.createIndex({ utrNumber: 1 }, { unique: true, sparse: true });

// 2. Customer & Admin Identity Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.admins.createIndex({ email: 1 }, { unique: true });

// 3. Product Catalog Indexes
db.products.createIndex({ slug: 1 }, { unique: true });
db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ category: 1, status: 1, isAvailable: 1 });
db.products.createIndex({ name: "text", description: "text" });

// 4. Order Querying & State Machine Indexes
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.orders.createIndex({ userId: 1, createdAt: -1 });
db.orders.createIndex({ orderStatus: 1, paymentStatus: 1 });

// 5. Automatic Session & Token Expiration (TTL Index)
// User sessions automatically purged from memory upon expiry
db.usersessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 6. Audit & Notification Indexes
db.auditlogs.createIndex({ createdAt: -1 });
db.auditlogs.createIndex({ adminId: 1, action: 1 });
db.notifications.createIndex({ recipientEmail: 1, createdAt: -1 });
```

---

## 5. Seeding the Database

A comprehensive seeding script is provided in `server/src/seeds/seedDatabase.ts`. It provisions:
- 5 RBAC roles (`SUPER_ADMIN`, `ADMIN`, `ORDER_MANAGER`, `PAYMENT_VERIFIER`, `INVENTORY_MANAGER`)
- Granular permissions for all actions
- Master Admin account (`admin@gvkss.org` / `AdminSecure@2026!`)
- Test customer account (`customer@gvkss.org` / `CustomerSecure@2026!`)
- 11 Categories with bilingual Telugu/English descriptions
- 14 Products with initial inventory stock
- Default StoreSettings (Business UPI ID: `gvkssorganics@upi`, COD enabled, PIN code allowlist)

### Run Seeder
From project root:
```bash
npm run server:seed
```
Or directly from `server/`:
```bash
cd server
npm run seed
```

---

## 6. Migration & Schema Versioning Strategy

For production schema evolution, follow this structured pattern:

1. **Non-Breaking Field Additions**:
   Add new properties with `default` values in Mongoose schemas. Existing documents hydrate with defaults on read.
2. **Data Transformation Migrations**:
   Place versioned migration scripts in `server/src/migrations/` (e.g., `001_add_order_gst_field.ts`).
   Run them via an automated migration runner before application boot.
3. **Index Synchronization**:
   Mongoose runs `autoIndex: false` in production mode to avoid background locking; trigger index creation during CI/CD deploy pipeline via `npm run db:index`.

---

## 7. Backup and Disaster Recovery

### Atlas Continuous Cloud Backups
1. MongoDB Atlas provides Point-In-Time Restore (PITR) with RPO < 1 minute.
2. Go to **Database > Backup** in the Atlas console to configure daily retention windows.

### Manual Command-Line Backups (mongodump / mongorestore)
To create an offline snapshot of your database:
```bash
# Export full database
mongodump --uri="mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/organic_products_db" --out=./backups/$(date +%F)

# Restore from snapshot
mongorestore --uri="mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/organic_products_db" --drop ./backups/2026-11-14/organic_products_db
```
