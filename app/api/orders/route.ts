import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'

interface CartInputItem {
  productId: string
  quantity: number
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
    const { items, addressLine, city, pincode } = body as {
      items?: CartInputItem[]
      addressLine?: string
      city?: string
      pincode?: string
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      )
    }

    if (!addressLine || !city || !pincode) {
      return NextResponse.json(
        { error: 'Shipping address (addressLine, city, pincode) is required' },
        { status: 400 }
      )
    }

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return NextResponse.json(
          { error: 'Invalid product or quantity in order items' },
          { status: 400 }
        )
      }
    }

    // Execute order creation inside Serializable transaction with row locking
    const maxRetries = 3
    let attempt = 0
    let order: any = null

    while (attempt <= maxRetries) {
      try {
        order = await prisma.$transaction(
          async (tx) => {
            // 1. Collect IDs, deduplicate, SORT to avoid deadlock
            const productIds = [...new Set(items.map((i) => i.productId))].sort()

            // 2. Acquire row locks in deterministic order
            const locked = await tx.$queryRaw<
              { id: string; stock: number; price: number; discountedPrice: number | null }[]
            >`
              SELECT id, stock, price, "discountedPrice"
              FROM "Product"
              WHERE id = ANY(${productIds}::text[])
              ORDER BY id
              FOR UPDATE
            `

            // 3. Validate stock from LOCKED rows (not a fresh read)
            for (const item of items) {
              const p = locked.find((l) => l.id === item.productId)
              if (!p) throw new Error(`NOT_FOUND:${item.productId}`)
              if (p.stock < item.quantity) throw new Error(`OUT_OF_STOCK:${item.productId}`)
            }

            // 4. Recompute total from LOCKED prices (never trust client)
            const totalAmount = items.reduce((sum, i) => {
              const p = locked.find((l) => l.id === i.productId)!
              const unit = p.discountedPrice ?? p.price
              return sum + unit * i.quantity
            }, 0)

            // 5. Create Order + OrderItems
            const newOrder = await tx.order.create({
              data: {
                userId: decoded.id,
                totalAmount,
                addressLine,
                city,
                pincode,
                status: 'pending',
                items: {
                  create: items.map((i) => {
                    const p = locked.find((l) => l.id === i.productId)!
                    return {
                      productId: i.productId,
                      quantity: i.quantity,
                      priceAtTime: p.discountedPrice ?? p.price,
                    }
                  }),
                },
              },
              include: {
                items: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        name: true,
                        images: true,
                      },
                    },
                  },
                },
              },
            })

            // 6. Atomic conditional decrement (Layer 1)
            for (const item of items) {
              const r = await tx.product.updateMany({
                where: { id: item.productId, stock: { gte: item.quantity } },
                data: { stock: { decrement: item.quantity } },
              })
              if (r.count === 0) throw new Error(`OUT_OF_STOCK:${item.productId}`)
            }

            return newOrder
          },
          { isolationLevel: 'Serializable', timeout: 10000 }
        )
        break
      } catch (err: any) {
        if (err?.message?.startsWith('OUT_OF_STOCK') || err?.message?.startsWith('NOT_FOUND')) {
          throw err
        }
        const isConflict =
          err?.code === 'P2034' ||
          err?.message?.includes('could not serialize access') ||
          err?.message?.includes('deadlock detected') ||
          err?.message?.includes('write conflict')

        if (isConflict && attempt < maxRetries) {
          attempt++
          await new Promise((resolve) =>
            setTimeout(resolve, 25 * attempt + Math.random() * 35)
          )
          continue
        }

        if (isConflict) {
          for (const item of items) {
            const current = await prisma.product.findUnique({
              where: { id: item.productId },
              select: { stock: true },
            })
            if (current && current.stock < item.quantity) {
              throw new Error(`OUT_OF_STOCK:${item.productId}`)
            }
          }
        }

        throw err
      }
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    if (error?.message?.startsWith('OUT_OF_STOCK')) {
      return NextResponse.json(
        { error: 'OUT_OF_STOCK', message: 'Item is out of stock' },
        { status: 400 }
      )
    }

    if (error?.message?.startsWith('NOT_FOUND')) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}