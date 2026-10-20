import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const decoded = getUser(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: decoded.id },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(wishlist)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

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
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      )
    }

    const existing = await prisma.wishlist.findFirst({
      where: { userId: decoded.id, productId },
    })

    if (existing) {
      // Idempotent success per P2.3
      return NextResponse.json(
        { message: 'Already in wishlist', item: existing },
        { status: 200 }
      )
    }

    const item = await prisma.wishlist.create({
      data: { userId: decoded.id, productId },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { message: 'Already in wishlist' },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const decoded = getUser(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    let productId = searchParams.get('productId')

    // Also support JSON body if sent
    if (!productId) {
      try {
        const body = await request.json()
        productId = body?.productId
      } catch {
        // body not present
      }
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'productId query param or body required' },
        { status: 400 }
      )
    }

    await prisma.wishlist.deleteMany({
      where: {
        userId: decoded.id,
        productId,
      },
    })

    return NextResponse.json({ message: 'Removed from wishlist' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}