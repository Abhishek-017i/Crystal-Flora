# RULES — Antigravity Execution Constraints

**These rules override default behavior. Read fully before first action.**

## 1. File Safety

### 🟢 MAY EDIT
- `lib/prisma.ts`, `lib/useAuth.ts` (NEW), `lib/analytics.ts` (NEW)
- `prisma/schema.prisma`, `prisma/seed.ts` (NEW), `prisma/migrations/**`
- `app/api/orders/route.ts`, `app/api/reviews/route.ts`, `app/api/wishlist/route.ts`
- `app/api/admin/**`
- `app/checkout/page.tsx`, `app/orders/page.tsx`, `app/orders/[id]/page.tsx`
- `app/cart/page.tsx` (onClick only)
- `app/admin/**/page.tsx`
- `app/layout.tsx` (add Toaster only)
- `middleware.ts` (NEW)
- `components/admin/stat-card.tsx` (NEW), `components/ui/status-badge.tsx` (NEW)
- `app/login/page.tsx`, `app/register/page.tsx`, `app/edit-profile/page.tsx` (alert→toast only)

### 🔴 DO NOT TOUCH
- `components/ui/product-detail.tsx`, `product-card.tsx`, `navbar.tsx`, `bottom-nav.tsx`, `photo-carousel.tsx`, `whatsapp-button.tsx`
- `app/page.tsx`, `app/products/**`, `app/profile/page.tsx`, `app/wishlist/page.tsx`
- `app/api/auth/**`, `app/api/products/**`, `app/api/categories/**`
- `next.config.ts`, `tsconfig.json`, `package.json`
- Any `*.md` except the 6 sprint docs

### 🚫 NEVER
- `npm install` any dependency without approval
- Rewrite `app/register/page.tsx` — only fix `name="password"` → `name="confirmPassword"` line 218 + alert calls
- Delete files
- Change existing route paths
- Modify `prisma/schema.prisma` datasource block
- Add `String[]` fields
- Use `alert()` anywhere new
- `console.log` in committed code
- `git push`
- Deploy to Vercel unless P6 has ≥30 min AND all tests pass

## 2. Database Rules

### Connection
- `lib/prisma.ts`: `new PrismaPg({ connectionString: process.env.DATABASE_URL! })`
- `prisma.config.ts`: `url: process.env.DATABASE_URL`, `directUrl: process.env.DIRECT_URL`
- Migrations against `DIRECT_URL` only

### Schema Mandatory
- Every FK gets an `@@index`
- Every numeric/range field gets CHECK constraint via migration
- Every multi-value field decomposed
- Every relation explicit `onDelete`
- Every new model has `id String @id @default(cuid())` + `createdAt DateTime @default(now())`
- Document every field addition in `MEMORY.md`

### Transactions Mandatory
Any write across >1 table OR read-then-write same table MUST be inside `prisma.$transaction`:
- Order + OrderItem + stock decrement → TRANSACTION
- Review create → TRANSACTION or DB unique
- Wishlist toggle → TRANSACTION or DB unique

### Concurrency Mandatory
`POST /api/orders` MUST:
1. `prisma.$transaction(async (tx) => {...}, { isolationLevel: 'Serializable', timeout: 10000 })`
2. Inside: `SELECT ... FOR UPDATE` on product rows ordered by `id`
3. Validate stock from locked rows
4. Atomic: `tx.product.updateMany({ where: { id, stock: { gte: qty } }, data: { stock: { decrement: qty } } })`
5. If `count===0` → throw → rollback
6. Never trust client price — recompute from locked rows

### Seed Requirements
- 3 sellers (Floral Co, Gardenia, Bloom House)
- 30 products across sellers
- 6 categories
- 50 buyers
- 200 orders (70% delivered/paid, 15% pending, 10% shipped, 5% cancelled)
- 300+ items, 150 reviews
- ≥3 products `stock=1` (demo), ≥5 products `stock<5` (alerts)
- `bcrypt.hash('demo1234', 10)` for passwords
- `admin@demo.com/admin1234` + `buyer@demo.com/demo1234`

### Migrations
- Commit to `prisma/migrations/`
- `prisma migrate dev --name init` then `--name add_seller_and_constraints`
- No `db push` for final

## 3. Backend Rules

### Every route
- `try/catch`
- `{ error: "message" }` on error
- Never leak stack/DB/SQL
- Validate input before DB (Zod preferred)
- Whitelist every PATCH field — no `data: body`

### Auth
- `/api/admin/*` → `isAdmin(request)` first, 401 if fail
- User-scoped → `getUser(request)`
- Never trust client `userId`

### Response Codes
- 200 success, 201 created, 400 validation/OUT_OF_STOCK, 401 unauth, 403 forbidden, 404 not found, 409 conflict, 500 only unexpected

### `POST /api/admin/simulate-race`
Body: `{productId, buyers (1-100), quantityEach, resetAfter=true}`
- Fires N parallel order attempts via `Promise.allSettled`
- Resets stock after if `resetAfter`, logs original final stock
- Response:
```json
{"attempts":50,"succeeded":1,"outOfStock":49,"otherErrors":0,"finalStock":0,"durationMs":2314,"dbIntegrity":{"negativeStockRows":0}}
```

## 4. Testing Rules
- Every phase must pass its explicit DoD before reporting.
- Concurrency simulation must be tested with live parallel requests.
- No dummy/mocked simulator responses.

## 5. Phase P0 Test Block
Run and verify:
1. `SELECT COUNT(*) FROM "Product" WHERE stock < 0` → 0
2. `SELECT * FROM v_seller_revenue LIMIT 3` → returns 3 rows
3. `UPDATE "Product" SET stock = 0 WHERE id = (SELECT id FROM "Product" LIMIT 1)` → trigger flips `isInStock = false`

## 6. Phase Report Template
Each phase report in chat must follow:
```markdown
### Phase [P#] Report — [Phase Name]
- Status: [PASS / FAIL]
- Subtasks completed: [List of subtasks]
- Files modified / created: [List with paths]
- Verification evidence: [Commands run + outputs]
- Open risks / Notes: [Any observations]
```


# 1. Get admin token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin1234"}' | jq -r .token)

# 2. Stats endpoint
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/admin/stats | jq
# Expect: { totalRevenue, orderCount, sellerCount, lowStockCount, topProducts: [...] }

# 3. Seller analytics
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/admin/analytics/seller | jq
# Expect: 3 rows, sorted or unsorted, with sellerName, totalOrders, unitsSold, totalRevenue

# 4. Velocity
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/admin/analytics/velocity | jq
# Expect: ≤20 rows, sorted desc by revenue

# 5. Unauthorized check
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/admin/stats
# Expect: 401