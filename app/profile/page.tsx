'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Navbar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { LogOut, Edit, ChevronRight } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && !session) {
      router.push('/login')
      return
    }

    const headers: any = {}
    if (token) headers.authorization = `Bearer ${token}`

    fetch('/api/auth/me', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.error) return
        setUser(data)
      })

    fetch('/api/orders/my-orders', { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data.length)
      })

    fetch('/api/wishlist', { headers })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setWishlistCount(data.length)
      })
  }, [session])

  const handleLogout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    await signOut({ callbackUrl: '/login' })
  }

  const displayUser = user || session?.user

  if (!displayUser) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
              <span className="text-5xl font-heading text-primary-foreground">
                {displayUser.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{displayUser.name}</h1>
          <p className="text-muted-foreground text-sm">{displayUser.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 text-center border border-border">
            <div className="text-2xl font-bold text-primary mb-1">{orders}</div>
            <div className="text-xs text-muted-foreground font-medium">Total Orders</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center border border-border">
            <div className="text-2xl font-bold text-primary mb-1">{wishlistCount}</div>
            <div className="text-xs text-muted-foreground font-medium">Wishlist Items</div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {user?.phone && (
            <div className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">Phone Number</p>
                <p className="text-sm text-foreground font-medium mt-1">{user.phone}</p>
              </div>
              <button className="p-2 hover:bg-secondary rounded transition">
                <Edit size={18} className="text-primary" />
              </button>
            </div>
          )}
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground font-medium">Member Since</p>
            <p className="text-sm text-foreground font-medium mt-1">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'Recently joined'}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          {[
            { label: 'My Orders', href: '/orders' },
            { label: 'My Wishlist', href: '/wishlist' },
            { label: 'Edit Profile', href: '/edit-profile' },
            { label: 'Help & Support', href: '/support' },
          ].map((item) => (
            <a key={item.href} href={item.href} className="flex items-center justify-between px-4 py-3 bg-card rounded-lg border border-border hover:bg-secondary transition">
              <span className="text-foreground font-medium text-sm">{item.label}</span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </a>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-lg border-2 border-primary text-primary font-medium font-heading flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </main>
      <BottomNav />
    </div>
  )
}