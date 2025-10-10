
'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from './data-table'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface Product {
  _id: string
  productId: string
  name: string
  price: number
  stock: number
  createdAt: string
}

const columns: ColumnDef<Product>[] = [
  { accessorKey: 'productId', header: 'Product ID' },
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => `₱${row.original.price.toFixed(2)}`,
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.original.stock
      const cls =
        stock === 0 ? 'text-red-600' : stock <= 10 ? 'text-yellow-600' : 'text-green-600'
      return <span className={cls}>{stock}</span>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
  },
]

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()

  const filter = searchParams?.get('filter') || 'all'
  const search = searchParams?.get('search') || ''

  useEffect(() => {
    if (!['all', 'low-stock', 'out-of-stock'].includes(filter)) {
      //setError('Invalid filter. Must be one of: all, low-stock, out-of-stock')
      setLoading(false)
      return
    }
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/product/get?filter=${filter}`)
        const json = await res.json()
        setProducts(json?.data ?? [])
      } catch (err) {
        console.error('Failed to fetch products:', err)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [filter])

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('filter', value)
    router.push(`/product?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (value) params.set('search', value)
    else params.delete('search')
    router.push(`/product?${params.toString()}`)
  }

  const filteredProducts = useMemo(() => {
    if (!search) return products
    const s = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.productId.toLowerCase().includes(s)
    )
  }, [products, search])

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Search product..."
            defaultValue={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="sm:w-[250px]"
          />
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        {loading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : (
          <DataTable columns={columns} data={filteredProducts} />
        )}
      </div>
    </div>
  )
}

