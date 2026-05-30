"use client"

import { Flower2, Gem, Link2, Sparkles, Scissors, Crown } from "lucide-react"

const categories = [
  { id: 1, name: "Bouquets", icon: Flower2, count: 12 },
  { id: 2, name: "Fabric Flowers", icon: Sparkles, count: 24 },
  { id: 3, name: "Bracelets", icon: Link2, count: 18 },
  { id: 4, name: "Necklaces", icon: Gem, count: 15 },
  { id: 5, name: "Keychains", icon: Crown, count: 20 },
  { id: 6, name: "Hair Clips", icon: Scissors, count: 16 },
]

export function CategoryGrid() {
  return (
    <section className="px-4 py-8">
      <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-6 text-center">
        Shop by Category
      </h2>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            className="group flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-border/50"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-secondary rounded-full group-hover:bg-primary/10 transition-colors">
              <category.icon className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs md:text-sm font-medium text-foreground text-center leading-tight">
              {category.name}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {category.count} items
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
