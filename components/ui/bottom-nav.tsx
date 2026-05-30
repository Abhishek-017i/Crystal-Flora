"use client"

import { Home, Package, Grid3X3, Heart, User } from "lucide-react"
import { useState } from "react"

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "orders", label: "Orders", icon: Package },
  { id: "categories", label: "Categories", icon: Grid3X3 },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
]

export function BottomNav() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border safe-area-pb">
      <div className="flex items-center justify-around py-2 pb-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 ${
              activeTab === item.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-colors ${
                activeTab === item.id ? "bg-primary/10" : ""
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform ${
                  activeTab === item.id ? "scale-110" : ""
                }`}
                fill={activeTab === item.id && item.id === "wishlist" ? "currentColor" : "none"}
              />
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
