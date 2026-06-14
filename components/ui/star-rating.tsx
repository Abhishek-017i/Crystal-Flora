import { Star } from 'lucide-react'

export function StarRating({
  rating,
  size = 16,
  className = '',
}: {
  rating: number
  size?: number
  className?: string
}) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i))
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="absolute inset-0 text-rosegold/40" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star size={size} className="text-rosegold" fill="currentColor" />
            </span>
          </span>
        )
      })}
    </div>
  )
}
