import { Navbar } from '@/components/ui/navbar'
import { BottomNav } from '@/components/ui/bottom-nav'
import { LogOut, Edit, ChevronRight } from 'lucide-react'

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: 'Sarah Anderson',
    email: 'sarah.anderson@email.com',
    phone: '+91 98765 43210',
    address: '123 Floral Street, Garden District, Mumbai 400001, India',
    memberSince: 'March 2024',
    orders: 12,
    wishlistItems: 8,
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Profile Header Section */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
              <span className="text-5xl font-heading text-primary-foreground">S</span>
            </div>
          </div>

          {/* User Info */}
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            {user.name}
          </h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 text-center border border-border">
            <div className="text-2xl font-bold text-primary mb-1">{user.orders}</div>
            <div className="text-xs text-muted-foreground font-medium">Total Orders</div>
          </div>
          <div className="bg-card rounded-lg p-4 text-center border border-border">
            <div className="text-2xl font-bold text-primary mb-1">{user.wishlistItems}</div>
            <div className="text-xs text-muted-foreground font-medium">Wishlist Items</div>
          </div>
        </div>

        {/* Info Cards Section */}
        <div className="space-y-3 mb-8">
          {/* Phone Card */}
          <div className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Phone Number</p>
              <p className="text-sm text-foreground font-medium mt-1">{user.phone}</p>
            </div>
            <button className="p-2 hover:bg-secondary rounded transition">
              <Edit size={18} className="text-primary" />
            </button>
          </div>

          {/* Address Card */}
          <div className="bg-card rounded-lg p-4 border border-border flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">Current Address</p>
              <p className="text-sm text-foreground font-medium mt-1">{user.address}</p>
            </div>
            <button className="p-2 hover:bg-secondary rounded transition flex-shrink-0">
              <Edit size={18} className="text-primary" />
            </button>
          </div>

          {/* Member Since Card */}
          <div className="bg-card rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground font-medium">Member Since</p>
            <p className="text-sm text-foreground font-medium mt-1">{user.memberSince}</p>
          </div>
        </div>

        {/* Menu List Section */}
        <div className="space-y-2 mb-8">
          {[
            { label: 'My Orders', href: '/orders' },
            { label: 'My Wishlist', href: '/wishlist' },
            { label: 'Edit Profile', href: '/edit-profile' },
            { label: 'Help & Support', href: '/support' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-4 py-3 bg-card rounded-lg border border-border hover:bg-secondary transition"
            >
              <span className="text-foreground font-medium text-sm">{item.label}</span>
              <ChevronRight size={18} className="text-muted-foreground" />
            </a>
          ))}
        </div>

        {/* Logout Button */}
        <button className="w-full py-3 px-4 rounded-lg border-2 border-primary text-primary font-medium font-heading flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition">
          <LogOut size={18} />
          Logout
        </button>
      </main>

      <BottomNav />
    </div>
  )
}
