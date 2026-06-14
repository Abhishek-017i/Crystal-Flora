'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Heart, Sparkles, Minus, Plus, Trash2, ShoppingBag, Truck, MessageCircle } from 'lucide-react'
import { PhotoCarousel } from './photo-carousel'
import { StarRating } from './star-rating'
import { ReviewsSection } from './reviews-section'
import { RelatedProducts } from './related-products'
import { useCartStore } from '@/lib/store'
import { BottomNav } from '@/components/ui/bottom-nav'
import { WhatsAppButton } from '@/components/ui/whatsapp-button'
import { Navbar } from '@/components/ui/navbar'

export function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const [wishlisted, setWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [descExpanded, setDescExpanded] = useState(false)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/products/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data)
          setLoading(false)
        })
    }
  }, [params?.id])

  if (loading) return <div className="min-h-screen bg-background animate-pulse" />
  if (!product) return <div className="min-h-screen bg-background flex items-center justify-center">Product not found</div>

  const savings = (product.price ?? 0) - (product.discountedPrice ?? product.price ?? 0)

  function scrollToReviews() {
    document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <main className="mx-auto min-h-screen max-w-md bg-background pb-28 md:max-w-2xl">
      <Navbar />
      {/* Top bar
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          aria-label="Go back"
          className="flex size-9 items-center justify-center rounded-full bg-blush text-foreground"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-serif text-lg font-semibold text-foreground">Product Details</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Share product"
            className="flex size-9 items-center justify-center rounded-full bg-blush text-foreground"
          >
            <Share2 size={17} />
          </button>
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={() => setWishlisted((v) => !v)}
            className="flex size-9 items-center justify-center rounded-full bg-blush"
          >
            <Heart
              size={17}
              className={wishlisted ? 'text-primary' : 'text-foreground'}
              fill={wishlisted ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </header> */}

      {/* Photo carousel */}
      <PhotoCarousel 
        images={product.images?.length > 0 ? product.images : ['/images/logo.png']} 
        alt={product.name}
        productId={product.id}
      />

      {/* Product info */}
      <section className="px-4 pt-5">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Sparkles size={12} />
          Handcrafted with love
        </span>
        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-foreground text-balance">
          {product.name}
        </h2>

        <button
          type="button"
          onClick={scrollToReviews}
          className="mt-2 flex items-center gap-2"
        >
          <StarRating rating={product.rating} size={16} />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-sm text-primary underline-offset-2 hover:underline">
            Read {product.reviewCount} Reviews
          </span>
        </button>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-base text-muted-foreground line-through">
            ₹{product.originalPrice}
          </span>
          <span className="font-serif text-3xl font-bold text-primary">₹{product.price}</span>
          <span className="rounded-full bg-save/10 px-2.5 py-1 text-xs font-semibold text-save">
            You save ₹{savings}
          </span>
        </div>
      </section>

      {/* Description */}
      <section className="px-4 pt-6">
        <h3 className="font-serif text-xl font-bold text-foreground">Description</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {descExpanded ? product.fullDescription : product.shortDescription}
        </p>
        <button
          type="button"
          onClick={() => setDescExpanded((v) => !v)}
          className="mt-1 text-sm font-medium text-primary"
        >
          {descExpanded ? 'Read less' : 'Read more'}
        </button>
      </section>

      {/* Quantity selector */}
      <section className="flex flex-col items-center px-4 pt-6">
        <span className="text-sm font-medium text-muted-foreground">Quantity</span>
        <div className="mt-2 flex items-center gap-5 rounded-full border border-border bg-card px-2 py-1.5 shadow-sm">
          <button
            type="button"
            aria-label={quantity === 1 ? 'Remove item' : 'Decrease quantity'}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-9 items-center justify-center rounded-full bg-blush text-primary transition-colors hover:bg-accent"
          >
            {quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
          </button>
          <span className="w-6 text-center font-serif text-lg font-semibold text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-9 items-center justify-center rounded-full bg-blush text-primary transition-colors hover:bg-accent"
          >
            <Plus size={16} />
          </button>
        </div>
      </section>

      {/* Action buttons */}
      <section className="flex flex-col gap-3 px-4 pt-6">
        <button
          type="button"
          onClick={() => {
            addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            discountedPrice: product.discountedPrice,
            image: product.images?.[0] ?? '/images/logo.png',
            quantity: quantity
            })
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
        >
          <ShoppingBag size={18} />
          Add to Cart
        </button>
        <button
          type="button"
          onClick={() => {
            const expressItem = {
              id: product.id,
              name: product.name,
              price: product.price,
              discountedPrice: product.discountedPrice,
              image: product.images?.[0] ?? '/images/logo.png',
              quantity: quantity
            }
            sessionStorage.setItem('expressCheckout', JSON.stringify(expressItem))
            router.push('/checkout?express=true')
          }}
          className="w-full rounded-full border border-primary py-3.5 font-semibold text-primary transition-colors hover:bg-blush"
        >
          Buy Now
        </button>
        <button
          type="button"
          onClick={() => {
            const message = `Hi! I want to place a custom order for: ${product.name}`
            window.open(`https://wa.me/8109142426?text=${encodeURIComponent(message)}`, '_blank')
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp py-3.5 font-semibold text-white shadow-sm transition-colors hover:opacity-90"
        >
          <MessageCircle size={18} />
          Custom Order via WhatsApp
        </button>
      </section>

      {/* Delivery info */}
      <section className="px-4 pt-6">
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blush text-primary">
            <Truck size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Estimated delivery in 5–7 working days
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Free delivery across India 🇮🇳
            </p>
          </div>
        </div>
      </section>

      {/* You may also like */}
      <RelatedProducts products={product.category?.products ?? []} />

      {/* Reviews */}
      <ReviewsSection reviews={product.reviews ?? []} averageRating={product.rating ?? 0} />

      <BottomNav />
      <WhatsAppButton />
      {/* Sticky Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:max-w-2xl">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground line-through">₹{product.price}</span>
            <span className="font-serif text-xl font-bold text-primary">₹{product.discountedPrice ?? product.price}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                discountedPrice: product.discountedPrice,
                image: product.images?.[0] ?? '/images/logo.png',
                quantity: quantity
              })
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  )
}
