import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAdmin } from '@/lib/auth'
import { processOrder } from '@/lib/orders'

export async function POST(request: Request) {
  try {
    const admin = isAdmin(request)
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { productId, buyers = 50, quantityEach = 1, resetAfter = true } = body as {
      productId?: string
      buyers?: number
      quantityEach?: number
      resetAfter?: boolean
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      )
    }

    const targetProduct = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!targetProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const initialStock = targetProduct.stock
    const totalAttempts = Math.max(1, Math.min(100, Number(buyers) || 50))
    const qtyEach = Math.max(1, Number(quantityEach) || 1)

    // Retrieve buyer accounts from database to simulate distinct concurrent users
    let buyerAccounts = await prisma.user.findMany({
      where: { role: 'buyer' },
      take: totalAttempts,
      select: { id: true },
    })

    if (buyerAccounts.length === 0) {
      buyerAccounts = await prisma.user.findMany({
        take: 10,
        select: { id: true },
      })
    }

    const startTime = Date.now()

    // Fire parallel order transactions via Promise.allSettled
    const attempts = Array.from({ length: totalAttempts }, (_, idx) => {
      const buyer = buyerAccounts[idx % buyerAccounts.length]
      return processOrder({
        userId: buyer.id,
        items: [{ productId, quantity: qtyEach }],
        addressLine: `Concurrency Simulator Lane ${idx + 1}`,
        city: 'Surat',
        pincode: '395007',
      })
    })

    const settledResults = await Promise.allSettled(attempts)
    const durationMs = Date.now() - startTime

    let succeeded = 0
    let outOfStock = 0
    let otherErrors = 0

    for (const res of settledResults) {
      if (res.status === 'fulfilled') {
        succeeded++
      } else {
        const errorMsg = res.reason?.message || ''
        if (errorMsg.includes('OUT_OF_STOCK')) {
          outOfStock++
        } else {
          otherErrors++
        }
      }
    }

    // Inspect actual stock level in database prior to reset
    const intermediateProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    })
    const finalStock = intermediateProduct?.stock ?? 0

    // Check DB integrity: verify no negative stock rows exist across the entire catalog
    const negativeStockRows = await prisma.product.count({
      where: { stock: { lt: 0 } },
    })

    // Reset stock to initial value if requested
    if (resetAfter) {
      await prisma.product.update({
        where: { id: productId },
        data: { stock: initialStock },
      })
    }

    return NextResponse.json({
      attempts: totalAttempts,
      succeeded,
      outOfStock,
      otherErrors,
      finalStock,
      durationMs,
      dbIntegrity: {
        negativeStockRows,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to simulate race' },
      { status: 500 }
    )
  }
}
