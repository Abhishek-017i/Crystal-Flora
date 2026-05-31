import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { isAdmin } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const admin = isAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const totalOrders = await prisma.order.count()
    
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true }
    })

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })

    const topProductIds = topProducts.map((p: { productId: string; _sum: { quantity: number | null } }) => p.productId)
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } }
    })

    const pendingOrders = await prisma.order.count({
      where: { status: 'pending' }
    })

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount ?? 0,
      pendingOrders,
      topProducts: topProducts.map(tp => ({
        ...topProductDetails.find(p => p.id === tp.productId),
        totalSold: tp._sum.quantity
      }))
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}