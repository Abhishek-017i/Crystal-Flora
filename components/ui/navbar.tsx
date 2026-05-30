"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, ShoppingBag, X } from "lucide-react"
import { useCartStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const cartItems = useCartStore(state => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full bg-secondary/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Crystal Flora"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold text-olive-green leading-tight">
              Crystal Flora
            </span>
          </div>
        </div>

        {/* Search and Cart */}
        <div className="flex items-center gap-3">
          {/* Expandable Search */}
          <div className="relative flex items-center">
            <div
              className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${
                isSearchOpen ? "w-48 md:w-64" : "w-0"
              }`}
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-3 pr-8 text-sm bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {isSearchOpen && (
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                  }}
                  className="absolute right-10 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Cart */}
          <button 
            onClick={() => router.push('/cart')}
            className="relative p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-semibold text-primary-foreground bg-primary rounded-full">
              {cartCount}
            </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
