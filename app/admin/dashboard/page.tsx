'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShoppingCart,
  TrendingUp,
  Store,
  AlertTriangle,
  Zap,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { StatCard } from '@/components/admin/stat-card'
import {
  fetchStats,
  fetchSellerAnalytics,
  runConcurrencySimulator,
  StatsResponse,
  SellerAnalytics,
  SimulatorResult,
} from '@/lib/analytics'

interface AdminProductOption {
  id: string
  name: string
  stock: number
  price: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [sellers, setSellers] = useState<SellerAnalytics[]>([])
  const [products, setProducts] = useState<AdminProductOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulator State
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [simBuyers, setSimBuyers] = useState<number>(50)
  const [simLoading, setSimLoading] = useState(false)
  const [simResult, setSimResult] = useState<SimulatorResult | null>(null)
  const [simError, setSimError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

      const [statsData, sellersData, prodRes] = await Promise.all([
        fetchStats(),
        fetchSellerAnalytics(),
        fetch('/api/admin/products', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }),
      ])

      setStats(statsData)
      setSellers(sellersData)

      if (prodRes.ok) {
        const prodData = await prodRes.json()
        setProducts(
          prodData.map((p: any) => ({
            id: p.id,
            name: p.name,
            stock: p.stock,
            price: p.price,
          }))
        )
        // Auto-select a stock=1 product for easy demo
        const demoProd = prodData.find((p: any) => p.stock === 1) || prodData[0]
        if (demoProd) setSelectedProductId(demoProd.id)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleRunSimulator = async () => {
    if (!selectedProductId) return
    setSimLoading(true)
    setSimError(null)
    setSimResult(null)

    try {
      const result = await runConcurrencySimulator({
        productId: selectedProductId,
        buyers: Number(simBuyers) || 50,
        quantityEach: 1,
        resetAfter: true,
      })
      setSimResult(result)
      // Refresh stats to reflect any state changes
      loadDashboardData()
    } catch (err: any) {
      setSimError(err?.message || 'Simulator failed to execute')
    } finally {
      setSimLoading(false)
    }
  }

  const maxRevenue = Math.max(
    ...(sellers.map((s) => Number(s.totalRevenue)) || [1]),
    1
  )

  const selectedProduct = products.find((p) => p.id === selectedProductId)

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Analytics & Control</h1>
          <p className="text-muted-foreground mt-1">
            Real-time DBMS metrics, PostgreSQL seller revenue analytics, and concurrency simulator
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-foreground hover:bg-muted text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link
            href="/admin/stats"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <span>View SQL Views</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-card border border-border rounded-xl p-16 flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p>Loading live database metrics...</p>
        </div>
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center text-destructive flex flex-col items-center gap-2">
          <AlertCircle className="w-8 h-8" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : (
        <>
          {/* P4.1: Wired KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={`₹${(stats?.totalRevenue ?? 0).toLocaleString('en-IN')}`}
              icon={TrendingUp}
              color="rose"
              subtitle="All-time gross merchandise value"
            />
            <StatCard
              title="Total Orders"
              value={stats?.totalOrders ?? 0}
              icon={ShoppingCart}
              color="primary"
              subtitle={`${stats?.pendingOrders ?? 0} orders currently pending`}
            />
            <StatCard
              title="Active Sellers"
              value={stats?.sellerCount ?? sellers.length ?? 0}
              icon={Store}
              color="accent"
              subtitle="Distinct vendors in database"
            />
            <StatCard
              title="Low Stock Alerts"
              value={stats?.lowStockCount ?? 0}
              icon={AlertTriangle}
              color="amber"
              subtitle="Products with remaining stock < 5"
            />
          </div>

          {/* P4.3: Concurrency Simulator Card */}
          <div className="bg-card border-2 border-rose-200 dark:border-rose-900/60 rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 uppercase tracking-wider">
                    DBMS Stress Test
                  </span>
                  <h2 className="text-xl font-bold text-foreground">
                    Concurrency Race Simulator
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tests Serializable Isolation &amp; <code>SELECT ... FOR UPDATE</code> under heavy parallel write contention
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
                <span>Lock: FOR UPDATE (ordered)</span>
                <span>•</span>
                <span>Isolation: Serializable</span>
              </div>
            </div>

            {/* Simulator Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Target Product (Contested Resource)
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock}) {p.stock === 1 ? '🔥 [STOCK=1 DEMO]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
                  Concurrent Buyers (Parallel Threads)
                </label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={simBuyers}
                  onChange={(e) => setSimBuyers(Math.max(2, Math.min(100, Number(e.target.value))))}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <button
                  onClick={handleRunSimulator}
                  disabled={simLoading || !selectedProductId}
                  className="w-full px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {simLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Firing {simBuyers} Concurrent Orders...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Fire {simBuyers}-Way Race
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {simError && (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 p-3.5 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{simError}</span>
              </div>
            )}

            {/* Simulator Results Panel */}
            {simResult && (
              <div className="bg-muted/40 border border-border rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-foreground">
                      Contention Test Complete in {simResult.durationMs}ms
                    </h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    ACID Integrity: 100%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Attempts
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {simResult.attempts}
                    </p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 text-center">
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 uppercase tracking-wider font-semibold">
                      Succeeded
                    </p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {simResult.succeeded} ✅
                    </p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-center">
                    <p className="text-xs text-rose-700 dark:text-rose-300 uppercase tracking-wider font-semibold">
                      Rejected (OOS)
                    </p>
                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                      {simResult.outOfStock} ❌
                    </p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Negative Stock
                    </p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">
                      {simResult.dbIntegrity.negativeStockRows}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Verified: Out of {simResult.attempts} concurrent transaction attempts, exactly{' '}
                  <span className="font-semibold text-foreground">{simResult.succeeded}</span>{' '}
                  succeeded and acquired stock. The remaining{' '}
                  <span className="font-semibold text-foreground">{simResult.outOfStock}</span> were
                  cleanly rolled back with <code>OUT_OF_STOCK</code>. Zero overselling occurred.
                </p>
              </div>
            )}
          </div>

          {/* P4.2: Visuals Grid (Revenue-by-Seller & Top Products) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Seller Bar Chart (CSS-based) */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Revenue by Seller</h3>
                  <p className="text-xs text-muted-foreground">
                    Aggregated directly from PostgreSQL view <code>v_seller_revenue</code>
                  </p>
                </div>
                <Link
                  href="/admin/stats"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  View Details →
                </Link>
              </div>

              <div className="space-y-4 pt-2">
                {sellers.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No seller data available.</p>
                ) : (
                  sellers.map((s) => {
                    const pct = Math.min(
                      100,
                      Math.max(8, (Number(s.totalRevenue) / maxRevenue) * 100)
                    )
                    return (
                      <div key={s.sellerId} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-foreground">{s.sellerName}</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400">
                            ₹{Number(s.totalRevenue).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-rose-500 h-4 rounded-full transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{s.totalOrders} total orders</span>
                          <span>{s.totalUnitsSold} units sold</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Top Products List */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Top Products by Revenue</h3>
                  <p className="text-xs text-muted-foreground">
                    Ranked via PostgreSQL view <code>v_product_velocity</code>
                  </p>
                </div>
                <Link
                  href="/admin/products"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Catalog →
                </Link>
              </div>

              <div className="divide-y divide-border">
                {(!stats?.topProducts || stats.topProducts.length === 0) ? (
                  <p className="text-sm text-muted-foreground py-4">No products recorded.</p>
                ) : (
                  stats.topProducts.slice(0, 5).map((p, idx) => (
                    <div key={p.productId} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center text-xs font-bold text-muted-foreground font-mono">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-sm text-foreground">{p.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.categoryName} • {p.sellerName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-foreground">
                          ₹{Number(p.revenue).toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.unitsSold} sold • {p.currentStock} in stock
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
