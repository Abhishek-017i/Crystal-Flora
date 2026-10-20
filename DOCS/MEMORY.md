# MEMORY — Decision Log & Sprint Journal

**Purpose**: Chronological record of every decision so handoff is <10 min.
**Format**: Append-only. Newest at top.

## 2026-10-20 — Sprint Kickoff

### Context
- Audit report: true completion ~35%. Customer UI good, transactional core broken, concurrency control **completely absent**.
- Deadline: tonight, ~6 hrs, 3 vibecoders.

### Decisions Locked
| # | Decision | Rationale | Reversible? |
|---|---|---|---|
| D1 | Scope cut to P0-P5, drop Razorpay/Shiprocket/PDF/email/OAuth-fix | Time budget; DBMS focus | No |
| D2 | Priority #1 = admin analytics dashboard | Seller Analytics is half title | No |
| D3 | Priority #2 = concurrency demo, both 2-tab AND 50-way simulator | Two surfaces better | No |
| D4 | DB stays Postgres on Supabase free tier | User confirmed | No |
| D5 | `DATABASE_URL` = pooler (6543), `DIRECT_URL` = direct (5432) for migrations | Supabase best practice | No |
| D6 | Decompose `Product.images String[]` → `ProductImage` | 1NF compliance | No |
| D7 | Add `Seller` model + `Product.sellerId` | Title requires seller analytics | No |
| D8 | Keep `isInStock` bool but trigger-sync | Index perf + honest denormalization | No |
| D9 | Add `@@unique([userId, productId])` on `Review` | Fix TOCTOU race | No |
| D10 | Concurrency = `$transaction(Serializable)` + `FOR UPDATE` (ordered) + atomic `updateMany` with `stock>=qty` | Layered defense + examiner proof | No |
| D11 | Simulator endpoint internally calls order logic via Promise.allSettled | Real race, not fake | No |
| D12 | No new npm deps (CSS bars not Recharts, no PDF libs) | Time | No |
| D13 | Google OAuth button hidden, JWT only | Split-brain fix >60 min | Yes (post-sprint) |
| D14 | Local `npm run dev` is demo env; Vercel optional if time | Deploy TS errors = no demo | Yes |
| D15 | `prisma migrate dev` (not db push) — get history | DBMS deliverable | No |
| D16 | Antigravity executes phase-by-phase with report gate | Prevents runaway | No |
| D17 | P1=DB/Backend, P2=Admin, P3=Checkout/UI, all on P6 | Balanced load | No |

### Pre-Flight Checklist (verify before P0.1)
- [x] `.env` exists with `DATABASE_URL` (pooler) + `DIRECT_URL` (direct) + `JWT_SECRET` + `NEXTAUTH_SECRET` + `NEXTAUTH_URL`
- [x] Supabase project created, DB reachable
- [x] `node_modules` installed — run `npm install` ONCE manually before P0 (782 packages installed)
- [x] Sprint docs in `DOCS/` kept per RULES.md §7
- [x] 6 MD files structured in `DOCS/`

## Standing Risk Register
| Risk | Status | Mitigation |
|---|---|---|
| Concurrency demo fails (succeeded>1) | 🟢 RESOLVED | Verified P3.4: 50 attempts → 1 success, 49 OOS, 0 negative stock |
| Supabase pooler rejects `FOR UPDATE` | 🟡 MONITOR | If broken: switch to `DIRECT_URL` for demo |
| Migration fails on free tier | 🟡 MONITOR | Fall back to `db push` + handwrite constraints SQL in separate migration |
| Admin UI mock deeply baked | 🟡 MONITOR | P4.1-P4.6 explicit; keep mock as fallback |
| Time overrun | 🔴 OPEN | Cut list at bottom of TASKS.md |
| Two-tab race timing flaky | 🟡 MONITOR | Pre-stage both tabs; test twice in rehearsal |

## Out-of-Scope Register (for report's "Future Work")
1. Razorpay online payment
2. Shiprocket real shipping
3. PDF invoice
4. Email notifications
5. Google OAuth unified auth
6. Wishlist cross-page real-time sync
7. Mobile responsive redesign
8. Admin list pagination
9. Purchase-verified reviews
10. Seller login portal

## Post-Sprint Handoff Checklist
1. Read MEMORY.md top-to-bottom
2. Read TASKS.md cut list
3. Run `npm install && npx prisma migrate status && npx tsx prisma/seed.ts` — all pass
4. Run both demo flows in PRD.md §5
5. Check `.env` — do not commit
6. `git log --oneline` from checkpoint to now

## Phase Completion Entries (Antigravity fills these)

### 2026-10-20 — Phase P3: Concurrency Control & Simulator
- **Status**: ✅ COMPLETED (PASS)
- **Subtasks Executed**:
  - P3.1: Extended `POST /api/orders` to execute inside `prisma.$transaction` with `isolationLevel: 'Serializable'` and `timeout: 10000`. Sorts and deduplicates target product IDs to prevent deadlocks, acquires row-level locks deterministically using `SELECT id, stock, price, "discountedPrice" FROM "Product" WHERE id = ANY(${productIds}::text[]) ORDER BY id FOR UPDATE`, validates stock directly from locked rows, recomputes total prices strictly from locked database rows, creates order + order items, and performs atomic conditional decrement `updateMany` checking `stock >= quantity`. Implemented Postgres serializable conflict / write conflict (`P2034` / `40001`) retry handling with jittered backoff.
  - P3.2: Implemented `POST /api/admin/simulate-race` in `app/api/admin/simulate-race/route.ts` with admin auth protection (`isAdmin`), accepting `{ productId, buyers = 50, quantityEach = 1, resetAfter = true }`. Spawns parallel orders across distinct buyer accounts using `Promise.allSettled`, records elapsed time, evaluates outcomes (`attempts`, `succeeded`, `outOfStock`, `otherErrors`), measures pre-reset DB stock, checks global catalog integrity (`negativeStockRows`), resets stock if requested, and returns the exact specification response payload.
  - P3.3: Exported `runConcurrencySimulator(params: SimulatorParams): Promise<SimulatorResult>` and accompanying TypeScript interfaces in `lib/analytics.ts` for frontend consumption.
  - P3.4: Verified live 50-way concurrency race on stock=1 item: exactly 1 order succeeded, 49 failed with `OUT_OF_STOCK`, 0 other errors, 0 negative stock rows in entire database, completed in 2154ms.
  - P3.5: Verified two-tab manual race: two simultaneous order requests for stock=1 product resulted in exactly 1 tab receiving HTTP 201 Created and the losing tab receiving HTTP 400 `{ error: 'OUT_OF_STOCK' }`. Stock reduced to 0 and trigger `sync_is_in_stock` updated `isInStock = false`.
  - P3.6: No rollback or stop needed; all DoD assertions passed on the first run.
- **Artifacts Created / Modified**:
  - `app/api/orders/route.ts`
  - `lib/orders.ts`
  - `app/api/admin/simulate-race/route.ts`
  - `lib/analytics.ts`
  - `DOCS/MEMORY.md`

### 2026-10-20 — Phase P2: Checkout & Orders
- **Status**: ✅ COMPLETED (PASS)
- **Subtasks Executed**:
  - P2.1: Rewrote `POST /api/orders` to execute inside an interactive `prisma.$transaction`. Recomputes prices directly from DB records (preventing client price tampering). Executes atomic conditional decrement `stock: { decrement: item.quantity }` with `where: { id: item.productId, stock: { gte: item.quantity } }`. If affected count !== items count, throws `OUT_OF_STOCK` error triggering full rollback and returns HTTP 400 with `{ error: 'OUT_OF_STOCK', message: 'Item is out of stock' }`.
  - P2.2: Hardened `POST /api/reviews` to catch Prisma unique constraint violation code `P2002` (enforced by DB composite `@@unique([userId, productId])`) and return HTTP 409 `{ error: 'You have already reviewed this product' }`.
  - P2.3: Updated `POST /api/wishlist` to be fully idempotent: catches `P2002` duplicate errors and checks for existing entries, returning HTTP 200 `{ message: 'Already in wishlist', item }`.
  - P2.4: Updated `DELETE /api/wishlist` to accept both query param (`?productId=...`) and request body, returning HTTP 200 on clean removal.
  - P2.5: Built `app/checkout/page.tsx` adhering to `DESIGN.md` §3 (2-column grid, delivery address form prefilled from profile, payment method selector defaulting to COD, order summary with price breakdown, out-of-stock toast handling with redirect back to cart, and redirect to `/orders/[id]` upon order creation).
  - P2.6: Built `app/orders/page.tsx` adhering to `DESIGN.md` §4 (Order history listing orders from `GET /api/orders/my-orders`, color-coded status badges, items list preview with images/prices, empty state with "Start Shopping" button).
  - P2.7: Built `app/orders/[id]/page.tsx` adhering to `DESIGN.md` §5 (Order detail view with header, 4-step horizontal status timeline, ordered items table with pricing, summary cost breakdown, shipping address card, and "Buy Again" action adding items back to cart).
  - P2.8: Fixed `app/cart/page.tsx` "Proceed to Checkout" button by replacing broken link with `router.push('/checkout')`.
  - P2.9: Fixed `app/register/page.tsx` line 218 confirm password input (`name="confirmPassword"`, `value={formData.confirmPassword}`).
  - Pre-P2 Refactor: Migrated all raw SQL queries in `app/api/admin/analytics/seller/route.ts`, `app/api/admin/analytics/velocity/route.ts`, and `app/api/admin/stats/route.ts` from `prisma.$queryRawUnsafe` to safe parameterized tagged template literals `prisma.$queryRaw<Type[]>`.
- **Artifacts Created / Modified**:
  - `app/api/orders/route.ts`
  - `app/api/reviews/route.ts`
  - `app/api/wishlist/route.ts`
  - `app/checkout/page.tsx`
  - `app/orders/page.tsx`
  - `app/orders/[id]/page.tsx`
  - `app/cart/page.tsx`
  - `app/register/page.tsx`
  - `app/api/admin/analytics/seller/route.ts`
  - `app/api/admin/analytics/velocity/route.ts`
  - `app/api/admin/stats/route.ts`

### 2026-10-20 — Phase P1: Analytics Endpoints
- **Status**: ✅ COMPLETED (PASS)
- **Subtasks Executed**:
  - P1.1: Hardened `GET /api/admin/stats` to include `sellerCount`, `lowStockCount` (stock < 5), and top 5 products directly queried from the `v_product_velocity` view.
  - P1.2: Implemented `GET /api/admin/analytics/seller` querying `v_seller_revenue` via parameterized `prisma.$queryRaw` tagged template with `isAdmin()` protection.
  - P1.3: Implemented `GET /api/admin/analytics/velocity` querying `v_product_velocity` (top 20 ordered by revenue DESC) via parameterized `prisma.$queryRaw` tagged template with `isAdmin()` protection.
  - P1.4: Created client fetch helpers in `lib/analytics.ts`: `fetchStats()`, `fetchSellerAnalytics()`, and `fetchVelocity()` with TypeScript interfaces.
  - P1.5: Verified all 3 endpoints over live HTTP (`http://localhost:3000`): 401 Unauthorized returned on missing or non-admin auth headers; 200 OK with accurate live aggregates returned when authenticated with admin token.
- **Artifacts Created / Modified**:
  - `app/api/admin/stats/route.ts`
  - `app/api/admin/analytics/seller/route.ts`
  - `app/api/admin/analytics/velocity/route.ts`
  - `lib/analytics.ts`


### 2026-10-20 — Phase P0: Database Foundation
- **Status**: ✅ COMPLETED (PASS)
- **Subtasks Executed**:
  - P0.1: Updated `lib/prisma.ts` to `new PrismaPg({ connectionString: process.env.DATABASE_URL! })`.
  - P0.2: Updated `prisma.config.ts` to include `directUrl: process.env["DIRECT_URL"]`.
  - P0.3: Extended `prisma/schema.prisma` with `Seller` model, `Product.sellerId` FK, decomposed `ProductImage` model, `Review` composite unique `@@unique([userId, productId])`, and `@@index` on all foreign key columns.
  - P0.4: Executed `npx prisma migrate dev --name init` (Migration `20261020135023_init` applied cleanly).
  - P0.5: Created and applied handwritten SQL migration `20261020135053_constraints_triggers_views` adding:
    - CHECK constraints: `price >= 0`, `stock >= 0`, `discountedPrice IS NULL OR >= 0`, `rating BETWEEN 1 AND 5`, `quantity > 0`, `totalAmount >= 0`.
    - PostgreSQL PL/pgSQL trigger `sync_is_in_stock` automatically setting `isInStock = (stock > 0)`.
    - PostgreSQL view `v_seller_revenue` aggregating orders, units sold, and total revenue per seller.
    - PostgreSQL view `v_product_velocity` computing units sold and revenue per product.
  - P0.6: Author and executed seed script `prisma/seed.ts` seeding: 3 sellers, 6 categories, 30 products (3 with `stock=1`, 5 with `stock<5`), 51 users (1 admin `admin@demo.com`, 50 buyers `buyer@demo.com`, `buyer1@demo.com`..), 200 orders (140 delivered, 30 pending, 20 shipped, 10 cancelled) with 319 order items, and 150 unique product reviews.
  - P0.7: Verified live database assertions: `stock < 0` count is 0; `v_seller_revenue` returns 3 seller aggregations; `UPDATE stock=0` successfully triggered `isInStock = false` and restored cleanly.
- **Artifacts Created / Modified**:
  - `lib/prisma.ts`
  - `prisma.config.ts`
  - `prisma/schema.prisma`
  - `prisma/migrations/20261020135023_init/migration.sql`
  - `prisma/migrations/20261020135053_constraints_triggers_views/migration.sql`
  - `prisma/seed.ts`

