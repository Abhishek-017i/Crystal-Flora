'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  ShoppingBag,
  Store,
  AlertTriangle,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import {
  fetchStats,
  fetchSellerAnalytics,
  fetchVelocity,
  fetchCategoryAnalytics,
  StatsResponse,
  SellerAnalytics,
  VelocityRow,
  CategoryAnalytics,
} from '@/lib/analytics'

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [sellers, setSellers] = useState<SellerAnalytics[]>([])
  const [velocity, setVelocity] = useState<VelocityRow[]>([])
  const [categories, setCategories] = useState<CategoryAnalytics[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAllAnalytics = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [statsData, sellersData, velocityData, categoriesData] = await Promise.all([
        fetchStats(),
        fetchSellerAnalytics(),
        fetchVelocity(),
        fetchCategoryAnalytics(),
      ])

      setStats(statsData)
      setSellers(sellersData)
      setVelocity(velocityData)
      setCategories(categoriesData)
    } catch (err: any) {
      setError(err?.message || 'Failed to load database analytics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAllAnalytics()
  }, [])


  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Database Analytics & SQL Views</h1>
          <p className="text-muted-foreground mt-1">
            Aggregations powered by PostgreSQL views <code>v_seller_revenue</code> and{' '}
            <code>v_product_velocity</code>
          </p>
        </div>
        <button
          onClick={loadAllAnalytics}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {isLoading ? (
        <div className="bg-card border border-border rounded-xl p-16 flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p>Querying SQL analytical views...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center text-destructive flex flex-col items-center gap-2">
          <AlertCircle className="w-8 h-8" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stats?.totalOrders || 0}
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {stats?.pendingOrders || 0} pending
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <ShoppingBag size={20} />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Active Sellers
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stats?.sellerCount || sellers.length || 0}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <Store size={20} />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Low Stock Alerts
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stats?.lowStockCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Items with stock &lt; 5</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <AlertTriangle size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Table 1: Seller Revenue Analytics */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Table 1: Seller Revenue Performance (v_seller_revenue)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  SQL multi-table JOIN + GROUP BY view aggregating orders, units, and GMV
                </p>
              </div>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                {sellers.length} sellers
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Seller Name</th>
                    <th className="px-6 py-3.5 text-center">Total Orders</th>
                    <th className="px-6 py-3.5 text-center">Units Sold</th>
                    <th className="px-6 py-3.5 text-right">Total Revenue (₹)</th>
                    <th className="px-6 py-3.5 text-right">Revenue Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sellers.map((s) => {
                    const totalGmv = sellers.reduce((sum, item) => sum + Number(item.totalRevenue), 0)
                    const share = totalGmv > 0 ? ((Number(s.totalRevenue) / totalGmv) * 100).toFixed(1) : '0'
                    return (
                      <tr key={s.sellerId} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {s.sellerName}
                        </td>
                        <td className="px-6 py-4 text-center font-medium">{s.totalOrders}</td>
                        <td className="px-6 py-4 text-center font-medium">{s.totalUnitsSold}</td>
                        <td className="px-6 py-4 text-right font-bold text-rose-600 dark:text-rose-400">
                          ₹{Number(s.totalRevenue).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground font-mono text-xs">
                          {share}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: Product Velocity & Sales Performance */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Table 2: Product Velocity & Sales Ranking (v_product_velocity)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  SQL ranking sorted by total revenue DESC with live stock indicators
                </p>
              </div>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                Top {velocity.length} products
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Product Name</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Seller</th>
                    <th className="px-6 py-3.5 text-center">Unit Price</th>
                    <th className="px-6 py-3.5 text-center">Stock</th>
                    <th className="px-6 py-3.5 text-center">Units Sold</th>
                    <th className="px-6 py-3.5 text-right">Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {velocity.map((v) => (
                    <tr key={v.productId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {v.productName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-muted text-xs">
                          {v.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">{v.sellerName}</td>
                      <td className="px-6 py-4 text-center font-medium">₹{v.price}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`font-semibold text-xs px-2 py-0.5 rounded-full ${
                            v.currentStock === 0
                              ? 'bg-rose-100 text-rose-800'
                              : v.currentStock < 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          {v.currentStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-foreground">
                        {v.unitsSold}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">
                        ₹{Number(v.revenue).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 3: Category Breakdown */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Table 3: Category Performance Breakdown
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Aggregate sales, product counts, and gross volume per category
                </p>
              </div>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                {categories.length} categories
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5 text-center">Active Products</th>
                    <th className="px-6 py-3.5 text-center">Total Units Sold</th>
                    <th className="px-6 py-3.5 text-right">Total Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((c) => (
                    <tr key={c.categoryId} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{c.categoryName}</td>
                      <td className="px-6 py-4 text-center font-medium">{c.productCount}</td>
                      <td className="px-6 py-4 text-center font-semibold">{c.totalUnitsSold}</td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600 dark:text-rose-400">
                        ₹{Number(c.totalRevenue).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
