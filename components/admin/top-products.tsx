interface Product {
  id: string
  name: string
  sales: number
  revenue: number
  image?: string
}

interface TopProductsProps {
  products: Product[]
}

export function TopProducts({ products }: TopProductsProps) {
  const maxRevenue = Math.max(...products.map((p) => p.revenue))

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">Top Products</h3>
      <div className="space-y-4">
        {products.map((product) => {
          const percentage = (product.revenue / maxRevenue) * 100
          return (
            <div key={product.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                </div>
                <p className="font-semibold text-primary">₹{product.revenue.toLocaleString()}</p>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
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
  )
}
