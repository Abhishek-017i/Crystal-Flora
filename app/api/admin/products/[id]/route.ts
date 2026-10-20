import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = isAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Whitelist update fields per RULES.md §3
    const updateData: Record<string, any> = {}
    if (body.name !== undefined) updateData.name = String(body.name).trim()
    if (body.description !== undefined) updateData.description = body.description ? String(body.description).trim() : null
    if (body.price !== undefined) updateData.price = Number(body.price)
    if (body.discountedPrice !== undefined) updateData.discountedPrice = body.discountedPrice ? Number(body.discountedPrice) : null
    if (body.stock !== undefined) updateData.stock = Math.max(0, Number(body.stock))
    if (body.categoryId !== undefined) updateData.categoryId = String(body.categoryId)
    if (body.sellerId !== undefined) updateData.sellerId = body.sellerId ? String(body.sellerId) : null
    if (body.images !== undefined && Array.isArray(body.images)) updateData.images = body.images
    if (body.isHighlighted !== undefined) updateData.isHighlighted = Boolean(body.isHighlighted)

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, name: true } },
        seller: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json(product)
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error?.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = isAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Attempt deletion with FK error handling
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Product deleted' })
  } catch (error: any) {
    // Foreign key constraint violation (e.g. OrderItem, Review, CartItem referencing product)
    if (error?.code === 'P2003') {
      return NextResponse.json(
        {
          error: 'FOREIGN_KEY_VIOLATION',
          message: 'Cannot delete product because it has existing orders, reviews, or cart items.',
        },
        { status: 409 }
      )
    }

    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}