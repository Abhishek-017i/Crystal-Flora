'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Package, ChevronRight, ShoppingBag, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { useAuth } from '@/lib/useAuth'

interface OrderItem {
  id: string
  quantity: number
  priceAtTime: number
  product: {
    id: string
    name: string
    images: string[]
  }
}

interface Order {
  id: string
  totalAmount: number
  status: string
  addressLine: string
  city: string
  pincode: string
  createdAt: string
  items: OrderItem[]
}

const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  paid: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  shipped: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  delivered: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  cancelled: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' },
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth({
    requireAuth: true,
    redirectTo: '/login?next=/orders',
  })
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !user) return

    const token = localStorage.getItem('token')
    fetch('/api/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          toast.error('Session expired. Please login.')
          router.push('/login?next=/orders')
          return []
        }
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data)
        }
      })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [router])

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <h1 className="font-serif text-2xl font-bold text-stone-900">My Orders</h1>
          </div>
          {!loading && (
            <span className="bg-stone-200 text-stone-800 text-xs font-semibold px-3 py-1 rounded-full">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </span>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-32 bg-stone-200 rounded" />
                  <div className="h-4 w-20 bg-stone-200 rounded" />
                </div>
                <div className="h-12 w-full bg-stone-100 rounded-xl" />
                <div className="h-4 w-24 bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              🌸
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900">No orders yet</h2>
            <p className="text-sm text-stone-500 max-w-sm mx-auto">
              You haven&apos;t placed any handcrafted orders yet. Explore our blooming collection!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </div>
        )}

        {/* Order Cards List */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusStyle = statusColorMap[order.status.toLowerCase()] || statusColorMap.pending
              const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
              const firstItem = order.items[0]

              return (
                <div
                  key={order.id}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <p className="text-xs font-mono font-semibold text-stone-500">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} capitalize`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Items Preview */}
                  <div className="py-4 flex items-center gap-4">
                    {firstItem && (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <Image
                          src={firstItem.product?.images?.[0] || '/images/logo.png'}
                          alt={firstItem.product?.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-900 truncate">
                        {firstItem?.product?.name || 'Order Items'}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                        {order.items.length > 1 && ` (+${order.items.length - 1} other items)`}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-stone-900">₹{order.totalAmount.toFixed(2)}</p>
                      <span className="text-xs text-rose-600 group-hover:underline flex items-center gap-0.5 justify-end mt-1">
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
