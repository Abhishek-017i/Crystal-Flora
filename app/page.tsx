'use client'

import { useEffect, useState } from "react"
import { Navbar } from "@/components/ui/navbar"
import { HeroCarousel } from "@/components/ui/hero-carousel"
import { CategoryGrid } from "@/components/ui/category-grid"
import { ProductRow } from "@/components/ui/product-row"
import { BottomNav } from "@/components/ui/bottom-nav"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

interface Product {
  id: string
  name: string
  images: string[]
  price: number
  discountedPrice: number | null
  categoryId: string
  isHighlighted: boolean
  createdAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  const getProductsByCategory = (categoryId: string) => {
    return products
      .filter(p => p.categoryId === categoryId)
      .map(p => ({
        id: p.id,
        name: p.name,
        image: p.images[0] ?? '/images/logo.png',
        originalPrice: p.price,
        discountedPrice: p.discountedPrice ?? p.price,
        isNew: new Date(p.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isOnSale: p.discountedPrice !== null && p.discountedPrice < p.price,
      }))
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />

      <main>
        <HeroCarousel />

        <div className="py-6 text-center bg-secondary/50">
          <p className="font-serif text-lg text-olive-green italic">
            &quot;Handcrafted blooms & keepsakes&quot;
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Made with love, designed to last forever
          </p>
        </div>

        <CategoryGrid />

        <div className="space-y-2 bg-muted/30">
          {categories.map(category => {
            const categoryProducts = getProductsByCategory(category.id)
            if (categoryProducts.length === 0) return null
            return (
              <ProductRow
                key={category.id}
                title={category.name}
                products={categoryProducts}
              />
            )
          })}
        </div>

        <section className="py-8 px-4">
          <div className="text-center mb-6">
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2">
              Follow Us on Instagram
            </h2>
            <p className="text-sm text-muted-foreground">@crystalfloraa_</p>
          </div>
        </section>

        <footer className="py-8 px-4 bg-secondary text-center">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-semibold text-olive-green">
              Crystal Flora
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Handcrafted with love in India
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <a href="/about" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Shipping</a>
          </div>
          <p className="text-[10px] text-muted-foreground mt-6">
            © 2026 Crystal Flora. All rights reserved.
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Website by <a href="https://www.linkedin.com/in/abhishek-kumar017?utm_source=share_via&utm_content=profile&utm_medium=member_android" className="hover:text-primary">Abhishek Kumar</a>
          </p>
        </footer>
      </main>

      <WhatsAppButton />
      <BottomNav />
    </div>
  )
}