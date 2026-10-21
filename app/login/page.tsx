"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Login failed')
        return
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`
      toast.success('Welcome back!')
      if (data.user?.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center px-6 py-12">
      {/* Logo Section */}
      <div className="w-full max-w-sm flex flex-col items-center mb-8">
        <Link href="/" className="group flex flex-col items-center transition-transform hover:scale-[1.02]">
          {/* Crystal Flora HD Logo */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4 rounded-full bg-white p-1 shadow-lg shadow-black/5 ring-2 ring-primary/25 transition-shadow group-hover:shadow-xl group-hover:ring-primary/40">
            <Image
              src="/images/logo-hd.png"
              alt="Crystal Flora by Sanskriti Sharma"
              width={112}
              height={112}
              priority
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          {/* Brand Name */}
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground tracking-wide text-center">
            Crystal Flora
          </h1>

          {/* Tagline */}
          <p className="text-muted-foreground text-sm mt-1.5 italic tracking-wide text-center">
            {"\"Handcrafted blooms & keepsakes\""}
          </p>
        </Link>
      </div>

      {/* Login Form Section */}
      <div className="w-full max-w-sm">
        {/* Welcome Text */}
        <h2 className="font-serif text-2xl text-foreground text-center mb-8">
          Welcome back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-input border-border rounded-xl px-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-input border-border rounded-xl px-4 pr-12 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium text-base transition-all"
          >
            Login
          </Button>
        </form>



        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          {"Don't have an account? "}
          <a
            href= "/register"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </main>
  )
}

