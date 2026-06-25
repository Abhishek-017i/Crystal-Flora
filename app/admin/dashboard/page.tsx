import { StatsCard } from '@/components/admin/stats-card'
import { RecentOrders } from '@/components/admin/recent-orders'
import { TopProducts } from '@/components/admin/top-products'
import {
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
} from 'lucide-react'

// Mock data
const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'Priya Singh',
    product: 'Crystal Bracelet',
    amount: 2499,
    status: 'delivered' as const,
    date: '2026-05-31',
  },
  {
    id: 'ORD-002',
    customer: 'Ananya Patel',
    product: 'Emerald Necklace',
    amount: 4599,
    status: 'confirmed' as const,
    date: '2026-05-30',
  },
  {
    id: 'ORD-003',
    customer: 'Meera Sharma',
    product: 'Pearl Earrings',
    amount: 1899,
    status: 'pending' as const,
    date: '2026-05-29',
  },
  {
    id: 'ORD-004',
    customer: 'Divya Kumar',
    product: 'Diamond Ring',
    amount: 7999,
    status: 'delivered' as const,
    date: '2026-05-28',
  },
  {
    id: 'ORD-005',
    customer: 'Sakshi Verma',
    product: 'Crystal Jewelry Set',
    amount: 5999,
    status: 'cancelled' as const,
    date: '2026-05-27',
  },
]

const topProducts = [
  {
    id: 'PROD-001',
    name: 'Crystal Bracelet',
    sales: 245,
    revenue: 612255,
  },
  {
    id: 'PROD-002',
    name: 'Pearl Earrings',
    sales: 189,
    revenue: 358611,
  },
  {
    id: 'PROD-003',
    name: 'Diamond Ring',
    sales: 128,
    revenue: 1023872,
  },
  {
    id: 'PROD-004',
    name: 'Emerald Necklace',
    sales: 95,
    revenue: 436905,
  },
  {
    id: 'PROD-005',
    name: 'Crystal Jewelry Set',
    sales: 76,
    revenue: 455924,
  },
]

export const metadata = {
  title: 'Dashboard | Crystal Flora Admin',
  description: 'Crystal Flora Admin Dashboard',
}

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome to Crystal Flora Admin Portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Orders"
          value="1,284"
          icon={ShoppingCart}
          trend={{ value: 12, isPositive: true }}
          color="primary"
        />
        <StatsCard
          title="Total Customers"
          value="892"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          color="accent"
        />
        <StatsCard
          title="Total Revenue"
          value="₹24.5L"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
          color="primary"
        />
        <StatsCard
          title="Products"
          value="156"
          icon={Package}
          trend={{ value: 3, isPositive: false }}
          color="secondary"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button className="bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-sm">
          + Add New Product
        </button>
        <button className="bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-sm">
          View All Orders
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>
        <div>
          <TopProducts products={topProducts} />
        </div>
      </div>
    </div>
  )
}

