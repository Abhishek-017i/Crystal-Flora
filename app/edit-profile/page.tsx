'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

interface ProfileData {
  fullName: string
  email: string
  phone: string
  addressLine: string
  city: string
  pincode: string
}

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
    addressLine: '',
    city: '',
    pincode: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers: any = {}
    if (token) headers.authorization = `Bearer ${token}`
    
    fetch('/api/auth/me', { headers })
      .then(res => res.json())
      .then(data => {
        if (data.error) return
        setFormData({
          fullName: data.name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          addressLine: data.addressLine ?? '',
          city: data.city ?? '',
          pincode: data.pincode ?? '',
        })
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('token')
      const headers: any = { 'Content-Type': 'application/json' }
      if (token) headers.authorization = `Bearer ${token}`

      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          name: formData.fullName,
          phone: formData.phone,
          addressLine: formData.addressLine,
          city: formData.city,
          pincode: formData.pincode,
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert('Profile updated successfully!')
        router.push('/profile')
      } else {
        alert(data.error || 'Failed to update profile')
      }
    } catch (error) {
      alert('Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  const userInitial = formData.fullName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 flex items-center gap-3 z-10">
        <button
          onClick={() => window.history.back()}
          className="text-foreground hover:opacity-70 transition-opacity"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-foreground" style={{ fontFamily: 'var(--font-playfair-display)' }}>
          Edit Profile
        </h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-8">
        {/* Avatar Section */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-foreground" style={{ fontFamily: 'var(--font-playfair-display)' }}>
              {userInitial}
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Email (Non-editable) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Address Line */}
          <div>
            <label htmlFor="addressLine" className="block text-sm font-medium text-foreground mb-2">
              Address Line
            </label>
            <input
              type="text"
              id="addressLine"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              placeholder="Enter your street address"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Pincode */}
          <div>
            <label htmlFor="pincode" className="block text-sm font-medium text-foreground mb-2">
              Pincode
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter your pincode"
              className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-8 px-6 py-4 bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-full transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  )
}
