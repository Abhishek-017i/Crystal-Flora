# 15 — Priority Action Plan & Execution Roadmap

## 1. Impact vs. Effort Matrix

```
                 ▲ High Impact
                 │
                 │   [SEC-01: Admin Middleware]      [PERF-01: SSR Homepage]
                 │   [BUG-01: SellerId Null Crash]   [FEAT-01: Review Submission Modal]
                 │   [SEC-02: Next.js CVE Upgrade]   [TEST-01: Vitest Concurrency Test]
                 │   [DEV-01: Create .env.example]   [PAY-01: Wire Razorpay]
                 │
  ───────────────┼────────────────────────────────────────────────────────►
  Low Effort     │   [CLEAN-01: Fix 404 Links]       [SEO-01: Sitemap & Robots]
                 │   [BUG-02: Fix Undefined Props]   [SEO-02: Dynamic OG Tags]
                 │   [DEP-01: Prune Dead Packages]   [PERF-02: Next/Image Migration]
                 │
                 ▼ Low Impact
                                                              High Effort
```

---

## 2. Phase 1: Critical Fixes (Security & Crash Prevention)

### 2.1 SEC-01 — Fortify Admin Route Server Guard
- **Impact**: Maximum | **Effort**: Low (15 mins)
- **Target File**: [`middleware.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/middleware.ts)
- **Problem**: Admin dashboard (`/admin/*`) and admin APIs (`/api/admin/*`) are completely omitted from server middleware matcher.
- **Action**:
  1. Add `/admin/:path*` and `/api/admin/:path*` to `config.matcher`.
  2. Parse the token from cookies or authorization header.
  3. Verify that `decoded.role === 'admin'`. If invalid or missing, redirect to `/login` (for web routes) or return `401 Unauthorized` (for API routes).

### 2.2 SEC-02 — Remediate Next.js & NextAuth Critical CVEs
- **Impact**: Maximum | **Effort**: Low (10 mins)
- **Target File**: [`package.json`](file:///c:/B.tech/3rd%20sem/DBMS/Project/package.json#L25-L26)
- **Problem**: Next.js 16.2.6 has known unauthenticated Remote Code Execution vulnerabilities on Windows.
- **Action**: Run `npm install next@16.4.2 next-auth@latest` followed by `npm audit fix`.

### 2.3 BUG-01 — Resolve Product Creation `sellerId` Crash
- **Impact**: High | **Effort**: Low (15 mins)
- **Target Files**: [`app/api/admin/products/route.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/api/admin/products/route.ts#L64) & [`prisma/schema.prisma`](file:///c:/B.tech/3rd%20sem/DBMS/Project/prisma/schema.prisma#L50)
- **Problem**: Admin UI allows creating in-house products without a seller, but `schema.prisma` declares `sellerId String` as strictly non-nullable.
- **Action**: Change schema to `sellerId String?` and `seller Seller? @relation(...)`, then run `npx prisma db push`.

### 2.4 DEV-01 — Create Standard `.env.example`
- **Impact**: High | **Effort**: Very Low (5 mins)
- **Target File**: `.env.example`
- **Action**: Create template declaring `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `NEXTAUTH_SECRET`.

---

## 3. Phase 2: High Priority (Core UX & Stability)

### 3.1 BUG-02 — Fix Undefined Fields on Product Detail Page
- **Impact**: High | **Effort**: Low (10 mins)
- **Target File**: [`components/ui/product-detail.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/product-detail.tsx#L110-L125)
- **Problem**: Renders `undefined` for original price and description.
- **Action**:
  - Replace `product.originalPrice` with `product.price`.
  - Replace `product.price` with `product.discountedPrice ?? product.price`.
  - Replace `product.fullDescription` with `product.description`.

### 3.2 FEAT-01 — Connect Review Submission UI
- **Impact**: High | **Effort**: Medium (45 mins)
- **Target File**: [`components/ui/reviews-section.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/reviews-section.tsx#L101)
- **Problem**: "Write a Review" button has no click handler.
- **Action**: Add an interactive review modal with 5-star picker, textarea, and submit button that calls `POST /api/reviews`.

### 3.3 CLEAN-01 — Fix Broken Navigation Links
- **Impact**: High | **Effort**: Low (10 mins)
- **Target Files**: [`components/cart/bottom-nav.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/cart/bottom-nav.tsx), [`app/profile/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/profile/page.tsx)
- **Action**: Delete duplicate cart bottom navigation; route categories icon to `/products`; connect `/support` to a WhatsApp or email modal.

### 3.4 STATE-01 — Re-link Wishlist Page with Zustand Store
- **Impact**: Medium | **Effort**: Low (15 mins)
- **Target File**: [`app/wishlist/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/wishlist/page.tsx)
- **Action**: Update wishlist page to consume `useWishlistStore` to prevent badge count desynchronization.

---

## 4. Phase 3: Medium Priority (Architecture & Performance)

### 4.1 PERF-01 — Server-Side Render (SSR) the Homepage
- **Impact**: High | **Effort**: Medium (45 mins)
- **Target File**: [`app/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/page.tsx)
- **Action**: Convert `app/page.tsx` from `'use client'` to an async Server Component that fetches initial products and categories during SSR.

### 4.2 DEP-01 — Purge Dead Packages & Fix Lints
- **Impact**: Medium | **Effort**: Low (20 mins)
- **Target File**: [`package.json`](file:///c:/B.tech/3rd%20sem/DBMS/Project/package.json)
- **Action**: Run `npm uninstall @tanstack/react-query zod react-hook-form @hookform/resolvers cloudinary next-cloudinary next-themes` and resolve remaining ESLint warnings.

### 4.3 TEST-01 — Implement Vitest Concurrency Test Suite
- **Impact**: High | **Effort**: Medium (60 mins)
- **Target File**: `tests/concurrency.test.ts`
- **Action**: Convert the in-app simulator logic into an automated integration test with 50 parallel transaction promises.

---

## 5. Phase 4: Low Priority (SEO & Polish)

### 5.1 SEO-01 — Dynamic Product Metadata & Schema.org JSON-LD
- **Impact**: Medium | **Effort**: Medium (30 mins)
- **Target Files**: [`app/products/[id]/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/products/[id]/page.tsx), [`app/layout.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/layout.tsx)
- **Action**: Implement `generateMetadata()` and inject JSON-LD Product schema.

### 5.2 SEO-02 — Automated Sitemap and Robots
- **Impact**: Medium | **Effort**: Low (20 mins)
- **Target Files**: `app/sitemap.ts` and `app/robots.ts`
- **Action**: Implement dynamic sitemap that queries all active product and category URLs from Prisma.

---

## 6. Implementation Summary Matrix

| Task Code | Description | Group | Impact | Effort | Target Milestone |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **SEC-01** | Admin server middleware route protection | Critical | Maximum | Low | Day 1 |
| **SEC-02** | Upgrade Next.js & NextAuth to patch CVEs | Critical | Maximum | Low | Day 1 |
| **BUG-01** | Fix `sellerId` non-null Prisma crash | Critical | High | Low | Day 1 |
| **DEV-01** | Create `.env.example` | Critical | High | Very Low | Day 1 |
| **BUG-02** | Fix undefined price & description on PDP | High | High | Low | Day 2 |
| **FEAT-01** | Wire "Write a Review" modal to API | High | High | Medium | Day 2 |
| **CLEAN-01**| Prune duplicate bottom-nav & fix 404s | High | Medium | Low | Day 2 |
| **STATE-01**| Connect wishlist page to Zustand store | High | Medium | Low | Day 2 |
| **PERF-01** | Convert Homepage to SSR Server Component | Medium | High | Medium | Day 3 |
| **DEP-01** | Uninstall 8 unused dead packages | Medium | Medium | Low | Day 3 |
| **TEST-01** | Vitest automated concurrency test suite | Medium | High | Medium | Day 3 |
| **SEO-01**  | Product dynamic metadata & JSON-LD | Low | Medium | Medium | Day 4 |
| **SEO-02**  | Add `app/sitemap.ts` and `app/robots.ts` | Low | Medium | Low | Day 4 |
