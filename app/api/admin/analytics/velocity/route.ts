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

    const velocity = await prisma.$queryRaw<VelocityRow[]>`
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
      LIMIT 20
    `

    return NextResponse.json(velocity)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch velocity analytics' },
      { status: 500 }
    )
  }
}
