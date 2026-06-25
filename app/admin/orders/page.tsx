'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { StatusBadge } from '@/components/admin/status-badge'

interface Order {
  id: string
  customer: string
  email: string
  product: string
  amount: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  date: string
  address: string
}

const initialOrders: Order[] = [
  {
    id: 'ORD-1001',
    customer: 'Priya Singh',
    email: 'priya@example.com',
    product: 'Crystal Bracelet',
    amount: 2499,
    status: 'delivered',
    date: '2026-05-31',
    address: 'Delhi, India',
  },
  {
    id: 'ORD-1002',
    customer: 'Ananya Patel',
    email: 'ananya@example.com',
    product: 'Emerald Necklace',
    amount: 4599,
    status: 'confirmed',
    date: '2026-05-30',
    address: 'Mumbai, India',
  },
  {
    id: 'ORD-1003',
    customer: 'Meera Sharma',
    email: 'meera@example.com',
    product: 'Pearl Earrings',
    amount: 1899,
    status: 'pending',
    date: '2026-05-29',
    address: 'Bangalore, India',
  },
  {
    id: 'ORD-1004',
    customer: 'Divya Kumar',
    email: 'divya@example.com',
    product: 'Diamond Ring',
    amount: 7999,
    status: 'delivered',
    date: '2026-05-28',
    address: 'Chennai, India',
  },
  {
    id: 'ORD-1005',
    customer: 'Sakshi Verma',
    email: 'sakshi@example.com',
    product: 'Crystal Jewelry Set',
    amount: 5999,
    status: 'cancelled',
    date: '2026-05-27',
    address: 'Hyderabad, India',
  },
  {
    id: 'ORD-1006',
    customer: 'Nisha Gupta',
    email: 'nisha@example.com',
    product: 'Amethyst Pendant',
    amount: 3299,
    status: 'confirmed',
    date: '2026-05-26',
    address: 'Pune, India',
  },
  {
    id: 'ORD-1007',
    customer: 'Kavya Iyer',
    email: 'kavya@example.com',
    product: 'Ruby Bracelet',
    amount: 3599,
    status: 'pending',
    date: '2026-05-25',
    address: 'Kolkata, India',
  },
  {
    id: 'ORD-1008',
    customer: 'Aisha Khan',
    email: 'aisha@example.com',
    product: 'Sapphire Ring',
    amount: 6299,
    status: 'delivered',
    date: '2026-05-24',
    address: 'Ahmedabad, India',
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'delivered' | 'cancelled'>('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || order.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage customer orders</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search by order ID, customer, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Order Header */}
            <button
              onClick={() =>
                setExpandedOrder(expandedOrder === order.id ? null : order.id)
              }
              className="w-full p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  <div className="font-semibold text-foreground">{order.id}</div>
                  <div className="text-sm text-muted-foreground">{order.customer}</div>
                  <div className="text-sm font-semibold text-foreground">₹{order.amount}</div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-2 sm:mt-0">
                  <div className="text-xs text-muted-foreground">{order.date}</div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <ChevronDown
                size={20}
                className={`transition-transform ${
                  expandedOrder === order.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Order Details */}
            {expandedOrder === order.id && (
              <div className="bg-secondary/30 border-t border-border p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Customer
                    </p>
                    <p className="text-foreground mt-1">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">{order.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Delivery Address
                    </p>
                    <p className="text-foreground mt-1">{order.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Product
                    </p>
                    <p className="text-foreground mt-1">{order.product}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Order Date
                    </p>
                    <p className="text-foreground mt-1">{order.date}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                  <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                    Update Status
                  </button>
                  <button className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                    Print Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="py-12 text-center bg-card border border-border rounded-lg">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-2xl font-bold text-foreground mt-2">{orders.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {orders.filter((o) => o.status === 'delivered').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-primary mt-2">
            ₹{orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
