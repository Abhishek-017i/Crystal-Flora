'use client'

import { useEffect } from 'react'
import { useWishlistStore } from '@/lib/store'

export function WishlistProvider() {
  const { setItems } = useWishlistStore()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    fetch('/api/wishlist', {
      headers: { authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return
        setItems(data.map((item: any) => item.productId))
      })
      .catch(() => {})
  }, [])

  return null
}