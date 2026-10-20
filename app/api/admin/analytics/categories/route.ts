import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'

export interface CategoryAnalyticsRow {
  categoryId: string
  categoryName: string
  productCount: number
  totalUnitsSold: number
  totalRevenue: number
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

    const rows = await prisma.$queryRaw<CategoryAnalyticsRow[]>`
      SELECT
        c.id                                                    AS "categoryId",
        c.name                                                  AS "categoryName",
        COUNT(DISTINCT p.id)::int                              AS "productCount",
        COALESCE(SUM(oi.quantity), 0)::int                     AS "totalUnitsSold",
        COALESCE(SUM(oi.quantity * oi."priceAtTime"), 0)::float AS "totalRevenue"
      FROM "Category" c
      LEFT JOIN "Product" p ON p."categoryId" = c.id
      LEFT JOIN "OrderItem" oi ON oi."productId" = p.id
      LEFT JOIN "Order" o ON o.id = oi."orderId" AND o.status != 'cancelled'
      GROUP BY c.id, c.name
      ORDER BY "totalRevenue" DESC
    `

    return NextResponse.json(rows)
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch category analytics' },
      { status: 500 }
    )
  }
}
