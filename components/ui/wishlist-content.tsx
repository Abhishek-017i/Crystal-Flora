'use client';

import { useState } from 'react';
import ProductCard from './product-card';
import EmptyWishlist from './empty-wishlist';

interface WishlistItem {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  isNew: boolean;
  isOnSale: boolean;
}

interface WishlistContentProps {
  items: WishlistItem[];
  onRemove: (id: string) => void;
}

export default function WishlistContent({ items, onRemove }: WishlistContentProps) {
  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="pt-20 px-4 pb-4">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">My Wishlist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 items start">
        {items.map((item) => (
          <ProductCard 
            key={item.id}
            item={item}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
