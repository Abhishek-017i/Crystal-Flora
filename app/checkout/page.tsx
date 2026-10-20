'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { useCartStore } from '@/lib/store'
import { Navbar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, total } = useCartStore()

  const [formData, setFormData] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    pincode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to proceed to checkout')
      router.push('/login?next=/checkout')
      return
    }

    if (items.length === 0) {
      toast.error('Your cart is empty')
      router.push('/cart')
      return
    }

    // Prefill user details if available
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setFormData({
            fullName: data.name || '',
            addressLine: data.addressLine || '',
            city: data.city || '',
            pincode: data.pincode || '',
          })
        }
      })
      .catch(() => {})
      .finally(() => setInitialLoading(false))
  }, [items.length, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.addressLine.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      toast.error('Please fill in all shipping address fields')
      return
    }

    if (!/^[0-9]{6}$/.test(formData.pincode.trim())) {
      toast.error('Pincode must be exactly 6 digits')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Session expired. Please log in again.')
      router.push('/login?next=/checkout')
      return
    }

    setLoading(true)
    try {
      const orderItems = items.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
      }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          addressLine: formData.addressLine.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        }),
      })

      const data = await res.json()

      if (res.status === 401) {
        toast.error('Unauthorized. Please login.')
        router.push('/login?next=/checkout')
        return
      }

      if (res.status === 400 && data.error === 'OUT_OF_STOCK') {
        toast.error('One or more items in your cart are out of stock!')
        router.push('/cart')
        return
      }

      if (!res.ok) {
        toast.error(data.error || 'Failed to place order. Please try again.')
        return
      }

      // Success
      clearCart()
      toast.success('Order placed successfully! 🎉')
      router.push(`/orders/${data.id}`)
    } catch {
      toast.error('Network error. Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const cartTotal = total()

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back and Title */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h1 className="font-serif text-2xl font-bold text-stone-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Address Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-stone-900">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Recipient's Name"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">Address Line</label>
                  <input
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Street, Landmark"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Pincode (6 digits)</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="e.g. 395007"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-lg font-semibold text-stone-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold text-stone-900">Cash on Delivery (COD)</p>
                      <p className="text-xs text-stone-500">Pay cash upon home delivery</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      disabled
                      className="w-4 h-4 text-stone-400"
                    />
                    <div>
                      <p className="text-sm font-medium text-stone-700">Online Payment</p>
                      <p className="text-xs text-stone-500">UPI / Cards / NetBanking (Coming Soon)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                    Disabled
                  </span>
                </label>
              </div>
            </div>

            {/* Shipping Policy Note */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800">
              <Truck className="w-5 h-5 shrink-0" />
              <p className="text-xs font-medium">
                Free standard delivery across India on all handcrafted orders! Delivery in 5–7 business days.
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 sticky top-24 space-y-5">
              <h2 className="font-serif text-lg font-semibold text-stone-900">Order Summary</h2>

              {/* Items List */}
              <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <Image
                        src={item.image || '/images/logo.png'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">{item.name}</p>
                      <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-stone-900">
                      ₹{((item.discountedPrice ?? item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Totals */}
              <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-base text-stone-900">
                  <span>Total Amount</span>
                  <span className="text-rose-600">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Concurrency-Safe Order...
                  </>
                ) : (
                  `Place Order • ₹${cartTotal.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  )
}
