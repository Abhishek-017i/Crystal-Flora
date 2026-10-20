"use client"

import { useState } from "react"
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
        {/* Crystal Flora Logo */}
        <div className="mb-4">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            {/* Decorative C and F monogram */}
            <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
            <text
              x="50%"
              y="52%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="font-serif"
              fill="currentColor"
              fontSize="32"
              fontFamily="Playfair Display, Georgia, serif"
              fontStyle="italic"
            >
              CF
            </text>
            {/* Small decorative leaf */}
            <path
              d="M55 25 Q60 20 65 25 Q60 30 55 25"
              fill="#6B8E6B"
              opacity="0.8"
            />
            <path
              d="M58 28 Q55 32 58 36"
              stroke="#6B8E6B"
              strokeWidth="1"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Brand Name */}
        <h1 className="font-serif text-3xl text-foreground tracking-wide">
          Crystal Flora
        </h1>

        {/* Tagline */}
        <p className="text-muted-foreground text-sm mt-1 italic">
          {"\"Handcrafted blooms & keepsakes\""}
        </p>
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

