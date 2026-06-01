import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

    const pendingOrders = await prisma.order.count({
      where: { status: 'pending' }
    })

    const topOrderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5
    })

    const topProductIds: string[] = topOrderItems.map(item => item.productId)
    
    const topProductDetails = await prisma.product.findMany({
      where: { id: { in: topProductIds } }
    })

    const topProducts = topOrderItems.map(item => {
      const product = topProductDetails.find(p => p.id === item.productId)
      return {
        id: item.productId,
        name: product?.name ?? 'Unknown',
        totalSold: item._sum.quantity ?? 0
      }
    })

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount ?? 0,
      pendingOrders,
      topProducts
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}