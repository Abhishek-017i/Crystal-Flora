'use client'

import { useState } from 'react'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
  status: 'active' | 'inactive'
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Crystal Bracelet',
    sku: 'CB-001',
    price: 2499,
    stock: 45,
    category: 'Bracelets',
    status: 'active',
  },
  {
    id: '2',
    name: 'Pearl Earrings',
    sku: 'PE-002',
    price: 1899,
    stock: 32,
    category: 'Earrings',
    status: 'active',
  },
  {
    id: '3',
    name: 'Diamond Ring',
    sku: 'DR-003',
    price: 7999,
    stock: 12,
    category: 'Rings',
    status: 'active',
  },
  {
    id: '4',
    name: 'Emerald Necklace',
    sku: 'EN-004',
    price: 4599,
    stock: 28,
    category: 'Necklaces',
    status: 'active',
  },
  {
    id: '5',
    name: 'Crystal Jewelry Set',
    sku: 'CJS-005',
    price: 5999,
    stock: 18,
    category: 'Sets',
    status: 'inactive',
  },
  {
    id: '6',
    name: 'Amethyst Pendant',
    sku: 'AP-006',
    price: 3299,
    stock: 0,
    category: 'Pendants',
    status: 'active',
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === 'all' || product.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 justify-center sm:justify-start">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Products</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-4 px-4 font-semibold text-foreground">Product</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">SKU</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Category</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Price</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Stock</th>
                <th className="text-left py-4 px-4 font-semibold text-foreground">Status</th>
                <th className="text-center py-4 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-4 px-4 font-medium text-foreground">{product.name}</td>
                  <td className="py-4 px-4 text-muted-foreground text-xs">{product.sku}</td>
                  <td className="py-4 px-4 text-foreground">{product.category}</td>
                  <td className="py-4 px-4 font-semibold text-foreground">₹{product.price}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : product.stock < 20
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 flex justify-center gap-2">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="text-2xl font-bold text-foreground mt-2">{products.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Active Products</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {products.filter((p) => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {products.filter((p) => p.stock < 20 && p.stock > 0).length}
          </p>
        </div>
      </div>
    </div>
  )
}
