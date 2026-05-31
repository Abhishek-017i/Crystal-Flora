'use client';

import Link from 'next/link';
import { ShoppingCart, Package, Grid3x3, Heart, User, Home } from 'lucide-react';

interface BottomNavProps {
  active?: 'home' | 'orders' | 'categories' | 'wishlist' | 'profile' | 'cart';
}

export function BottomNav({ active = 'home' }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'orders', label: 'Orders', icon: Package, href: '/orders' },
    { id: 'categories', label: 'Categories', icon: Grid3x3, href: '/categories' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/wishlist' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-4 min-w-max transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={isActive ? { color: '#d4869f' } : undefined}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
