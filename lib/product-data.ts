export interface Review {
  id: string
  user: string
  rating: number
  text: string
  username: string
  verified: boolean
}

export interface RelatedProduct {
  id: string
  name: string
  price: number
  discountedPrice: number | null
  images: string[]
  image?: string
  originalPrice?: number
  sale?: boolean
}

export const product = {
  id: 'prod1',
  name: 'Crystal Bracelet',
  price: 499,
  originalPrice: 599,
  images: ['/images/logo.png'],
  description: 'Handmade crystal bracelet made with love.',
  shortDescription: 'Handmade crystal bracelet made with love.',
  fullDescription: 'Handmade crystal bracelet made with love. Each piece is carefully crafted by hand using genuine crystals. Perfect as a gift or for everyday wear.',
  category: 'Bracelets',
  isInStock: true,
  rating: 4.5,
  reviewCount: 1,
}

export const reviews: Review[] = [
  {
    id: '1',
    user: 'Priya S',
    username: 'priya_s',
    rating: 5,
    text: 'Beautiful product, loved it!',
    verified: true,
  }
]

export const relatedProducts: any[] = []