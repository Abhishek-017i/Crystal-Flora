# 06 — E-Commerce Features Inventory & Audit

## 1. Feature Status Matrix

| Feature Domain | Status | Completion Level | Primary Files / Components | Implementation Assessment |
| :--- | :---: | :---: | :--- | :--- |
| **Product Catalog** | **DONE** | 95% | [`app/products/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/products/page.tsx), [`components/ui/category-grid.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/category-grid.tsx) | Category filtering, stock status tags, sale badges, high-resolution imagery. |
| **Shopping Cart** | **DONE** | 100% | [`lib/store.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/store.ts), [`app/cart/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/cart/page.tsx) | Zustand persistence, quantity increments, live subtotal computation. |
| **Checkout Engine** | **DONE** | 90% | [`app/checkout/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/checkout/page.tsx), [`lib/orders.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/orders.ts) | 6-digit Indian PIN validation, server-side price lock, ACID transaction safety. |
| **Payments Integration** | **PARTIAL** | 40% | [`app/checkout/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/checkout/page.tsx#L245-L261) | **COD functional**. Razorpay is installed in `package.json` but disabled in UI. |
| **Orders & Tracking** | **DONE** | 95% | [`app/orders/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/orders/page.tsx), [`app/orders/[id]/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/orders/[id]/page.tsx) | Order history, 4-step horizontal progress tracker, 1-click reorder to cart. |
| **Wishlist System** | **DONE** | 90% | [`app/wishlist/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/wishlist/page.tsx), [`app/api/wishlist/route.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/api/wishlist/route.ts) | Database persistence, duplicate prevention, optimistic client sync. |
| **Product Reviews** | **PARTIAL** | 50% | [`app/api/reviews/route.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/api/reviews/route.ts), [`components/ui/reviews-section.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/reviews-section.tsx) | API & rating bar visualizer done; "Write a Review" UI button has no click handler. |
| **Coupons & Promo Codes** | **PARTIAL** | 25% | [`prisma/schema.prisma`](file:///c:/B.tech/3rd%20sem/DBMS/Project/prisma/schema.prisma#L47) | Product-level `discountedPrice` works; no coupon code table or promo engine. |
| **Shipping & Logistics** | **PARTIAL** | 35% | [`app/checkout/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/checkout/page.tsx#L265) | Hardcoded Free Delivery across India; no courier API (Shiprocket/Delhivery). |
| **Admin Control Panel** | **DONE** | 95% | [`app/admin/dashboard/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/admin/dashboard/page.tsx), [`app/admin/products/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/admin/products/page.tsx) | Full inventory CRUD, order status updater, live SQL views, concurrency tester. |
| **Catalog Search** | **PARTIAL** | 65% | [`components/ui/navbar.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/navbar.tsx#L38-L84), [`app/api/products/route.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/api/products/route.ts#L13) | Keyword search across name and description; lacks instant debounced dropdown. |
| **Notifications** | **PARTIAL** | 30% | [`components/ui/sonner.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/sonner.tsx) | Sonner in-app toasts functional; no email (Resend/SendGrid) or SMS order updates. |

---

## 2. In-Depth Feature Audit & Gap Analysis

### 2.1 Product Catalog & Browsing
- **Strengths**: Visual category navigation with tailored Lucide icons ([`components/ui/category-grid.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/category-grid.tsx)), responsive product cards with hover animations, automatic `isInStock: true` filtering on the public storefront.
- **Gaps**: No multi-facet filtering (e.g., price range slider, color/material tags, sorting by price ASC/DESC).

### 2.2 Cart & Concurrency-Safe Checkout
- **Strengths**: The order creation transaction in [`lib/orders.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/orders.ts) is mathematically immune to race conditions and inventory overselling. Price calculation is recalculation-enforced on the backend.
- **Gaps**: Express Checkout feature in `ProductDetail` writes to `sessionStorage.getItem('expressCheckout')`, but `app/checkout/page.tsx` ignores this key and reads strictly from the global cart store.

### 2.3 Payments Integration
- **Status**: **COD only**.
- **Gap**: `razorpay` (`^2.9.6`) is installed in `package.json`, but no payment verification route handler (`/api/payments/razorpay/verify`) or Razorpay Checkout script loader is implemented.

### 2.4 Customer Reviews System
- **Status**: The backend model and endpoint are fully production-grade:
  - Enforces `1 <= rating <= 5`.
  - Enforces `@@unique([userId, productId])` to prevent review spamming.
  - Returns reviewer names via relational join.
- **Gap**: In [`components/ui/reviews-section.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/reviews-section.tsx#L101), the "Write a Review" button has no modal or form connected to it, preventing users from ever submitting reviews through the UI.

### 2.5 Shipping & Order Fulfillment
- **Strengths**: Customers can track orders through a visual 4-step stepper (`Placed` -> `Paid` -> `Shipped` -> `Delivered`). Admins can update this status via dropdown in [`app/admin/orders/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/admin/orders/page.tsx).
- **Gaps**: No tracking number / AWB number field in the `Order` model; no automated notification sent when status changes to `shipped`.

---

## 3. E-Commerce Feature Issues Table

| File Path | Issue | Severity | Fix Suggestion |
| :--- | :--- | :--- | :--- |
| [`app/checkout/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/checkout/page.tsx#L245) | Online payment is disabled/dead code despite `razorpay` dependency installed. | **High** | Implement Razorpay order creation and signature verification flow. |
| [`components/ui/reviews-section.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/reviews-section.tsx#L101) | "Write a Review" button is an unclickable dead UI element. | **Medium** | Attach a review submission dialog calling `POST /api/reviews`. |
| [`components/ui/product-detail.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/product-detail.tsx#L191) | "Buy Now" sets `sessionStorage.setItem('expressCheckout', ...)`, but `CheckoutPage` ignores it. | **Medium** | Update `app/checkout/page.tsx` to read express checkout item if query param `?express=true` is present. |
| [`prisma/schema.prisma`](file:///c:/B.tech/3rd%20sem/DBMS/Project/prisma/schema.prisma#L78) | `Order` table lacks tracking/courier fields (`trackingNumber`, `carrierName`). | **Low** | Add `trackingNumber String?` and `carrier String?` to `Order` schema. |
