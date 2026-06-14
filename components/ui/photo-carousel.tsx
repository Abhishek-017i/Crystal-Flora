'use client'

import { useRef, useState } from 'react'
import { Share2, Heart } from 'lucide-react'

export function PhotoCarousel({ 
  images, 
  alt, 
  productId,
  isWishlisted: initialWishlisted = false
}: { 
  images: string[]
  alt: string
  productId: string
  isWishlisted?: boolean
}) {
  const [active, setActive] = useState(0)
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const scrollRef = useRef(null)
  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setActive(index)
  }


  function goTo(index: number) {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <div key={i} className="w-full shrink-0 snap-center">
            <div className="aspect-square w-full overflow-hidden bg-blush relative">
              <img src={src||'/placeholder.svg'} alt={`${alt} photo ${i+1}`} className="h-full w-full object-cover"/>
              {i === 0 && (
                <>
                  {/* Share button top right */}
                  <button className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
                    <Share2 className="w-4 h-4 text-foreground" />
                  </button>
                  {/* Wishlist bottom right */}
                  <button 
                    onClick={async () => {
                      const token = localStorage.getItem('token')
                      if (!token) {
                        window.location.href = '/login'
                        return
                      }
                      if (wishlisted) {
                        await fetch(`/api/wishlist/${productId}`, {
                          method: 'DELETE',
                          headers: { authorization: `Bearer ${token}` }
                        })
                        setWishlisted(false)
                      } else {
                        await fetch('/api/wishlist', {
                          method: 'POST',
                          headers: { 
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token}` 
                          },
                          body: JSON.stringify({ productId })
                        })
                        setWishlisted(true)
                      }
                    }}
                    className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full shadow-sm"
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-primary text-primary' : 'text-foreground'}`} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              active === i ? 'w-6 bg-primary' : 'w-2 bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
