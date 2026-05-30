"use client"
import { useCartStore } from '@/lib/store'
import { useState } from "react"
import Image from "next/image"
import { Heart, ShoppingCart, ChevronRight } from "lucide-react"

type Product = {
  id: string
  name: string
  image: string
  originalPrice: number
  discountedPrice: number
  isNew?: boolean
  isOnSale?: boolean
  isWishlisted?: boolean
}

type ProductRowProps = {
  title: string
  products: Product[]
}

export function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted || false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
  setIsAdding(true)
  useCartStore.getState().addItem({
    id: product.id,
    name: product.name,
    price: product.originalPrice,
    discountedPrice: product.discountedPrice,
    image: product.image,
    quantity: 1
  })
  setTimeout(() => setIsAdding(false), 500)
}

  return (
    <div className="group relative flex-shrink-0 w-40 md:w-52">
      {/* Product Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-sm group-hover:shadow-lg transition-shadow duration-300">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-olive-green text-white rounded-full">
              NEW
            </span>
          )}
          {product.isOnSale && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground rounded-full">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-card/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.originalPrice}
          </span>
          <span className="text-sm font-semibold text-primary">
            ₹{product.discountedPrice}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className={`w-full mt-2 py-2 px-4 text-xs font-semibold rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 ${
            isAdding
              ? "bg-olive-green text-white scale-95"
              : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          {isAdding ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}

export function ProductRow({ title, products }: ProductRowProps) {
  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground">
          {title}
        </h3>
        <button className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors group">
          View More
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Scrollable Products */}
      <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
