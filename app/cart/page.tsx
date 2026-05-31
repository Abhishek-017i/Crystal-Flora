'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { CartItem } from '@/components/cart/cart-item';
import { OrderSummary } from '@/components/cart/order-summary';
import { EmptyCart } from '@/components/cart/empty-cart';
import { BottomNav } from '@/components/cart/bottom-nav';
import { useCartStore } from '@/lib/store'

interface CartProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, total: cartTotal } = useCartStore()

const handleUpdateQuantity = (id: string, quantity: number) => {
  if (quantity === 0) {
    removeItem(id)
  } else {
    updateQuantity(id, quantity)
  }
}

const handleRemoveItem = (id: string) => {
  removeItem(id)
}

const isEmpty = items.length === 0

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="hover:opacity-70 transition-opacity"
            style={{ color: '#d4869f' }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-serif font-bold text-foreground">My Cart</h1>

          <div className="w-6" />
        </div>
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <>
          {/* Cart Items */}
          <div className="px-4 py-6">
            <div className="bg-card rounded-lg border border-border divide-y divide-border">
              {items.map(item => (
                <CartItem
                  key={item.id}
                  {...item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="fixed bottom-24 left-0 right-0 px-4 pb-4 bg-background">
            <OrderSummary subtotal={cartTotal()} total={cartTotal()} />

            <button 
              className="w-full mt-4 text-primary-foreground py-3 rounded-full font-medium text-sm hover:opacity-90 transition-opacity text-white"
              style={{ backgroundColor: '#d4869f' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <BottomNav active="cart" />
    </div>
  );
}
