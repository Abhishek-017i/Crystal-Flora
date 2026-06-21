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
      include: { product: true }
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

    const { productId } = await request.json()

    const existing = await prisma.wishlist.findFirst({
      where: { userId: decoded.id, productId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already in wishlist' },
        { status: 400 }
      )
    }

    const item = await prisma.wishlist.create({
      data: { userId: decoded.id, productId }
    })

    return NextResponse.json(item)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    const decoded = getUser(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { productId } = await params

    await prisma.wishlist.deleteMany({
      where: {
        userId: decoded.id,
        productId
      }
    })

    return NextResponse.json({ message: 'Removed from wishlist' })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}