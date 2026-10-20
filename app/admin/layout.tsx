'use client'

import { AdminNav } from '@/components/admin/admin-nav'
import { useAuth } from '@/lib/useAuth'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth({
    requireAuth: true,
    requireAdmin: true,
    redirectTo: '/login',
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <AdminNav />
      <main className="flex-1 pb-20 md:pb-0 md:ml-64">{children}</main>
    </div>
  )
}
