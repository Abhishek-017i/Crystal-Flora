import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { getUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const decoded = getUser(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items, addressLine, city, pincode } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      )
    }

    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    })

    let totalAmount = 0
    const orderItems = items.map((item: any) => {
      const product = products.find(p => p.id === item.productId)
      if (!product) throw new Error(`Product ${item.productId} not found`)
      const price = product.discountedPrice ?? product.price
      totalAmount += price * item.quantity
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: price
      }
    })

    const order = await prisma.order.create({
      data: {
        userId: decoded.id,
        totalAmount,
        addressLine,
        city,
        pincode,
        status: 'pending',
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json(order)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}