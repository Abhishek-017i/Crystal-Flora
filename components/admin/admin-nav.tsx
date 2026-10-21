'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Package,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/stats', icon: BarChart3, label: 'Analytics' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin' || pathname === '/admin/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
    try {
      await signOut({ redirect: false })
    } catch {
      // ignore if NextAuth session does not exist
    }
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-40">
        <Link href="/admin/dashboard" className="font-serif text-xl font-bold text-primary">
          CF Admin
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-lg transition-colors"
          >
            <LogOut size={20} />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-secondary rounded-lg"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="fixed top-16 left-0 right-0 bg-card border-b border-border md:hidden z-40">
          <div className="flex flex-col">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-border transition-colors ${
                    active
                      ? 'bg-secondary text-primary font-semibold'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <button
              onClick={() => {
                setIsOpen(false)
                handleLogout()
              }}
              className="flex items-center gap-3 px-4 py-3 border-b border-border text-destructive hover:bg-destructive/10 transition-colors text-left"
            >
              <LogOut size={20} />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </nav>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:flex-col md:bg-card md:border-r md:border-border md:pt-6 md:z-40">
        <Link href="/admin/dashboard" className="px-6 pb-8 font-serif text-2xl font-bold text-primary">
          CF Admin
        </Link>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          <div className="px-4 py-3 rounded-lg bg-secondary text-center">
            <p className="text-sm text-muted-foreground">Crystal Flora Admin</p>
            <p className="text-xs text-muted-foreground mt-1">v1.0</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-3 flex-1 transition-colors ${
                  active
                    ? 'text-primary border-t-2 border-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-4 py-3 flex-1 transition-colors text-muted-foreground hover:text-destructive"
          >
            <LogOut size={24} />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </nav>
    </>
  )
}
