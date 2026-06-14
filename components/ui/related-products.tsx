'use client'

import { Heart } from 'lucide-react'
import type { RelatedProduct } from '@/lib/product-data'
import { useState } from 'react'

function ProductCard({ product }: { product: RelatedProduct }) {
  const [liked, setLiked] = useState(false)
  return (
    <div className="w-44 shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-square bg-blush">
        {product.sale && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            Sale
          </span>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => setLiked((v) => !v)}
          className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-white/90 shadow-sm"
        >
          <Heart
            size={14}
            className={liked ? 'text-primary' : 'text-muted-foreground'}
            fill={liked ? 'currentColor' : 'none'}
          />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="truncate font-serif text-sm font-semibold text-foreground">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-bold text-primary">₹{product.price}</span>
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.originalPrice}
          </span>
        </div>
      </div>
    </div>
  )
}

export function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  return (
    <section className="py-6">
      <h2 className="px-4 font-serif text-2xl font-bold text-foreground">You may also like</h2>
      <div className="mt-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
