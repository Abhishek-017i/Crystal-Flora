import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'

interface VelocityRow {
  productId: string
  productName: string
  categoryName: string
  sellerName: string
  currentStock: number
  price: number
  unitsSold: number
  revenue: number
}

export async function GET(request: Request) {
  try {
    const admin = isAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [totalOrders, totalRevenue, pendingOrders, sellerCount, lowStockCount, topProducts] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.order.count({
        where: { status: 'pending' }
      }),
      prisma.seller.count(),
      prisma.product.count({
        where: { stock: { lt: 5 } }
      }),
      prisma.$queryRaw<VelocityRow[]>`
        SELECT
          "productId",
          "productName",
          "categoryName",
          "sellerName",
          "currentStock",
          "price",
          "unitsSold",
          "revenue"
        FROM v_product_velocity
        ORDER BY revenue DESC
        LIMIT 5
      `
    ])

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount ?? 0,
      pendingOrders,
      sellerCount,
      lowStockCount,
      topProducts
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}