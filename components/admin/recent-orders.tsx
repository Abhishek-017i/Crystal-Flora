import { StatusBadge } from './status-badge'

interface Order {
  id: string
  customer: string
  product: string
  amount: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  date: string
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6">Recent Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Order ID</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Product</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                <td className="py-4 px-4 font-medium text-foreground">#{order.id}</td>
                <td className="py-4 px-4 text-foreground">{order.customer}</td>
                <td className="py-4 px-4 text-foreground">{order.product}</td>
                <td className="py-4 px-4 font-semibold text-foreground">₹{order.amount}</td>
                <td className="py-4 px-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-4 px-4 text-muted-foreground text-xs">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
