# Design — Crystal Flora UI Spec (Tonight's Scope)

**Style**: Existing — cream/rose palette, Tailwind v4, Shadcn primitives, Lucide icons. Do not redesign; extend.
**Convention**: `rounded-2xl` cards, `text-stone-900` headings, `bg-rose-600` primary buttons, `bg-stone-50` page bg.

## Global UI Conventions

| Concern | Rule |
|---|---|
| Loading | Skeleton cards for lists; `Loader2 animate-spin` on buttons |
| Error | `toast.error(msg)` — never `alert()` |
| Success | `toast.success(msg)` |
| Empty state | Centered icon + "No X yet" + CTA |
| Auth redirect | `router.push('/login?next='+pathname)` |
| Money | `₹{amount.toFixed(2)}` |
| Dates | `toLocaleDateString('en-IN',{dateStyle:'medium'})` |
| Toast pos | `top-right` via `<Toaster position="top-right" richColors />` |
| Button states | Disabled while loading, `opacity-50 cursor-not-allowed` |

## Page 1: `/checkout`
**Layout**: 2-col grid. Left = form, right = summary sticky.

**Left — Shipping Form**
- Card "Shipping Address": inputs Full Name (prefill), Address Line, City, Pincode (6-digit, `pattern="[0-9]{6}"`)
- Card "Payment": radio `Cash on Delivery` (default) | `Online (coming soon)` (disabled)
- Card "Shipping": "Free delivery across India"

**Right — Summary (sticky)**
- Cart items: image 48×48, name, qty, price
- Subtotal | Shipping ₹0 | **Total (bold)**
- Primary button `Place Order` (`w-full bg-rose-600`)

**Behavior**
- Empty cart → redirect `/cart` + toast
- Validate pincode
- `POST /api/orders` with `{items, addressLine, city, pincode}`
- Success: `clearCart()` → toast → `/orders/[id]`
- 400 `OUT_OF_STOCK`: toast + redirect `/cart`
- 401: redirect `/login`

## Page 2: `/orders`
**Layout**: Single col, max-w-3xl.

**Header**: "My Orders" + count badge.

**Order card**:
- Status colors: pending=amber, paid=blue, shipped=indigo, delivered=green, cancelled=stone
- Card clickable → `/orders/[id]`
- Empty: 🌸 icon + "No orders yet" + "Start Shopping" → `/products`
- Loading: 3 skeletons
- `GET /api/orders/my-orders` sorted desc

## Page 3: `/orders/[id]`
**Layout**: max-w-3xl.

**Sections**:
1. Header: `Order #ABC` + status badge + `Placed on ...`
2. Status timeline: Placed → Paid → Shipped → Delivered (horizontal stepper)
3. Items list: image, name, qty × price, line total
4. Summary: Subtotal | Shipping | **Total**
5. Shipping Address: 3 lines
6. Actions: `Reorder` — copies items to cart + toast

`GET /api/orders/[id]`. Guard: 401 → login; 403/404 → not found.

## Page 4: `/admin/dashboard` — the star
**Layout**: Full-width. KPI row + charts + simulator + top products.

### Row 1 — 4 KPI Cards
| Card | Value | Sub | Icon |
|---|---|---|---|
| Total Revenue | `₹{sum}` | All time | 💰 |
| Orders | `{count}` | +{today} today | 🧾 |
| Active Sellers | `{count}` | | 🏪 |
| Low Stock | `{count}` | < 5 units | ⚠️ |

Style: `bg-white rounded-2xl p-6 shadow-sm border border-stone-200`. Value `text-3xl font-bold`, sub `text-sm text-stone-500`.

### Row 2 — Charts
- **Revenue by Seller**: horizontal bar (CSS `width: %` divs — NO Recharts)
- **Top Products**: list rank+name+units+revenue

### Row 3 — Concurrency Simulator Card
- `POST /api/admin/simulate-race` with `{productId, buyers, quantityEach}`
- Result reveals with fade-in
- Reset → `PATCH /api/admin/products/[id]` stock=100
- Load: `GET /api/admin/stats` + `GET /api/admin/analytics/seller`

## Page 5: `/admin/stats`
### Section A: Revenue by Seller
| Seller | Orders | Units | Revenue |
From `v_seller_revenue`. Money right-aligned.

### Section B: Top Products
| Rank | Product | Category | Seller | Units | Revenue | Stock |
From `v_product_velocity`.

### Section C: Category breakdown
| Category | Products | Total Stock |

Header: "Seller Analytics — Live from DB" + "Refreshed {ts}" + Refresh.

## Page 6: `/admin/orders` — wire existing
Replace mock with `GET /api/admin/orders`.

Row: `Order #ABC` | Buyer name | Amount | Status dropdown | `{date}`
- Dropdown → `PATCH /api/admin/orders` → optimistic + toast
- Filters: All | pending | paid | shipped | delivered | cancelled

## Page 7: `/admin/products` — wire existing
- Table: image | name | seller | category | price | stock | actions
- Add modal: name, description, price, stock, categoryId, sellerId, image url
- Edit inline → `PATCH`
- Delete → confirm → `DELETE`; 500 → toast "Cannot delete: product has orders"
- Low stock rows `bg-amber-50`

## Reusable Components

`components/admin/stat-card.tsx`:
```tsx
<StatCard label="Total Revenue" value="₹1,24,500" sub="All time" icon={IndianRupee} />
```
