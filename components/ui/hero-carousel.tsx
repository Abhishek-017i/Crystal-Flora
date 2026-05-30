"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    title: "Spring Bouquet Collection",
    subtitle: "Handcrafted with love",
    price: "₹1,299",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
    title: "Fabric Flower Arrangements",
    subtitle: "Blooms that last forever",
    price: "₹899",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    title: "Crystal Jewelry Sets",
    subtitle: "Elegant keepsakes",
    price: "₹599",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80",
    title: "Hair Accessories",
    subtitle: "Delicate handmade clips",
    price: "₹299",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {heroSlides.map((slide) => (
          <div
            key={slide.id}
            className="relative w-full flex-shrink-0 aspect-[4/5] md:aspect-[16/9]"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={slide.id === 1}
            />
            {/* Blush Pink Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12">
              <span className="text-primary-foreground/90 text-sm font-medium mb-1">
                {slide.subtitle}
              </span>
              <h2 className="font-serif text-2xl md:text-4xl text-primary-foreground font-semibold mb-2 text-balance">
                {slide.title}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-primary-foreground text-lg font-semibold">
                  {slide.price}
                </span>
                <button className="px-6 py-2.5 bg-primary-foreground text-primary text-sm font-semibold rounded-full hover:bg-primary-foreground/90 transition-all duration-300 hover:scale-105 shadow-lg">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-primary-foreground/80 rounded-full text-foreground hover:bg-primary-foreground transition-colors shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-primary-foreground/80 rounded-full text-foreground hover:bg-primary-foreground transition-colors shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-6 bg-primary-foreground"
                : "bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
