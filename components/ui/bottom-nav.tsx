"use client"

import { Home, Package, Grid3X3, Heart, User } from "lucide-react"
import { useState } from "react"
import { useRouter, usePathname } from 'next/navigation'

const navItems = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "orders", label: "Orders", icon: Package, href: "/orders" },
  { id: "categories", label: "Categories", icon: Grid3X3, href: "/products" },
  { id: "wishlist", label: "Wishlist", icon: Heart, href: "/wishlist" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
]


export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border safe-area-pb">
      <div className="flex items-center justify-around py-2 pb-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 ${
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-colors ${
                pathname === item.href ? "bg-primary/10" : ""
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform ${
                  pathname === item.href ? "scale-110" : ""
                }`}
                fill={pathname === item.href && item.id === "wishlist" ? "currentColor" : "none"}
              />
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
