'use client';

import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  name,
  price,
  originalPrice,
  image,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const handleIncrease = () => {
    onUpdateQuantity(id, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity === 1) {
      onRemove(id);
    } else {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      <div className="relative h-24 w-24 flex-shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-semibold" style={{ color: '#d4869f' }}>₹{price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-xs line-through text-muted-foreground">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1">
            <button
              onClick={handleDecrease}
              className="hover:opacity-70 transition-opacity"
              style={{ color: '#d4869f' }}
              aria-label="Decrease quantity"
            >
              {quantity === 1 ? (
                <Trash2 className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
            </button>
            <span className="text-sm font-medium text-foreground min-w-[1.5rem] text-center">
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="hover:opacity-70 transition-opacity"
              style={{ color: '#d4869f' }}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onRemove(id)}
            className="hover:opacity-70 transition-opacity"
            style={{ color: '#d4869f' }}
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
