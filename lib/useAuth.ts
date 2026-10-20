'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface AuthUser {
  id: string
  name: string
  email: string
  phone?: string | null
  role: string
  createdAt?: string
}

interface UseAuthOptions {
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectTo?: string
}

export function useAuth(options?: UseAuthOptions) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
    setUser(null)
    router.push('/login')
  }, [router])

  useEffect(() => {
    let isMounted = true

    async function checkAuth() {
      if (typeof window === 'undefined') return

      const token = localStorage.getItem('token')
      if (!token) {
        if (isMounted) {
          setUser(null)
          setLoading(false)
          if (options?.requireAuth) {
            router.push(options.redirectTo || '/login')
          }
        }
        return
      }

      // Sync cookie so server middleware can detect token
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Unauthorized')
        }

        const data: AuthUser = await res.json()
        if (isMounted) {
          setUser(data)
          localStorage.setItem('user', JSON.stringify(data))

          if (options?.requireAdmin && data.role !== 'admin') {
            router.push('/login')
          }
        }
      } catch (err) {
        if (isMounted) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
          if (options?.requireAuth) {
            router.push(options?.redirectTo || '/login')
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [options?.requireAuth, options?.requireAdmin, options?.redirectTo, router])

  return { user, loading, logout }
}
