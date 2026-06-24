import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'
import { WishlistProvider } from '@/components/ui/wishlist-provider'
import { NextAuthProvider } from '@/components/ui/session-provider'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Crystal Flora | Handcrafted Blooms & Keepsakes',
  description: 'Discover beautifully handcrafted fabric flowers, bracelets, necklaces, keychains and hair clips.',
  keywords: ['handmade', 'fabric flowers', 'bracelets', 'necklaces', 'keychains', 'hair clips', 'bouquets', 'gifts'],
}

export const viewport: Viewport = {
  themeColor: '#f5e6e0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${dmSans.variable} ${playfair.variable} font-sans antialiased`}>
        <NextAuthProvider>
          <WishlistProvider />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}