'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { Navbar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { Suspense } from 'react'

interface Product {
  id: string
  name: string
  images: string[]
  price: number
  discountedPrice: number | null
  isInStock: boolean
  createdAt: string
}
function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }, [search, category])

  const title = search
    ? `Results for "${search}"`
    : category
    ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
    : 'All Products'

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      <main className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="font-serif text-xl font-semibold text-foreground">
            {title}
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-secondary animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/products/${product.id}`)}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-sm group-hover:shadow-lg transition-shadow">
                  <Image
                    src={product.images[0] ?? '/images/logo.png'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!product.isInStock && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
                    </div>
                  )}
                  {product.discountedPrice && product.discountedPrice < product.price && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full">
                      SALE
                    </span>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  <h3 className="text-sm font-medium text-foreground line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{product.price}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      ₹{product.discountedPrice ?? product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
      <ProductsContent />
    </Suspense>
  )
}