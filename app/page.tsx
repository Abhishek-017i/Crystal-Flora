import { Navbar } from "@/components/ui/navbar"
import { HeroCarousel } from "@/components/ui/hero-carousel"
import { CategoryGrid } from "@/components/ui/category-grid"
import { ProductRow } from "@/components/ui/product-row"
import { BottomNav } from "@/components/ui/bottom-nav"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"

// Sample product data
const bouquetProducts = [
  {
    id: 1,
    name: "Pastel Rose Bouquet",
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&q=80",
    originalPrice: 1499,
    discountedPrice: 1199,
    isNew: true,
  },
  {
    id: 2,
    name: "Lavender Dreams Bundle",
    image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=80",
    originalPrice: 1299,
    discountedPrice: 999,
    isOnSale: true,
  },
  {
    id: 3,
    name: "Sunset Peony Arrangement",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80",
    originalPrice: 1599,
    discountedPrice: 1399,
  },
  {
    id: 4,
    name: "Cherry Blossom Posy",
    image: "https://images.unsplash.com/photo-1518882605630-8eb699b8a5f3?w=400&q=80",
    originalPrice: 899,
    discountedPrice: 699,
    isNew: true,
    isOnSale: true,
  },
]

const braceletProducts = [
  {
    id: 5,
    name: "Crystal Charm Bracelet",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
    originalPrice: 599,
    discountedPrice: 449,
    isNew: true,
  },
  {
    id: 6,
    name: "Pearl String Bracelet",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80",
    originalPrice: 499,
    discountedPrice: 399,
  },
  {
    id: 7,
    name: "Rose Gold Bangle Set",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80",
    originalPrice: 799,
    discountedPrice: 599,
    isOnSale: true,
  },
  {
    id: 8,
    name: "Friendship Band Trio",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    originalPrice: 349,
    discountedPrice: 249,
  },
]

const necklaceProducts = [
  {
    id: 9,
    name: "Delicate Chain Necklace",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
    originalPrice: 899,
    discountedPrice: 699,
    isNew: true,
  },
  {
    id: 10,
    name: "Floral Pendant Set",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    originalPrice: 749,
    discountedPrice: 549,
    isOnSale: true,
  },
  {
    id: 11,
    name: "Layered Gold Chains",
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&q=80",
    originalPrice: 1199,
    discountedPrice: 899,
  },
  {
    id: 12,
    name: "Gemstone Drop Necklace",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    originalPrice: 999,
    discountedPrice: 799,
    isNew: true,
  },
]

const hairClipProducts = [
  {
    id: 13,
    name: "Floral Hair Pin Set",
    image: "https://images.unsplash.com/photo-1588417446283-d3f6308c2af8?w=400&q=80",
    originalPrice: 399,
    discountedPrice: 299,
    isNew: true,
  },
  {
    id: 14,
    name: "Pearl Claw Clip",
    image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=400&q=80",
    originalPrice: 349,
    discountedPrice: 249,
    isOnSale: true,
  },
  {
    id: 15,
    name: "Butterfly Clips Duo",
    image: "https://images.unsplash.com/photo-1589476993333-f55b84301219?w=400&q=80",
    originalPrice: 299,
    discountedPrice: 199,
  },
  {
    id: 16,
    name: "Crystal Hair Vine",
    image: "https://images.unsplash.com/photo-1585767444381-26f13251ab5d?w=400&q=80",
    originalPrice: 599,
    discountedPrice: 449,
    isNew: true,
    isOnSale: true,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      <main>
        <HeroCarousel />
        
        {/* Tagline Banner */}
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
          <ProductRow title="Bouquets" products={bouquetProducts} />
          <ProductRow title="Bracelets" products={braceletProducts} />
          <ProductRow title="Necklaces" products={necklaceProducts} />
          <ProductRow title="Hair Clips" products={hairClipProducts} />
        </div>
        
        {/* Instagram Feed Section */}
        <section className="py-8 px-4">
          <div className="text-center mb-6">
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2">
              Follow Us on Instagram
            </h2>
            <p className="text-sm text-muted-foreground">
              @crystalfloraa
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1 md:gap-2 rounded-xl overflow-hidden">
            {[
              "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=300&q=80",
              "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80",
              "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80",
              "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&q=80",
              "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=300&q=80",
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80",
            ].map((src, index) => (
              <div
                key={index}
                className="aspect-square relative overflow-hidden group cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 px-4 bg-secondary text-center">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-semibold text-olive-green">
              Crystal Flora
            </h3>
            <p className="text-xs text-muted-foreground">by Sanskriti Sharma</p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Handcrafted with love in India
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">About</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
            <a href="#" className="hover:text-primary transition-colors">Shipping</a>
            <a href="#" className="hover:text-primary transition-colors">Returns</a>
          </div>
          <p className="text-[10px] text-muted-foreground mt-6">
            © 2024 Crystal Flora. All rights reserved.
          </p>
        </footer>
      </main>
      
      <WhatsAppButton />
      <BottomNav />
    </div>
  )
}

