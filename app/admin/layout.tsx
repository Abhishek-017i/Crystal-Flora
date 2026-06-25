import { AdminNav } from '@/components/admin/admin-nav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background md:flex-row">
      <AdminNav />
      <main className="flex-1 pb-20 md:pb-0 md:ml-64">{children}</main>
    </div>
  )
}
