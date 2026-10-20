export interface VelocityRow {
  productId: string
  productName: string
  categoryName: string
  sellerName: string
  currentStock: number
  price: number
  unitsSold: number
  revenue: number
}

export interface SellerAnalytics {
  sellerId: string
  sellerName: string
  sellerEmail: string
  totalOrders: number
  totalUnitsSold: number
  totalRevenue: number
}

export interface CategoryAnalytics {
  categoryId: string
  categoryName: string
  productCount: number
  totalUnitsSold: number
  totalRevenue: number
}

export interface StatsResponse {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  sellerCount: number
  lowStockCount: number
  topProducts: VelocityRow[]
}

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  return headers
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch('/api/admin/stats', {
    headers: getAuthHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch stats: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchSellerAnalytics(): Promise<SellerAnalytics[]> {
  const res = await fetch('/api/admin/analytics/seller', {
    headers: getAuthHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch seller analytics: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchVelocity(): Promise<VelocityRow[]> {
  const res = await fetch('/api/admin/analytics/velocity', {
    headers: getAuthHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch velocity: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchCategoryAnalytics(): Promise<CategoryAnalytics[]> {
  const res = await fetch('/api/admin/analytics/categories', {
    headers: getAuthHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch category analytics: ${res.statusText}`)
  }
  return res.json()
}

export interface SimulatorParams {
  productId: string
  buyers?: number
  quantityEach?: number
  resetAfter?: boolean
}

export interface SimulatorResult {
  attempts: number
  succeeded: number
  outOfStock: number
  otherErrors: number
  finalStock: number
  durationMs: number
  dbIntegrity: {
    negativeStockRows: number
  }
}

export async function runConcurrencySimulator(
  params: SimulatorParams
): Promise<SimulatorResult> {
  const res = await fetch('/api/admin/simulate-race', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `Simulation failed: ${res.statusText}`)
  }

  return res.json()
}
