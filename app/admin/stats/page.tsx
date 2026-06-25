import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react'

export const metadata = {
  title: 'Analytics | Crystal Flora Admin',
  description: 'Analytics and statistics for Crystal Flora',
}

export default function StatsPage() {
  // Mock chart data
  const monthlyData = [
    { month: 'Jan', orders: 120, revenue: 245000 },
    { month: 'Feb', orders: 145, revenue: 298000 },
    { month: 'Mar', orders: 168, revenue: 342000 },
    { month: 'Apr', orders: 189, revenue: 385000 },
    { month: 'May', orders: 234, revenue: 478000 },
    { month: 'Jun', orders: 267, revenue: 545000 },
  ]

  const maxOrders = Math.max(...monthlyData.map((d) => d.orders))
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue))

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Business insights and statistics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-foreground mt-2">₹24.5L</p>
              <p className="text-xs text-green-600 font-semibold mt-3">↑ 18% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-foreground mt-2">1,284</p>
              <p className="text-xs text-green-600 font-semibold mt-3">↑ 12% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 text-accent border border-accent/20">
              <BarChart3 size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Avg Order Value</p>
              <p className="text-3xl font-bold text-foreground mt-2">₹19,077</p>
              <p className="text-xs text-green-600 font-semibold mt-3">↑ 8% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Active Users</p>
              <p className="text-3xl font-bold text-foreground mt-2">892</p>
              <p className="text-xs text-red-600 font-semibold mt-3">↓ 3% from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-accent/10 text-accent border border-accent/20">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Orders Over Time</h3>
          <div className="space-y-4">
            {monthlyData.map((data) => {
              const percentage = (data.orders / maxOrders) * 100
              return (
                <div key={data.month}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">{data.month}</span>
                    <span className="text-sm font-semibold text-foreground">{data.orders}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Over Time</h3>
          <div className="space-y-4">
            {monthlyData.map((data) => {
              const percentage = (data.revenue / maxRevenue) * 100
              return (
                <div key={data.month}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">{data.month}</span>
                    <span className="text-sm font-semibold text-foreground">
                      ₹{(data.revenue / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-accent h-full rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-6">Category Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Bracelets', sales: 245, revenue: '₹6.1L' },
            { name: 'Earrings', sales: 189, revenue: '₹3.6L' },
            { name: 'Necklaces', sales: 156, revenue: '₹4.2L' },
            { name: 'Rings', sales: 128, revenue: '₹10.2L' },
            { name: 'Pendants', sales: 95, revenue: '₹3.1L' },
            { name: 'Sets', sales: 76, revenue: '₹4.6L' },
          ].map((category) => (
            <div key={category.name} className="p-4 border border-border rounded-lg">
              <p className="font-semibold text-foreground">{category.name}</p>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Sales</span>
                  <span className="font-semibold text-foreground">{category.sales}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-semibold text-primary">{category.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-foreground mb-4">Conversion Rate</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">This Month</span>
              <span className="text-2xl font-bold text-primary">3.2%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1">
              <div className="bg-primary h-full rounded-full" style={{ width: '32%' }} />
            </div>
            <p className="text-xs text-green-600 font-semibold">↑ 0.5% improvement</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-foreground mb-4">Customer Satisfaction</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rating</span>
              <span className="text-2xl font-bold text-accent">4.8/5</span>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-2 rounded-full ${
                    i < 5 ? 'bg-accent' : 'bg-secondary'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-green-600 font-semibold">Based on 892 reviews</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h4 className="font-semibold text-foreground mb-4">Return Rate</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rate</span>
              <span className="text-2xl font-bold text-foreground">2.1%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '21%' }} />
            </div>
            <p className="text-xs text-green-600 font-semibold">↓ 0.3% reduction</p>
          </div>
        </div>
      </div>
    </div>
  )
}
