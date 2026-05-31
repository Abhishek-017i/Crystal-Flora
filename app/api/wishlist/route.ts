import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

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