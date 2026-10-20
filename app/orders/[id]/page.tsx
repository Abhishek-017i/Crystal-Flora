'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  RotateCcw,
  MapPin,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/store'
import { Navbar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'

interface OrderProduct {
  id?: string
  name: string
  images: string[]
}

interface OrderItem {
  id: string
  productId: string
  quantity: number
  priceAtTime: number
  product: OrderProduct
}

interface OrderDetail {
  id: string
  totalAmount: number
  status: string
  addressLine: string
  city: string
  pincode: string
  createdAt: string
  user?: {
    name: string
    email: string
    phone?: string
  }
  items: OrderItem[]
}

const steps = [
  { key: 'pending', label: 'Placed', icon: Clock },
  { key: 'paid', label: 'Paid', icon: CheckCircle2 },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck },
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id as string
  const { addItem } = useCartStore()

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)

  useEffect(() => {
    if (!orderId) return
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to view order details')
      router.push(`/login?next=/orders/${orderId}`)
      return
    }

    fetch(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          setErrorStatus(res.status)
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) setOrder(data)
      })
      .catch(() => {
        setErrorStatus(500)
      })
      .finally(() => setLoading(false))
  }, [orderId, router])

  const handleReorder = () => {
    if (!order || !order.items) return
    let addedCount = 0
    for (const item of order.items) {
      addItem({
        id: item.productId,
        name: item.product?.name || 'Handcrafted Flora Item',
        price: item.priceAtTime,
        discountedPrice: item.priceAtTime,
        image: item.product?.images?.[0] || '/images/logo.png',
        quantity: item.quantity,
      })
      addedCount += item.quantity
    }
    toast.success(`Added ${addedCount} items back to your cart! 🛒`)
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (errorStatus || !order) {
    return (
      <div className="min-h-screen bg-stone-50 pb-28">
        <Navbar />
        <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h1 className="font-serif text-2xl font-bold text-stone-900">
            {errorStatus === 404 ? 'Order Not Found' : 'Access Restricted'}
          </h1>
          <p className="text-sm text-stone-500">
            {errorStatus === 404
              ? 'We could not find the requested order. Please verify your order ID.'
              : 'You do not have permission to view this order.'}
          </p>
          <Link
            href="/orders"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm"
          >
            Back to My Orders
          </Link>
        </main>
        <BottomNav />
      </div>
    )
  }

  // Determine active step index
  const statusLower = order.status.toLowerCase()
  let currentStepIdx = 0
  if (statusLower === 'paid') currentStepIdx = 1
  else if (statusLower === 'shipped') currentStepIdx = 2
  else if (statusLower === 'delivered') currentStepIdx = 3

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Back and Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/orders')}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                dateStyle: 'medium',
              })}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200 capitalize">
            {order.status}
          </span>
        </div>

        {/* Section 2: Horizontal Status Stepper */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
          <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-6">Order Status</h2>
          <div className="grid grid-cols-4 relative">
            {steps.map((s, idx) => {
              const isCompleted = idx <= currentStepIdx
              const isCurrent = idx === currentStepIdx
              const Icon = s.icon

              return (
                <div key={s.key} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    } ${isCurrent ? 'ring-4 ring-rose-100' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isCompleted ? 'text-stone-900 font-semibold' : 'text-stone-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 3: Ordered Items */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-semibold text-stone-900">Items Ordered</h2>
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="py-4 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <Image
                    src={item.product?.images?.[0] || '/images/logo.png'}
                    alt={item.product?.name || 'Product'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">
                    {item.product?.name || 'Handcrafted Flora'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Qty: {item.quantity} × ₹{item.priceAtTime.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-bold text-stone-900">
                  ₹{(item.quantity * item.priceAtTime).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Price Summary */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
          <h2 className="font-serif text-lg font-semibold text-stone-900">Payment Breakdown</h2>
          <div className="space-y-2 text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>
            <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-base text-stone-900">
              <span>Total Paid / Due</span>
              <span className="text-rose-600">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Shipping Address */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex items-start gap-3">
          <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-sm space-y-0.5">
            <h3 className="font-semibold text-stone-900">Delivery Address</h3>
            <p className="text-stone-600">{order.addressLine}</p>
            <p className="text-stone-600">
              {order.city}, PIN {order.pincode}
            </p>
          </div>
        </div>

        {/* Section 6: Action Button (Reorder) */}
        <button
          onClick={handleReorder}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reorder All Items
        </button>
      </main>

      <BottomNav />
    </div>
  )
}