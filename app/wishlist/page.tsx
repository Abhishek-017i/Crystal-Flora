'use client'

import { useState, useEffect } from 'react'
import WishlistContent from '@/components/ui/wishlist-content'
import { Navbar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    fetch('/api/wishlist', {
      headers: { authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return
        setWishlistItems(data.map((item: any) => ({
          id: item.product.id,
          name: item.product.name,
          originalPrice: item.product.price,
          discountedPrice: item.product.discountedPrice ?? item.product.price,
          image: item.product.images?.[0] ?? '/images/logo.png',
          isNew: false,
          isOnSale: item.product.discountedPrice < item.product.price
        })))
      })
      .catch(() => setWishlistItems([]))
  }, [])

  const removeFromWishlist = async (id: string) => {
    const token = localStorage.getItem('token')
    if (!token) return
    await fetch(`/api/wishlist/${id}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` }
    })
    setWishlistItems(wishlistItems.filter(item => item.id !== id))
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20">
        <WishlistContent items={wishlistItems} onRemove={removeFromWishlist} />
      </main>
      <BottomNav />
    </div>
  )
}