"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

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
        body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!res.ok) {
            alert(data.error || 'Login failed')
            return
        }
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/')
    } 
    catch (error) {
        alert('Something went wrong. Please try again.')
    } 
    finally {
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

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          variant="outline"
          className="w-full h-12 border-border bg-card hover:bg-secondary rounded-xl font-medium text-foreground transition-all"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>

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

