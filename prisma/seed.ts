import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting Crystal Flora seed...')

  // Clean existing tables (in FK order)
  await prisma.wishlist.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.seller.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleaned existing tables.')

  // 1. Create Sellers (3)
  const sellersData = [
    { name: 'Floral Co', email: 'floral@demo.com', phone: '+91 9876543210', address: 'Surat, Gujarat' },
    { name: 'Gardenia', email: 'gardenia@demo.com', phone: '+91 9876543211', address: 'Mumbai, Maharashtra' },
    { name: 'Bloom House', email: 'bloom@demo.com', phone: '+91 9876543212', address: 'Bengaluru, Karnataka' },
  ]
  const sellers = []
  for (const s of sellersData) {
    const created = await prisma.seller.create({ data: s })
    sellers.push(created)
  }
  console.log(`✅ Seeded ${sellers.length} sellers.`)

  // 2. Create Categories (6)
  const categoriesData = [
    { name: 'Bouquets', slug: 'bouquets' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Hair Clips', slug: 'hair-clips' },
    { name: 'Keychains', slug: 'keychains' },
    { name: 'Keepsakes', slug: 'keepsakes' },
  ]
  const categories = []
  for (const c of categoriesData) {
    const created = await prisma.category.create({ data: c })
    categories.push(created)
  }
  console.log(`✅ Seeded ${categories.length} categories.`)

  // 3. Create Users (1 Admin + 50 Buyers = 51)
  const adminPasswordHash = await bcrypt.hash('admin1234', 10)
  const buyerPasswordHash = await bcrypt.hash('demo1234', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Demo',
      email: 'admin@demo.com',
      phone: '+91 9999900000',
      passwordHash: adminPasswordHash,
      role: 'admin',
      addressLine: 'Admin HQ, Ring Road',
      city: 'Surat',
      pincode: '395002',
    },
  })

  const mainBuyer = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'buyer@demo.com',
      phone: '+91 9876500001',
      passwordHash: buyerPasswordHash,
      role: 'buyer',
      addressLine: '123 Rose Garden',
      city: 'Surat',
      pincode: '395007',
    },
  })

  const buyers = [mainBuyer]
  const buyerNames = [
    'Ananya Patel', 'Meera Sharma', 'Divya Kumar', 'Sakshi Verma', 'Nisha Gupta',
    'Kavya Iyer', 'Aisha Khan', 'Pooja Reddy', 'Sneha Joshi', 'Rohan Mehta',
    'Aarav Shah', 'Isha Desai', 'Tanvi Rao', 'Neha Singhal', 'Aditi Nair',
    'Riya Malhotra', 'Simran Kaur', 'Kriti Sen', 'Avani Bhatt', 'Shreya Pillai',
    'Tara Das', 'Gauri Deshmukh', 'Mansi Kulkarni', 'Payal Agarwal', 'Swati Bansal',
    'Bhavna Chopra', 'Komal Jain', 'Radhika Menon', 'Diya Kapoor', 'Jhanvi Trivedi',
    'Muskan Pandey', 'Preeti Mishra', 'Shruti Saxena', 'Garima Tiwari', 'Deepika Goyal',
    'Juhi Chawla', 'Parul Yadav', 'Sanjana Mukherjee', 'Alia Dsouza', 'Kiara Fernandes',
    'Zoya Merchant', 'Megha Varma', 'Pallavi Sen', 'Natasha Roy', 'Trisha Ghosh',
    'Varsha Hegde', 'Sunita Mahajan', 'Anita Nambiar', 'Bhavika Somani',
  ]

  for (let i = 0; i < buyerNames.length; i++) {
    const b = await prisma.user.create({
      data: {
        name: buyerNames[i],
        email: `buyer${i + 1}@demo.com`,
        phone: `+91 98765${String(1000 + i).slice(1)}`,
        passwordHash: buyerPasswordHash,
        role: 'buyer',
        addressLine: `${100 + i}, Floral Enclave`,
        city: i % 3 === 0 ? 'Surat' : i % 3 === 1 ? 'Mumbai' : 'Ahmedabad',
        pincode: `${395000 + (i % 10)}`,
      },
    })
    buyers.push(b)
  }
  console.log(`✅ Seeded 1 admin + ${buyers.length} buyers (Total ${buyers.length + 1} users).`)

  // 4. Create 30 Products (3 stock=1 for race demo, 5 stock<5 for alerts, rest healthy)
  // 5 products per category across 6 categories = 30 products
  const productDefinitions = [
    // Category 0: Bouquets
    { name: 'Rose Bouquet Special', price: 1299, discountedPrice: 999, stock: 1, catIdx: 0, sellerIdx: 0 }, // Demo stock=1
    { name: 'Lavender Silk Bouquet', price: 1499, discountedPrice: 1199, stock: 2, catIdx: 0, sellerIdx: 1 }, // Alert stock=2
    { name: 'Blush Peony Floral Bundle', price: 1899, discountedPrice: 1599, stock: 15, catIdx: 0, sellerIdx: 2 },
    { name: 'Sunburst Daisy Arrangement', price: 999, discountedPrice: 799, stock: 20, catIdx: 0, sellerIdx: 0 },
    { name: 'Everlasting Tulip Bloom', price: 1399, discountedPrice: 1199, stock: 25, catIdx: 0, sellerIdx: 1 },

    // Category 1: Bracelets
    { name: 'Crystal Aura Bracelet', price: 599, discountedPrice: 499, stock: 1, catIdx: 1, sellerIdx: 2 }, // Demo stock=1
    { name: 'Rose Quartz Charm Bracelet', price: 799, discountedPrice: 649, stock: 3, catIdx: 1, sellerIdx: 0 }, // Alert stock=3
    { name: 'Amethyst Healing Beaded Bangle', price: 699, discountedPrice: 549, stock: 18, catIdx: 1, sellerIdx: 1 },
    { name: 'Emerald Weave Fabric Bracelet', price: 899, discountedPrice: 749, stock: 12, catIdx: 1, sellerIdx: 2 },
    { name: 'Golden Sunstone Wristlet', price: 999, discountedPrice: 849, stock: 30, catIdx: 1, sellerIdx: 0 },

    // Category 2: Necklaces
    { name: 'Vintage Floral Choker', price: 899, discountedPrice: 749, stock: 1, catIdx: 2, sellerIdx: 1 }, // Demo stock=1
    { name: 'Pressed Flower Glass Locket', price: 1199, discountedPrice: 999, stock: 4, catIdx: 2, sellerIdx: 2 }, // Alert stock=4
    { name: 'Crystal Teardrop Pendant', price: 1299, discountedPrice: 1099, stock: 14, catIdx: 2, sellerIdx: 0 },
    { name: 'Silver Orchid Chain Necklace', price: 1499, discountedPrice: 1249, stock: 22, catIdx: 2, sellerIdx: 1 },
    { name: 'Moonstone Petal Collar', price: 1699, discountedPrice: 1399, stock: 10, catIdx: 2, sellerIdx: 2 },

    // Category 3: Hair Clips
    { name: 'Pearl Daisy Hair Pin Set', price: 399, discountedPrice: 299, stock: 4, catIdx: 3, sellerIdx: 0 }, // Alert stock=4
    { name: 'Velvet Rose Claw Clip', price: 499, discountedPrice: 399, stock: 3, catIdx: 3, sellerIdx: 1 }, // Alert stock=3
    { name: 'Botanical Resin Hair Comb', price: 699, discountedPrice: 549, stock: 25, catIdx: 3, sellerIdx: 2 },
    { name: 'Crystal Butterfly Snap Clip', price: 449, discountedPrice: 349, stock: 40, catIdx: 3, sellerIdx: 0 },
    { name: 'Golden Leaf Hair Barrettes', price: 599, discountedPrice: 479, stock: 35, catIdx: 3, sellerIdx: 1 },

    // Category 4: Keychains
    { name: 'Dried Petal Resin Keychain', price: 299, discountedPrice: 249, stock: 20, catIdx: 4, sellerIdx: 2 },
    { name: 'Cherry Blossom Charm Ring', price: 349, discountedPrice: 299, stock: 18, catIdx: 4, sellerIdx: 0 },
    { name: 'Crystal Flora Monogram Tag', price: 399, discountedPrice: 329, stock: 22, catIdx: 4, sellerIdx: 1 },
    { name: 'Mini Bouquet Bag Charm', price: 449, discountedPrice: 379, stock: 16, catIdx: 4, sellerIdx: 2 },
    { name: 'Forget-Me-Not Acrylic Ring', price: 299, discountedPrice: 249, stock: 50, catIdx: 4, sellerIdx: 0 },

    // Category 5: Keepsakes
    { name: 'Floral Glass Bell Jar Keepsake', price: 2499, discountedPrice: 1999, stock: 6, catIdx: 5, sellerIdx: 1 },
    { name: 'Preserved Rose Shadow Box', price: 2999, discountedPrice: 2499, stock: 8, catIdx: 5, sellerIdx: 2 },
    { name: 'Crystal Memory Coaster Pair', price: 899, discountedPrice: 749, stock: 15, catIdx: 5, sellerIdx: 0 },
    { name: 'Dried Bloom Bookmark Duo', price: 399, discountedPrice: 299, stock: 30, catIdx: 5, sellerIdx: 1 },
    { name: 'Floral Resin Ring Holder', price: 699, discountedPrice: 549, stock: 25, catIdx: 5, sellerIdx: 2 },
  ]

  const products = []
  for (const def of productDefinitions) {
    const p = await prisma.product.create({
      data: {
        name: def.name,
        description: `Handcrafted ${def.name.toLowerCase()} made with natural blooms and premium artisan craft.`,
        price: def.price,
        discountedPrice: def.discountedPrice,
        categoryId: categories[def.catIdx].id,
        sellerId: sellers[def.sellerIdx].id,
        images: ['/images/logo.png'],
        weightGrams: 200,
        stock: def.stock,
        isInStock: def.stock > 0,
        isHighlighted: def.stock > 10,
        productImages: {
          create: [
            { url: '/images/logo.png', isPrimary: true },
          ],
        },
      },
    })
    products.push(p)
  }
  console.log(`✅ Seeded ${products.length} products.`)

  // 5. Create 200 Orders with 300+ OrderItems
  // Distribution: 140 delivered, 30 pending, 20 shipped, 10 cancelled
  const statuses = [
    ...Array(140).fill('delivered'),
    ...Array(30).fill('pending'),
    ...Array(20).fill('shipped'),
    ...Array(10).fill('cancelled'),
  ]

  let totalItemsCreated = 0

  for (let i = 0; i < 200; i++) {
    const buyer = buyers[i % buyers.length]
    const status = statuses[i]

    // 1 to 3 items per order to exceed 300 total items
    const numItems = (i % 3 === 0) ? 2 : (i % 5 === 0) ? 3 : 1
    const chosenProducts = [
      products[(i * 3) % products.length],
      products[(i * 3 + 1) % products.length],
      products[(i * 3 + 2) % products.length],
    ].slice(0, numItems)

    let totalAmount = 0
    const orderItemsData = chosenProducts.map((prod) => {
      const price = prod.discountedPrice ?? prod.price
      const qty = 1 + (i % 2) // qty 1 or 2
      totalAmount += price * qty
      totalItemsCreated += 1
      return {
        productId: prod.id,
        quantity: qty,
        priceAtTime: price,
      }
    })

    // Spread createdAt over past 30 days
    const daysAgo = Math.floor(Math.random() * 30)
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

    await prisma.order.create({
      data: {
        userId: buyer.id,
        totalAmount,
        status,
        addressLine: buyer.addressLine ?? '123 Flora St',
        city: buyer.city ?? 'Surat',
        pincode: buyer.pincode ?? '395007',
        createdAt,
        items: {
          create: orderItemsData,
        },
      },
    })
  }
  console.log(`✅ Seeded 200 orders with ${totalItemsCreated} items.`)

  // 6. Create 150 Reviews (spread across products and buyers)
  const reviewTexts = [
    'Absolutely stunning handcrafted piece! The flowers look so natural.',
    'Exceeded my expectations. Packaging was beautiful and secure.',
    'Such high quality. Will definitely buy as a gift again!',
    'Delicate and gorgeous! Looks even better in person.',
    'Amazing craftsmanship. Totally in love with this!',
  ]

  let reviewsCount = 0
  const reviewPairs = new Set<string>()

  for (let pIdx = 0; pIdx < products.length; pIdx++) {
    const prod = products[pIdx]
    // 5 reviews per product = 30 * 5 = 150 reviews
    for (let r = 0; r < 5; r++) {
      const buyer = buyers[(pIdx * 5 + r) % buyers.length]
      const pairKey = `${buyer.id}-${prod.id}`
      if (reviewPairs.has(pairKey)) continue
      reviewPairs.add(pairKey)

      await prisma.review.create({
        data: {
          userId: buyer.id,
          productId: prod.id,
          rating: 4 + (r % 2), // 4 or 5 star
          text: reviewTexts[(pIdx + r) % reviewTexts.length],
          createdAt: new Date(Date.now() - (r + 1) * 2 * 24 * 60 * 60 * 1000),
        },
      })
      reviewsCount++
    }
  }
  console.log(`✅ Seeded ${reviewsCount} reviews.`)

  console.log('\n================ SEED SUMMARY ================')
  const finalCounts = {
    sellers: await prisma.seller.count(),
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    users: await prisma.user.count(),
    orders: await prisma.order.count(),
    orderItems: await prisma.orderItem.count(),
    reviews: await prisma.review.count(),
    productImages: await prisma.productImage.count(),
  }
  console.table(finalCounts)
  console.log('==============================================\n')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
