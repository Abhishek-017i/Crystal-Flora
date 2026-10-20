# TASKS — 1-Night Sprint Plan

**Owners**: P1 = DB/Backend, P2 = Admin, P3 = Checkout/Customer, ALL = P6
**Rule**: No phase starts until `Depends On` ✅ DONE. Report after each.

## Phase Map
**Recommended**: P0→P1→P2→P3→P4→P5→P6

## Phase P0 — Database Foundation (P1, 60 min, depends: —)

| ID | Task | Files | DoD |
|---|---|---|---|
| P0.1 | Fix `lib/prisma.ts` — correct PrismaPg signature | `lib/prisma.ts` | Boots, no PrismaPg error |
| P0.2 | Fix `prisma.config.ts` — add `directUrl` | `prisma.config.ts` | `validate` exits 0 |
| P0.3 | Extend schema: `Seller`, `sellerId` FK, `ProductImage` (decompose images), `@@unique([userId,productId])` on Review, all FK indexes | `prisma/schema.prisma` | `validate` exits 0 |
| P0.4 | Generate initial migration | `prisma/migrations/` | `migrate dev --name init` succeeds |
| P0.5 | Handwrite SQL migration: CHECKs (price, stock, rating, quantity), trigger `sync_is_in_stock`, views `v_seller_revenue` + `v_product_velocity`, cascade/restrict onDelete | `prisma/migrations/*_constraints_triggers_views/` | Migrate succeeds, CHECKs + views work |
| P0.6 | Write seed: 3 sellers, 6 categories, 30 products (3 with stock=1), 50 buyers + 1 admin, 200 orders, 300+ items, 150 reviews | `prisma/seed.ts` | Prints counts, DB confirms |
| P0.7 | Verify `stock<0` count = 0; `v_seller_revenue` returns 3 | — | Screenshot / Query result |

**P0 complete when**: migration up to date, seed runs clean, views return data, `UPDATE stock=0` flips `isInStock` false.

## Phase P1 — Analytics Endpoints (P2, 45 min, depends: P0.6)

| ID | Task | Files | DoD |
|---|---|---|---|
| P1.1 | Harden `GET /api/admin/stats` — add lowStockCount, sellerCount, topProducts | `app/api/admin/stats/route.ts` | Returns shape |
| P1.2 | NEW `GET /api/admin/analytics/seller` — reads `v_seller_revenue` via `$queryRaw` | `app/api/admin/analytics/seller/route.ts` | Returns array |
| P1.3 | NEW `GET /api/admin/analytics/velocity` — reads `v_product_velocity` top 20 | `app/api/admin/analytics/velocity/route.ts` | Sorted desc |
| P1.4 | Add `lib/analytics.ts` — fetch helpers | `lib/analytics.ts` | Exports 3 fetchers |
| P1.5 | All 3 routes: isAdmin guard, 401/200 | — | Both cases pass |

**P1 complete when**: 3 endpoints return real DB data; 401 without token.

## Phase P2 — Checkout & Orders (P3, 75 min, depends: P0.6)

| ID | Task | Files | DoD |
|---|---|---|---|
| P2.1 | Fix `POST /api/orders` — `$transaction`, atomic conditional decrement, no client price trust, 400 `OUT_OF_STOCK` | `app/api/orders/route.ts` | Single-order happy path works |
| P2.2 | Fix `POST /api/reviews` — catch `P2002` → 409 | `app/api/reviews/route.ts` | Duplicate → 409 |
| P2.3 | Fix `POST /api/wishlist` — 200 idempotent on duplicate | `app/api/wishlist/route.ts` | Duplicate → 200 |
| P2.4 | Fix `DELETE /api/wishlist` — `?productId=` query param | `app/api/wishlist/route.ts` | Works |
| P2.5 | Build `/checkout` per DESIGN.md | `app/checkout/page.tsx` | Form submits, redirects, out-of-stock toast |
| P2.6 | Build `/orders` | `app/orders/page.tsx` | Lists from my-orders |
| P2.7 | Build `/orders/[id]` | `app/orders/[id]/page.tsx` | Shows detail + timeline |
| P2.8 | Fix `/cart` "Proceed to Checkout" onClick | `app/cart/page.tsx` | Button works |
| P2.9 | Fix register line 218 `name="confirmPassword"` | `app/register/page.tsx` | Form works |

**P2 complete when**: Buyer flow cart→checkout→order→view works.

## Phase P3 — Concurrency (P1+P3, 60 min, depends: P2.1)

| ID | Task | Files | DoD |
|---|---|---|---|
| P3.1 | Extend `POST /api/orders` — add `SELECT FOR UPDATE` ordered by id, `Serializable`, timeout 10s, reuse locked prices | `app/api/orders/route.ts` | Code review passes |
| P3.2 | NEW `POST /api/admin/simulate-race` — body `{productId, buyers=50, quantityEach=1, resetAfter=true}`, fires N via Promise.allSettled, returns `{attempts, succeeded, outOfStock, otherErrors, finalStock, durationMs, dbIntegrity:{negativeStockRows}}` | `app/api/admin/simulate-race/route.ts` | Shape correct, succeeded ≤ floor(stock/qty) |
| P3.3 | Add `runConcurrencySimulator()` to `lib/analytics.ts` | `lib/analytics.ts` | Exported |
| P3.4 | Test: stock=1, buyers=50, qty=1 → succeeded=1, outOfStock=49, otherErrors=0, negativeStockRows=0 | — | Test run passes |
| P3.5 | Two-tab manual test: stock=1, both qty=1, click together → 1 success, 1 out-of-stock toast | — | Test passes |
| P3.6 | If P3.4 fails (succeeded>1): STOP, re-verify transaction wrapping, `FOR UPDATE`, atomic decrement, no reads outside transaction | `app/api/orders/route.ts` | Do not proceed until passes |

**P3 complete when**: 50-way test → 1 success + 49 rejected + 0 negative, and two-tab manual race rejects slower tab.

## Phase P4 — Admin UI Wiring (P2, 60 min, depends: P1.2, P1.3, P1.4, P3.2, P3.3)

| ID | Task | Files | DoD |
|---|---|---|---|
| P4.1 | Wire dashboard KPIs to `fetchStats()` | `app/admin/dashboard/page.tsx` | Real numbers |
| P4.2 | Add Revenue-by-Seller bar + Top-Products to dashboard | `app/admin/dashboard/page.tsx` | Charts render |
| P4.3 | Add Concurrency Simulator card — product select, buyers input, fire button, results, reset | `app/admin/dashboard/page.tsx` | Fire shows results |
| P4.4 | Wire `/admin/stats` — 3 tables | `app/admin/stats/page.tsx` | Real data |
| P4.5 | Wire `/admin/orders` — GET + status dropdown PATCH | `app/admin/orders/page.tsx` | Persists |
| P4.6 | Wire `/admin/products` — list + create + edit + delete + FK error handling | `app/admin/products/page.tsx`, `app/api/admin/products/route.ts` | CRUD works |
| P4.7 | Add `GET /api/admin/products` if missing | `app/api/admin/products/route.ts` | Returns array |
| P4.8 | Add `StatCard` if missing | `components/admin/stat-card.tsx` | Reusable |
| P4.9 | Add `StatusBadge` | `components/ui/status-badge.tsx` | Reusable |

**P4 complete when**: Every admin page shows real DB data; DB change reflects on refresh; simulator works.

## Phase P5 — Customer Polish + Middleware + Toasts (P3, 45 min, depends: P2.5-9, P4.9)

| ID | Task | Files | DoD |
|---|---|---|---|
| P5.1 | Add `<Toaster />` to layout | `app/layout.tsx` | Toasts render |
| P5.2 | Replace 7 alert() with toast | 3 files | `grep alert(` → 0 |
| P5.3 | Add `lib/useAuth.ts` hook | `lib/useAuth.ts` | Works |
| P5.4 | Add `middleware.ts` — protect `/checkout`, `/orders/:path*`, `/admin/:path*` (or in-page guard if localStorage-only) | `middleware.ts` or in-page | Redirects |
| P5.5 | Use `useAuth` in protected pages | 6 files | Guard works |
| P5.6 | Hide Google OAuth button | login + register | Not shown |
| P5.7 | Fix wishlist DELETE URL to `?productId=` | 2 files | LOW priority — skip if <10 min |

**P5 complete when**: No alert() remains; protected pages redirect; toasts appear.

## Phase P6 — Docs, Screenshots, Rehearsal (ALL, 30 min, depends: P5)

| ID | Task | Owner | DoD |
|---|---|---|---|
| P6.1 | Screenshots: admin dashboard, stats, orders, products, checkout, order detail, simulator result, two-tab race | P2+P3 | `/docs/screenshots/` |
| P6.2 | Fill MEMORY.md with decisions | ALL | Chronological |
| P6.3 | Update ARCHITECTURE.md with actual final schema + diffs | P1 | Accurate |
| P6.4 | Write test results table in MEMORY.md (P0.7, P3.4, P3.5) | P1+P3 | Pasted |
| P6.5 | Run 2 full demo rehearsals, time each | ALL | ≤8 min |
| P6.6 | If ≥30 min remains AND local works: try Vercel with env vars | ALL | Optional |
| P6.7 | Write Known Issues in MEMORY.md | ALL | Honest |

**P6 complete when**: Both demos <8 min, screenshots saved, MEMORY.md updated.

## Cut List (in this order)
1. P5.7 (wishlist DELETE fix)
2. P5.6 (hide Google button)
3. P6.6 (Vercel deploy)
4. P4.6 (admin products CRUD — demo read-only if needed)
5. P4.4 (admin stats tables)
6. P4.5 (admin order status change)

**NEVER cut**: P0.*, P1.2, P2.1, P2.5, P3.1, P3.2, P3.4, P4.1, P4.3

## Time Budget
| Phase | Target | Cumulative |
|---|---|---|
| P0 | 60 | 1:00 |
| P1 | 45 | 1:45 |
| P2 | 75 | 3:00 |
| P3 | 60 | 4:00 |
| P4 | 60 | 5:00 |
| P5 | 45 | 5:45 |
| P6 | 30 | 6:15 |

Buffer ~45 min. Cut list above if past 6:15.
