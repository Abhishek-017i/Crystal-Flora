# 08 — State Management & Data Flow Architecture

## 1. Global State Architecture

```mermaid
graph TD
    subgraph ZustandStore ["Zustand Stores (lib/store.ts)"]
        CartStore["useCartStore<br/>• items: CartItem[]<br/>• addItem(), removeItem()<br/>• updateQuantity(), clearCart()<br/>• total()"]
        WishlistStore["useWishlistStore<br/>• items: string[] (product IDs)<br/>• addItem(), removeItem()<br/>• isWishlisted(), setItems()"]
    end

    subgraph BrowserStorage ["Browser Web Storage"]
        LSCart["localStorage['cart-storage']"]
        LSWishlist["localStorage['wishlist-storage']"]
        LSToken["localStorage['token'] & ['user']"]
    end

    subgraph ReactPages ["React Page Components"]
        CartPage["app/cart/page.tsx"]
        ProductDetail["components/ui/product-detail.tsx"]
        CheckoutPage["app/checkout/page.tsx"]
        WishlistPage["app/wishlist/page.tsx"]
        NavbarComp["components/ui/navbar.tsx"]
    end

    CartStore <-->|Zustand Persist Middleware| LSCart
    WishlistStore <-->|Zustand Persist Middleware| LSWishlist

    ProductDetail -->|addItem()| CartStore
    NavbarComp -->|Reads items.length| CartStore
    CartPage -->|updateQuantity() / removeItem()| CartStore
    CheckoutPage -->|Reads items & calls clearCart()| CartStore
    WishlistPage -.->|Desynchronized: Uses local state instead of store!| WishlistStore
```

---

## 2. Store Specifications & State Lifecycles

### 2.1 Cart Store (`useCartStore`)
- **File**: [`lib/store.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/store.ts#L22-L64)
- **Middleware**: `persist(..., { name: 'cart-storage' })`
- **Data Model**:
  ```ts
  interface CartItem {
    id: string
    name: string
    price: number
    discountedPrice: number | null
    image: string
    quantity: number
  }
  ```
- **Total Calculation**:
  ```ts
  total: () => items.reduce((sum, item) => sum + (item.discountedPrice ?? item.price) * item.quantity, 0)
  ```
- **Lifecycle**: State hydrates from `localStorage` upon page load. When the customer completes checkout in [`app/checkout/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/checkout/page.tsx#L114), `clearCart()` resets `items: []`.

### 2.2 Wishlist Store (`useWishlistStore`)
- **File**: [`lib/store.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/store.ts#L74-L88)
- **Middleware**: `persist(..., { name: 'wishlist-storage' })`
- **Model**: Array of product ID strings (`string[]`).
- **Desynchronization Defect**: While [`components/ui/wishlist-provider.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/wishlist-provider.tsx) loads product IDs into `useWishlistStore`, the actual wishlist page ([`app/wishlist/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/wishlist/page.tsx)) completely ignores `useWishlistStore` and maintains its own private `useState` array, leading to stale UI counts.

---

## 3. Data Fetching Pattern Analysis

### 3.1 The "Phantom Library" Problem: React Query
- In [`package.json`](file:///c:/B.tech/3rd%20sem/DBMS/Project/package.json#L17), `@tanstack/react-query` (`^5.100.14`) is declared as a core dependency.
- **Audit Result**: Zero occurrences of `useQuery`, `useMutation`, or `QueryClientProvider` exist anywhere in the code.

### 3.2 Current Data Fetching Pattern
- All data fetching relies on vanilla `fetch()` inside `useEffect()` hooks:
  ```ts
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])
  ```
- **Consequences**:
  - **No In-Memory Caching**: Navigating between `/` and `/products` refetches the entire catalog from the server every time.
  - **No Automatic Deduping**: Simultaneous component mounts trigger redundant parallel HTTP requests.
  - **No Background Stale-While-Revalidate**: Data remains stale until page reload.

---

## 4. Real-Time & Caching Layers

- **Server-Side Caching**: Minimal. [`lib/analytics.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/analytics.ts#L54) specifies `cache: 'no-store'`, forcing live database queries for admin metrics.
- **Real-Time Communication**:
  - No WebSockets (`ws` / Socket.io) or Server-Sent Events (SSE).
  - Admin dashboard relies on manual triggers via `<RefreshCw />` buttons calling `loadDashboardData()`.

---

## 5. State & Data Flow Issues Table

| File Path | Issue | Severity | Fix Suggestion |
| :--- | :--- | :--- | :--- |
| [`app/wishlist/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/wishlist/page.tsx#L9) | Bypasses `useWishlistStore` in favor of disconnected local state, causing navbar and page count desync. | **Medium** | Bind `app/wishlist/page.tsx` to read from and mutate `useWishlistStore`. |
| Whole Repo | `@tanstack/react-query` is installed as a 1MB dependency bundle but completely unused. | **Medium** | Either wrap app in `QueryClientProvider` and migrate `useEffect` fetches to `useQuery`, or remove the dependency. |
| [`components/ui/wishlist-provider.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/components/ui/wishlist-provider.tsx#L21) | Missing `setItems` in `useEffect` dependency array triggers ESLint react-hooks warning. | **Low** | Wrap `setItems` in `useCallback` inside `useWishlistStore` or pass stable setter. |
