# 02 — Design System & UI Architecture

## 1. Design System Overview & Framework

The visual architecture of **Crystal Flora** is custom-crafted around a bespoke artisanal palette: **Blush Pink, Rose Gold, Warm Cream, and Olive Green**. It conveys an organic, elegant, handcrafted aesthetic tailored for floral keepsakes, bouquets, and jewelry.

- **Core Styling Engine**: **Tailwind CSS v4.0** with `@tailwindcss/postcss` and `tw-animate-css`.
- **Theme Standard**: CSS variables declared in modern `oklch()` color space inside [`app/globals.css`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/globals.css) and bound via `@theme inline`.
- **Component Primitives**: Radix UI Slot, Base UI, Shadcn UI conventions, Lucide React icons, and Sonner toast.

---

## 2. Color Palette & Token Definitions

### 2.1 Brand Tokens (`oklch` Color Space)

| Token Name | Light Value | Semantic Purpose |
| :--- | :--- | :--- |
| `--background` | `oklch(0.98 0.008 20)` | Warm blush-tinted canvas background |
| `--foreground` | `oklch(0.25 0.02 30)` | Deep warm charcoal text for high contrast |
| `--primary` | `oklch(0.72 0.12 15)` | Vibrant rose gold / blush pink primary brand action |
| `--secondary` | `oklch(0.95 0.02 20)` | Soft pale pink container & card accent |
| `--accent` | `oklch(0.78 0.08 55)` | Warm golden rose shimmer for badges & highlights |
| `--muted` | `oklch(0.96 0.01 20)` | Subtle neutral background for cards and pill containers |
| `--muted-foreground` | `oklch(0.55 0.02 30)` | Secondary text, captions, and pricing timestamps |
| `--border` / `--input` | `oklch(0.92 0.02 20)` | Soft pink-tinted outline for inputs and cards |
| `--rose-gold` | `oklch(0.78 0.08 55)` | Distinctive metallic brand accent |
| `--blush-pink` | `oklch(0.88 0.06 15)` | Petal-soft tint for icon containers |
| `--olive-green` | `oklch(0.45 0.08 130)` | Botanical stem green for headings and brand monogram |
| `--save` (Tailwind custom) | Emerald green | Promotional tag & savings indicator |

### 2.2 Dark Mode Support Status
- Declared in [`app/globals.css`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/globals.css#L49-L82) with full `.dark` class variables.
- **Defect**: No dark mode toggle is exposed to the customer or admin, and `ThemeProvider` in [`components/ui/theme-provider.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/theme-provider.tsx) is not mounted in [`app/layout.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/layout.tsx). Dark mode is currently dead code.

---

## 3. Typography Hierarchy

Fonts are loaded via `next/font/google` in [`app/layout.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/layout.tsx#L8-L16):

| Role | Font Family | Variable | Application |
| :--- | :--- | :--- | :--- |
| **Heading / Display** | **Playfair Display** (Serif) | `--font-playfair` | Section titles, brand logo, product titles, currency figures |
| **Body / Interface** | **DM Sans** (Sans-serif) | `--font-dm-sans` | Body text, form inputs, button labels, navigation elements |
| **Monospace / Technical** | **Geist Mono** | Inline fallback | Order IDs, SQL code snippets, technical logs |

---

## 4. Component Inventory & Audit

### 4.1 Customer Storefront Components ([`components/ui/`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui))

| Component | Purpose | Status | Notes |
| :--- | :--- | :--- | :--- |
| `navbar.tsx` | Sticky top navigation with search bar & cart badge | **Active** | Expands search on click; navigates to `/products?search=...` |
| `hero-carousel.tsx` | Carousel promoting handcrafted collections | **Active** | Displays promotional banners with auto-transition |
| `category-grid.tsx` | 6-grid icon navigation with Lucide floral icons | **Active** | Fetches `/api/categories` dynamically |
| `product-row.tsx` | Horizontal scrollable product rail | **Active** | Shows category collections on homepage |
| `product-card.tsx` | Individual product card with image & price | **Active** | Displays sale badges and hover scaling |
| `product-detail.tsx` | Comprehensive product showcase view | **Active (Issues)** | Contains dead "Write a Review" button & hardcoded phone |
| `photo-carousel.tsx` | Image slider on product detail page | **Active** | Has fallback to `/images/logo.png` |
| `star-rating.tsx` | Visual star rating display | **Active** | Renders partial and full Lucide stars |
| `reviews-section.tsx` | Review list with star breakdown bars | **Active (Incomplete)** | "Write a Review" button is unclickable |
| `related-products.tsx` | "You may also like" product strip | **Active** | Props often empty due to missing relation |
| `whatsapp-button.tsx` | Floating sticky WhatsApp quick contact button | **Active** | Opens WhatsApp chat directly |
| `bottom-nav.tsx` | Fixed mobile bottom navigation dock | **Active** | Links to `/`, `/orders`, `/products`, `/wishlist`, `/profile` |
| `wishlist-content.tsx` | Grid displaying saved wishlist items | **Active** | Supports instant removal from wishlist |
| `wishlist-provider.tsx` | Syncs wishlist count from server on mount | **Active** | Syncs with Zustand store |
| `session-provider.tsx` | NextAuth `SessionProvider` wrapper | **Active** | Used in root layout |

### 4.2 Cart Components ([`components/cart/`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/cart))

| Component | Purpose | Status | Notes |
| :--- | :--- | :--- | :--- |
| `cart-item.tsx` | Quantity controls & remove button | **Active** | Linked with Zustand `useCartStore` |
| `order-summary.tsx` | Subtotal and total calculation card | **Active** | Computes live cart prices |
| `empty-cart.tsx` | Empty state placeholder with shopping CTA | **Active** | Displays when cart item count is 0 |
| `bottom-nav.tsx` | Duplicate bottom navigation | **DEAD CODE** | Duplicate of `components/ui/bottom-nav.tsx` with dead `/categories` link |

### 4.3 Admin Components ([`components/admin/`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/admin))

| Component | Purpose | Status | Notes |
| :--- | :--- | :--- | :--- |
| `admin-nav.tsx` | Sidebar with dashboard, orders, products, stats links | **Active** | Supports mobile sheet and desktop sidebar |
| `stat-card.tsx` | Single KPI metric card with icon & subtitle | **Active** | Used throughout admin dashboard |
| `stats-card.tsx` | Alternate metric card with monthly trend indicator | **DEAD CODE** | Unused duplicate of `stat-card.tsx` |
| `recent-orders.tsx` | Widget for recent orders | **DEAD CODE** | Unused in all admin pages |
| `top-products.tsx` | Widget for top selling products | **DEAD CODE** | Unused in all admin pages |
| `status-badge.tsx` | Admin status badge | **DEAD CODE** | Duplicate of `components/ui/status-badge.tsx` |

### 4.4 Unused Primitives (Shadcn Generics)
- [`components/ui/dialog.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/dialog.tsx) — **Unused**
- [`components/ui/dropdown-menu.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/dropdown-menu.tsx) — **Unused**
- [`components/ui/sheet.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/sheet.tsx) — **Unused**
- [`components/ui/table.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/table.tsx) — **Unused** (admin tables use raw HTML `<table>`)
- [`components/ui/theme-provider.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/theme-provider.tsx) — **Unused**

---

## 5. Responsive Design & Accessibility Audit

### 5.1 Responsive Breakpoints
- Built mobile-first using Tailwind default breakpoints:
  - `sm` (640px): Tablet grid layouts
  - `md` (768px): Desktop admin sidebar activates (`md:ml-64`), multi-column grids
  - `lg` (1024px): 12-column checkout grid (7-col form + 5-col sticky summary)
- Customer views (`app/products/[id]/page.tsx`, `app/checkout/page.tsx`) constrain themselves nicely to `max-w-md` or `max-w-5xl`.

### 5.2 Accessibility Status
- **Aria Labels**: Well-applied on icon-only buttons (`aria-label="Go back"`, `aria-label="Add to wishlist"`, `aria-label="Search"`).
- **Form Labels**: In `register/page.tsx` and `login/page.tsx`, inputs rely partially on `placeholder` attributes without associated visual `<label>` tags.
- **Contrast**: `oklch` foreground/background pairs provide strong readability (> 4.5:1 ratio).
- **Missing Focus Indicators**: Some custom buttons lack explicit `focus-visible:ring` rings.

---

## 6. Design System Issues Table

| File Path | Issue | Severity | Fix Suggestion |
| :--- | :--- | :--- | :--- |
| [`components/cart/bottom-nav.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/cart/bottom-nav.tsx#L35) | Hardcodes hex color `style={{ color: '#d4869f' }}` bypassing Tailwind CSS variable tokens. | **Medium** | Delete duplicate component; use `components/ui/bottom-nav.tsx` with `text-primary`. |
| [`components/ui/reviews-section.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/reviews-section.tsx#L101-L107) | "Write a Review" button is completely non-functional without an `onClick` or modal dialog trigger. | **Medium** | Connect button to a review modal dialog that POSTs to `/api/reviews`. |
| [`components/ui/theme-provider.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/theme-provider.tsx) | Theme provider is never mounted, rendering all `.dark` CSS tokens in `globals.css` unusable. | **Low** | Mount `ThemeProvider` in `app/layout.tsx` or prune unused dark mode CSS. |
| [`components/admin/stats-card.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/admin/stats-card.tsx) | Redundant dead component duplicating `stat-card.tsx`. | **Low** | Delete file to clean up codebase. |
