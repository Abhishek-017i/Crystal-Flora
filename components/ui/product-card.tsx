'use client';

import Image from 'next/image';
import { useCartStore } from '@/lib/store'

interface ProductCardProps {
  item: {
    id: number;
    name: string;
    originalPrice: number;
    discountedPrice: number;
    image: string;
    isNew: boolean;
    isOnSale: boolean;
  };
  onRemove: (id: string) => void;
}

export default function ProductCard({ item, onRemove }: ProductCardProps) {
  return (
    <div className="flex flex-col">
      {/* Image Container */}
      <div className="relative mb-3 aspect-square overflow-hidden bg-secondary rounded-xl">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover w-full h-full"
        />

        {/* Badge */}
        {(item.isNew || item.isOnSale) && (
          <div className="absolute top-3 left-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
              item.isNew ? 'bg-green-600' : 'bg-primary'
            }`}>
              {item.isNew ? 'NEW' : 'SALE'}
            </span>
          </div>
        )}

        {/* Remove from Wishlist Button */}
        <button
          onClick={() => onRemove(String(item.id))}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Remove from wishlist"
        >
          <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">
        {item.name}
      </h3>

      {/* Pricing */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-muted-foreground line-through">
          ₹{item.originalPrice.toLocaleString('en-IN')}
        </span>
        <span className="text-sm font-bold text-primary">
          ₹{item.discountedPrice.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Add to Cart Button */}
      <button 
        onClick={() => {
          useCartStore.getState().addItem({
            id: String(item.id),
            name: item.name,
            price: item.originalPrice,
            discountedPrice: item.discountedPrice,
            image: item.image,
            quantity: 1
          })
        }}
      className="mt-auto w-full bg-primary text-white py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Add to Cart
      </button>
    </div>
  );
}
