# PRD — Crystal Flora: Concurrency-Safe E-Commerce with Seller Analytics

**Version**: 1.0 (1-night sprint)
**Deadline**: Tonight, demo-ready in ~6 hrs
**Team**: 3 vibecoders (P1 DB/Backend, P2 Admin, P3 Checkout)
**Subject**: DBMS (AI203), SVNIT Surat — B.Tech II AI

## 1. Problem Statement
A floral e-commerce storefront ("Crystal Flora") currently has a visually complete customer UI but a non-functional transactional core. Cart checkout button is inert, `/checkout`, `/orders`, `/orders/[id]` are 1-line stubs, admin UI runs on 100% mock data, and orders are accepted without stock check/decrement/transaction/locks. N concurrent buyers can all purchase 1 stock unit. The DBMS course requires demonstrating concurrency control. This project delivers that plus a live Seller Analytics Dashboard on real SQL aggregates, JOINs, and group-bys.

## 2. Core Objectives (priority-ordered)
| # | Objective | Demo Surface | DBMS Concept Proven |
|---|---|---|---|
| O1 | Seller Analytics Dashboard on live DB | `/admin/dashboard`, `/admin/stats` | JOIN, GROUP BY, aggregates, subqueries |
| O2 | Concurrency-safe checkout | Storefront checkout + stress simulator | `$transaction`, `SELECT FOR UPDATE`, atomic decrement |
| O3 | End-to-end order lifecycle | `/orders`, `/orders/[id]` | Multi-table JOIN, referential integrity |
| O4 | Schema hardening | Schema + migration + docs | 3NF, constraints, indexes, triggers |
| O5 | Concurrency stress simulator | Admin dashboard | Live failure-mode + recovery demo |

## 3. Scope — What We Ship Tonight

### ✅ IN SCOPE

**Database (P1)**
- Add `Seller` model + `sellerId` FK on `Product`
- Add `@@unique([userId, productId])` on `Review`
- Add indexes on all FK columns
- Add CHECK constraints: `price >= 0`, `stock >= 0`, `rating BETWEEN 1 AND 5`, `quantity > 0`
- Add `onDelete` behavior (restrict on Order→Product, cascade on Order→OrderItem)
- Create DB views: `v_seller_revenue`, `v_product_velocity`
- Create trigger: auto-flip `isInStock` when `stock` hits 0
- Seed: 3 sellers, 30 products, 50 users, 200 orders, 300 items, 150 reviews
- Migration files via `DIRECT_URL`

**Backend (P1 + P2)**
- Fix `lib/prisma.ts` — correct `PrismaPg` signature
- Fix `prisma.config.ts` — add `directUrl`
- Rewrite `POST /api/orders` with `$transaction` + `SELECT FOR UPDATE` + atomic decrement
- Rewrite `POST /api/reviews` — unique-constraint catch → 409
- Rewrite `POST /api/wishlist` — idempotent
- Fix `DELETE /api/wishlist` — accept `?productId=`
- Add `GET /api/admin/analytics/seller` — revenue by seller
- Add `GET /api/admin/analytics/velocity` — top products
- Add `POST /api/admin/simulate-race` — 50 parallel attempts
- Harden `PATCH /api/admin/products/[id]` — whitelist fields
- Add `PATCH /api/admin/orders` status validation

**Frontend — Admin (P2)**
- Wire `/admin/dashboard` to real analytics + add concurrency simulator button
- Wire `/admin/stats` to real endpoint
- Wire `/admin/orders` with status updates
- Wire `/admin/products` CRUD

**Frontend — Customer (P3)**
- Fix `/cart` "Proceed to Checkout" onClick
- Build `/checkout` — form + POST + out-of-stock handling + redirect
- Build `/orders` — list
- Build `/orders/[id]` — detail + timeline
- Add `lib/useAuth.ts` hook
- Add `middleware.ts` protecting `/orders`, `/checkout`, `/admin/*`
- Replace 7 `alert()` with Sonner toasts

**Docs (all)**
- ER diagram (Mermaid)
- Relational schema
- Normalization proof
- Data dictionary
- Test cases + results
- Screenshots

### ❌ OUT OF SCOPE (future work)
- Razorpay integration → COD default, online payment planned
- Shiprocket → flat ₹50 in UI
- PDF invoice
- Email notifications
- Google OAuth fix → hide button tonight
- Real product photos
- Wishlist cross-page sync → known issue
- Vercel deploy → local demo unless time remains

## 4. Roles & Permissions
| Role | Capabilities | Demo user |
|---|---|---|
| `buyer` | Browse, cart, checkout, own orders, wishlist, review | `buyer@demo.com / demo1234` |
| `admin` | All + admin dashboard, all orders, product CRUD, analytics | `admin@demo.com / admin1234` |
| `seller` | Read-only via admin UI tonight | 3 seed sellers |

## 5. Demo Scenarios

### Demo A — Seller Analytics (~4 min)
1. Login admin@demo.com
2. `/admin/dashboard` — real metrics: Total Revenue, Orders, Top Products, Revenue by Seller, Low Stock
3. Click metric → `/admin/stats` tabular detail
4. `/admin/orders` — all orders with buyer name + item count
5. Update one status → PATCH fires → live row update
6. `/admin/products` — create, edit, delete CRUD

**DBMS shown**: multi-JOIN, GROUP BY, aggregates, subquery, view, trigger.

### Demo B — Concurrency Stress Test (~4 min)

**Part 1 — Two-tab manual race:**
1. Product "Rose Bouquet" stock=1
2. Two tabs at checkout, both qty=1
3. Click within 2s
4. One: "Order placed ✅"
5. Other: "Out of stock ❌"

**Part 2 — 50-way simulator:**
1. `/admin/dashboard` → Concurrency Simulator card
2. Set product (stock=1), buyers=50
3. Click Fire
4. Results: Attempts 50 | Succeeded 1 | Rejected 49 | Final stock 0 | DB integrity ✅
5. `/admin/products` shows Rose stock=0, `isInStock=false` (trigger fired)

**DBMS shown**: Serializable transaction, FOR UPDATE, atomic decrement, rollback, trigger, no lost updates.

## 6. DBMS Requirement Coverage
| Requirement | Target | How |
|---|---|---|
| ER Diagram | ✅ | ARCHITECTURE.md Mermaid |
| Relational Schema | ✅ | ARCHITECTURE.md tables |
| PK/FK/Domain Constraints | ✅ | schema.prisma + migration |
| 3NF | ✅ | Normalization proof; decompose images |
| Multi-table JOINs | ✅ | Analytics + admin orders |
| Aggregates & GROUP BY | ✅ | stats + seller analytics |
| Transactions (ACID) | ✅ | `POST /api/orders` |
| Concurrency / Locking | ✅ | FOR UPDATE + atomic |
| Triggers | ✅ | `sync_is_in_stock` |
| Views | ✅ | `v_seller_revenue`, `v_product_velocity` |
| Indexes | ✅ | FK + hot query cols |
| CRUD | ✅ | Admin products + customer orders |
| Reporting | ✅ | Admin dashboard + stats |

## 7. Acceptance Criteria (DoD)
- [ ] `prisma migrate dev` runs clean against `DIRECT_URL`
- [ ] Seed: 200+ orders, 3 sellers, 30 products
- [ ] Admin dashboard shows real DB numbers
- [ ] 50-way simulator: succeeded=1, rejected=49, never negative
- [ ] Two-tab race: second tab out-of-stock
- [ ] `SELECT COUNT(*) FROM "Product" WHERE stock < 0` → 0
- [ ] Customer flow: add to cart → checkout → order confirmation → order in `/orders`
- [ ] Multi-table JOIN visible in query log
- [ ] GROUP BY + aggregate visible
- [ ] ER diagram + normalization proof in ARCHITECTURE.md
- [ ] All 6 MD files present
- [ ] Screenshots captured

## 8. Non-Goals for Tonight
No real payment, no real shipping, no email/invoice, no Google OAuth demo, no mobile polish, no Vercel deploy if >30 min.