'use client';

export default function EmptyWishlist() {
  return (
    <div className="pt-28 px-4 pb-32 flex flex-col items-center justify-center min-h-screen text-center">
      {/* Heart Icon Illustration */}
      <div className="mb-6">
        <svg className="w-16 h-16 mx-auto text-primary opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>

      {/* Empty State Message */}
      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
        Your wishlist is empty
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        Start adding your favorite handmade products to save them for later
      </p>

      {/* Explore Products Button */}
      <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:bg-opacity-90 transition-colors">
        Explore Products
      </button>
    </div>
  );
}
