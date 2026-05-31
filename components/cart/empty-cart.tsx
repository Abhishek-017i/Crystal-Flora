'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-50" />
      </div>
      
      <h2 className="text-2xl font-serif text-foreground mb-2 text-center">
        Your cart is empty
      </h2>
      
      <p className="text-sm text-muted-foreground mb-8 text-center">
        Explore our beautiful handcrafted collection
      </p>

      <Link
        href="/"
        className="text-primary-foreground px-8 py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity text-white"
        style={{ backgroundColor: '#d4869f' }}
      >
        Shop Now
      </Link>
    </div>
  );
}
