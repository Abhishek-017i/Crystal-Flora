'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const newErrors = validateForm()
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  setIsLoading(true)

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error || 'Registration failed')
      return
    }

    toast.success('Account created successfully!')

    // Auto login after register
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    })

    const loginData = await loginRes.json()
    localStorage.setItem('token', loginData.token)
    localStorage.setItem('user', JSON.stringify(loginData.user))
    document.cookie = `token=${loginData.token}; path=/; max-age=86400; SameSite=Lax`
    router.push('/')

  } catch (error) {
    toast.error('Something went wrong. Please try again.')
  } finally {
    setIsLoading(false)
  }
}
  

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="group flex flex-col items-center mb-5 transition-transform hover:scale-[1.02]">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1 shadow-lg shadow-black/5 ring-2 ring-primary/25 transition-shadow group-hover:shadow-xl group-hover:ring-primary/40">
              <Image
                src="/images/logo-hd.png"
                alt="Crystal Flora by Sanskriti Sharma"
                width={112}
                height={112}
                priority
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <span className="font-serif text-2xl text-foreground tracking-wide mt-2">
              Crystal Flora
            </span>
          </Link>

          <h1 className="text-3xl font-serif text-center mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground text-center">
            Join Crystal Flora to discover handcrafted beauty
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <Input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full bg-secondary text-foreground placeholder:text-muted-foreground rounded-2xl py-3 px-4 border-0 focus:ring-2 focus:ring-accent focus:bg-background transition-colors ${
                errors.fullName ? 'ring-2 ring-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-secondary text-foreground placeholder:text-muted-foreground rounded-2xl py-3 px-4 border-0 focus:ring-2 focus:ring-accent focus:bg-background transition-colors ${
                errors.email ? 'ring-2 ring-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full bg-secondary text-foreground placeholder:text-muted-foreground rounded-2xl py-3 px-4 border-0 focus:ring-2 focus:ring-accent focus:bg-background transition-colors ${
                errors.phone ? 'ring-2 ring-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Password"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-10 px-3 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Confirm Password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-accent text-white font-medium rounded-2xl py-3 transition-colors mt-6"
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>



        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:text-primary transition-colors font-medium">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
