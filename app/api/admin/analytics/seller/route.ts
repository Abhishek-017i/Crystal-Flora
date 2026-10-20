import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'

interface SellerRow {
  sellerId: string
  sellerName: string
  sellerEmail: string
  totalOrders: number
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

    const sellers = await prisma.$queryRaw<SellerRow[]>`
      SELECT
        "sellerId",
        "sellerName",
        "sellerEmail",
        "totalOrders",
        "totalUnitsSold",
        "totalRevenue"
      FROM v_seller_revenue
      ORDER BY "totalRevenue" DESC
    `

    return NextResponse.json(sellers)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch seller analytics' },
      { status: 500 }
    )
  }
}
