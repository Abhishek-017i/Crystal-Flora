# 12 — SEO, Metadata & Marketing Audit

## 1. SEO Implementation Matrix

| SEO Domain | Status | Location / Implementation | Assessment |
| :--- | :---: | :--- | :--- |
| **Static Metadata** | **PARTIAL** | [`app/layout.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/layout.tsx#L18-L22) | Title, description, and keywords declared globally. |
| **Dynamic Product Metadata**| **MISSING** | [`app/products/[id]/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/products/[id]/page.tsx) | No `generateMetadata()`. Product pages share the generic homepage title! |
| **OpenGraph & Social Sharing** | **MISSING** | `app/layout.tsx` | No `openGraph` or `twitter` cards configured in Next.js metadata. |
| **JSON-LD Structured Data** | **MISSING** | Nowhere in repo | No Schema.org `Product`, `Offer`, or `Organization` rich snippets for Google. |
| **Sitemap (`sitemap.xml`)** | **MISSING** | No `app/sitemap.ts` or `public/sitemap.xml` | Search engines cannot discover product deep-links automatically. |
| **Robots (`robots.txt`)** | **MISSING** | No `app/robots.ts` or `public/robots.txt` | No crawler indexing instructions or disallows for `/admin`. |
| **Canonical URLs** | **MISSING** | No `metadataBase` in metadata | Duplicate content risk across domains / subdomains. |
| **Web Analytics** | **MISSING** | `@vercel/analytics` in dependencies | Package installed but `<Analytics />` component is never mounted in layout. |

---

## 2. Root Layout Metadata Audit

In [`app/layout.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/layout.tsx#L18-L29):
```ts
export const metadata: Metadata = {
  title: 'Crystal Flora | Handcrafted Blooms & Keepsakes',
  description: 'Discover beautifully handcrafted fabric flowers, bracelets, necklaces, keychains and hair clips.',
  keywords: ['handmade', 'fabric flowers', 'bracelets', 'necklaces', 'keychains', 'hair clips', 'bouquets', 'gifts'],
}

export const viewport: Viewport = {
  themeColor: '#f5e6e0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // ACCESSIBILITY DEFECT: Prevents mobile user pinch-to-zoom!
}
```

### Critical Flaws:
1. **Accessibility Issue**: `maximumScale: 1` disables user pinch-to-zoom on iOS/Android, violating WCAG accessibility guidelines.
2. **Missing `metadataBase`**: Next.js requires `metadataBase: new URL('https://crystalflora.in')` to generate absolute social image URLs.
3. **Missing OpenGraph**: Sharing links on WhatsApp, iMessage, Instagram, or Twitter displays an empty grey box with no preview banner.

---

## 3. Product Page Dynamic Metadata Gap

Currently, [`app/products/[id]/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/products/[id]/page.tsx) is a 7-line file:
```tsx
import { ProductDetail } from '@/components/ui/product-detail'

export default function Page() {
  return <ProductDetail />
}
```

### Recommended Solution:
Export `generateMetadata({ params })`:
```tsx
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return { title: 'Product Not Found | Crystal Flora' }

  return {
    title: `${product.name} | Crystal Flora`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  }
}
```

---

## 4. Structured Data (Schema.org JSON-LD) Recommendation

To qualify for Google Search rich snippets (displaying star ratings, ₹ pricing, and in-stock badges directly in search results), product pages must inject:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Crystal Aura Bracelet",
  "image": ["https://crystalflora.in/images/bracelet.jpg"],
  "description": "Handcrafted crystal bracelet made with natural blooms.",
  "offers": {
    "@type": "Offer",
    "url": "https://crystalflora.in/products/prod1",
    "priceCurrency": "INR",
    "price": "499",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "12"
  }
}
```

---

## 5. SEO Issues & Recommendations Table

| File Path | Issue | Severity | Fix Suggestion |
| :--- | :--- | :--- | :--- |
| [`app/products/[id]/page.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/products/[id]/page.tsx) | Missing `generateMetadata()`; all product pages share identical generic title. | **High** | Implement `generateMetadata()` reading product name, description, and image. |
| Root | Missing `app/robots.ts` and `app/sitemap.ts`. | **High** | Add dynamic sitemap querying all products/categories and robots disallowing `/admin`. |
| [`app/layout.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/layout.tsx#L28) | `maximumScale: 1` in viewport breaks mobile accessibility pinch-to-zoom. | **Medium** | Remove `maximumScale: 1` from `viewport`. |
| [`app/layout.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/layout.tsx#L18) | Missing OpenGraph and Twitter card metadata configurations. | **Medium** | Add `openGraph` and `twitter` card objects with brand images. |
