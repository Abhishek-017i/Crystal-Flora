import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  discountedPrice: number | null
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(i => i.id === item.id)
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          }))
        } else {
          set(state => ({ items: [...state.items, { ...item, quantity: 1 }] }))
        }
      },

      removeItem: (id) =>
        set(state => ({ items: state.items.filter(i => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set(state => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity } : i
          )
        })),

      clearCart: () => set({ items: [] }),

      total: () => {
        const items = get().items
        return items.reduce((sum, item) => {
          const price = item.discountedPrice ?? item.price
          return sum + price * item.quantity
        }, 0)
      }
    }),
    { name: 'cart-storage' }
  )
)

interface WishlistStore {
  items: string[] // array of productIds
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isWishlisted: (productId: string) => boolean
  setItems: (productIds: string[]) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => set(state => ({ 
        items: [...state.items, productId] 
      })),
      removeItem: (productId) => set(state => ({ 
        items: state.items.filter(id => id !== productId) 
      })),
      isWishlisted: (productId) => get().items.includes(productId),
      setItems: (productIds) => set({ items: productIds })
    }),
    { name: 'wishlist-storage' }
  )
)