import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import { isAdmin } from '@/lib/auth'
export async function POST(request: Request) {
  try {
    const admin = isAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, price, discountedPrice, categoryId, images, isHighlighted } = body

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        discountedPrice,
        categoryId,
        images: images ?? [],
        isHighlighted: isHighlighted ?? false
      }
    })

    return NextResponse.json(product)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}