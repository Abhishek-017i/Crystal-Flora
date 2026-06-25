import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUser } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export async function GET(request: Request) {
  try {
    const decoded = getUser(request)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json(user)

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, addressLine, city, pincode } = body

    // Try JWT first
    let userId = getUser(request)?.id

    // Fall back to NextAuth session
    if (!userId) {
      const session = await getServerSession()
      if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email }
        })
        userId = dbUser?.id
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone, addressLine, city, pincode },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        addressLine: true,
        city: true,
        pincode: true,
        role: true
      }
    })

    return NextResponse.json(user)

  }  catch (error) {
  console.error('PATCH /api/auth/me error:', error)
  return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
}
 
}