"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
  id: string
  images: string[]
  name: string
  description: string
  discountedPrice: number | null
  price: number
}

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const highlighted = data.filter((p: Slide & { isHighlighted: boolean }) => p.isHighlighted)
        setSlides(highlighted.length > 0 ? highlighted : data.slice(0, 4))
      })
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % (slides.length || 1))
  }, [slides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (slides.length || 1)) % (slides.length || 1))
  }

  useEffect(() => {
    if (slides.length === 0) return
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [nextSlide, slides.length])

  if (slides.length === 0) {
    return (
      <section className="relative w-full aspect-[4/5] md:aspect-[16/9] bg-secondary animate-pulse" />
    )
  }

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative w-full flex-shrink-0 aspect-[4/5] md:aspect-[16/9]"
          >
            <Image
              src={slide.images[0] ?? '/images/logo.png'}
              alt={slide.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12">
              <span className="text-primary-foreground/90 text-sm font-medium mb-1">
                {slide.description}
              </span>
              <h2 className="font-serif text-2xl md:text-4xl text-primary-foreground font-semibold mb-2 text-balance">
                {slide.name}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-primary-foreground text-lg font-semibold">
                  ₹{slide.discountedPrice ?? slide.price}
                </span>
                <button className="px-6 py-2.5 bg-primary-foreground text-primary text-sm font-semibold rounded-full hover:bg-primary-foreground/90 transition-all duration-300 hover:scale-105 shadow-lg">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
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