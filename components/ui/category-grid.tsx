"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Flower2, Gem, Link2, Sparkles, Scissors, Crown, Tag } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

const iconMap: { [key: string]: any } = {
  bouquets: Flower2,
  "fabric flowers": Sparkles,
  bracelets: Link2,
  necklaces: Gem,
  keychains: Crown,
  "hair clips": Scissors,
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  return (
    <section className="px-4 py-8">
      <h2 className="font-serif text-xl md:text-2xl text-foreground font-semibold mb-6 text-center">
        Shop by Category
      </h2>
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4">
        {categories.map((category) => {
          const Icon = iconMap[category.name.toLowerCase()] ?? Tag
          return (
            <button
              key={category.id}
              onClick={() => router.push(`/products?category=${category.slug}`)}
              className="group flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-border/50"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-secondary rounded-full group-hover:bg-primary/10 transition-colors">
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground text-center leading-tight">
                {category.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}