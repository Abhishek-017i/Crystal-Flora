'use client'

import { useState } from 'react'
import { BadgeCheck, PenLine } from 'lucide-react'
import type { Review } from '@/lib/product-data'
import { StarRating } from './star-rating'

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-blush font-serif text-sm font-semibold text-primary">
            {review.username.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{review.username}</p>
            <StarRating rating={review.rating} size={14} />
          </div>
        </div>
        {review.verified && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-save/10 px-2 py-1 text-[11px] font-medium text-save">
            <BadgeCheck size={12} />
            Verified
          </span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
    </div>
  )
}

function RatingBars({ reviews }: { reviews: Review[] }) {
  const total = reviews.length
  const counts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => Math.round(r.rating) === star).length,
  )

  return (
    <div className="flex flex-col gap-2">
      {[5, 4, 3, 2, 1].map((star, idx) => {
        const pct = total ? (counts[idx] / total) * 100 : 0
        return (
          <div key={star} className="flex items-center gap-2">
            <span className="w-3 text-xs text-muted-foreground">{star}</span>
            <StarRating rating={1} size={12} />
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-blush">
              <div className="h-full rounded-full bg-rosegold" style={{ width: `${pct}%` }} />
            </div>
            <span className="w-6 text-right text-xs text-muted-foreground">{counts[idx]}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ReviewsSection({
  reviews,
  averageRating,
}: {
  reviews: Review[]
  averageRating: number
}) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? reviews : reviews.slice(0, 4)

  return (
    <section id="reviews" className="scroll-mt-20 px-4 py-6">
      <h2 className="font-serif text-2xl font-bold text-foreground">Customer Reviews</h2>

      <div className="mt-4 flex items-center gap-5 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col items-center">
          <span className="font-serif text-4xl font-bold text-foreground">
            {averageRating.toFixed(1)}
          </span>
          <StarRating rating={averageRating} size={14} />
          <span className="mt-1 text-xs text-muted-foreground">{reviews.length} reviews</span>
        </div>
        <div className="flex-1">
          <RatingBars reviews={reviews} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {visible.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviews.length > 4 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 w-full rounded-full border border-rosegold/50 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-blush"
        >
          {expanded ? 'Show Less' : `Read More (${reviews.length - 4})`}
        </button>
      )}

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:opacity-90"
      >
        <PenLine size={16} />
        Write a Review
      </button>
    </section>
  )
}
