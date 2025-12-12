
'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { DataTable } from './data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Download } from 'lucide-react'
import { EditProductDialog } from '@/components/dashboard/edit-product'
import axios from 'axios'
import { Card } from '@/components/dashboard/card'
import { saveAs } from 'file-saver'
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-product"
import { toast } from "sonner"
import { number } from 'zod'

interface Product {
  _id: string
  productId: string
  name: string
  price: number
  stock: number
  expiry: string
  createdAt: string
}

interface IStats {
  total: number
  low: number
  out: number
  expired: number
  soon: number
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<IStats>({ 
    total: 0, 
    low: 0, 
    out: 0,
    expired: 0,
    soon: 0
  })

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams?.get('filter') || 'all'
  const search = searchParams?.get('search') || ''

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/product/get?filter=${filter}`)
      const json = await res.json()
      setProducts(json?.data ?? [])
      console.log(`${res.url} ss: ${json?.data}`);
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
  try {
    const [allRes, lowRes, outRes, expiredRes, soonRes] = await Promise.all([
      axios.get('/api/product/get?filter=all'),
      axios.get('/api/product/get?filter=low-stock'),
      axios.get('/api/product/get?filter=out-of-stock'),
      axios.get('/api/product/get?filter=expired'),
      axios.get('/api/product/get?filter=expiring-soon'),
    ]);

    setStats({
      total: allRes.data.count,
      low: lowRes.data.count,
      out: outRes.data.count,
      expired: expiredRes.data.count,
      soon: soonRes.data.count,
    });
  } catch (error) {
    console.error(error);
  }
};
  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [filter])

  const handleUpdated = () => {
    fetchProducts()
    fetchStats()
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

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return filteredProducts.slice(start, end)
  }, [filteredProducts, page, pageSize])

  const exportCSV = () => {
    const headers = ['Product ID', 'Name', 'Price', 'Stock', 'Expiry', 'Created At']
    const rows = filteredProducts.map((p) => [
      p.productId,
      p.name,
      p.price,
      p.stock,
      p.expiry,
      p.createdAt,
    ])
    const csvContent =
      [headers, ...rows].map((e) => e.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'products.csv')
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
          stock === 0
            ? 'text-red-600'
            : stock <= 10
            ? 'text-yellow-600'
            : 'text-green-600'
        return <span className={cls}>{stock}</span>
      },
    },
    {
      accessorKey: 'expiry',
      header: 'Expiration Date',
      cell: ({ row }) =>
        new Date(row.original.expiry).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
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
   {
  id: 'actions',
  header: '',
  cell: ({ row }) => {
    const product = row.original
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
      setDeleting(true)
      try {
        const res = await axios.post('/api/product/delete', { productId: product.productId })
        if (res.data.success) {
          toast.success(`Product ${product.productId} deleted`)
          handleUpdated()
        } else {
          toast.error(res.data.message || 'Failed to delete product')
        }
      } catch (err: any) {
        toast.error(err.response?.data?.error || err.message || 'Server error')
      } finally {
        setDeleting(false)
      }
    }

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteOpen(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <EditProductDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          onUpdated={handleUpdated}
          productId={product.productId}
          name={product.name}
          price={product.price}
          stock={product.stock}
          expiry={product.expiry ? new Date(product.expiry).toISOString().split('T')[0] : ''}
        />

        <DeleteConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
          title={`Delete Product?`}
          description={`This will permanently delete ${product.name}. This action cannot be undone.`}
        />
      </>
    )
  },
}  ]

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('filter', value)
    router.push(`/dashboard/product?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (value) params.set('search', value)
    else params.delete('search')
    router.push(`/dashboard/product?${params.toString()}`)
  }

  if (loading) {
    return (
      <React.Fragment>
        <div className='min-h-[90vh] w-full flex justify-center items-center'>
          <img src="/loader.gif" width={64} />
        </div>
      </React.Fragment>
    )
  }

  return (
    <div className="w-full flex flex-col gap-8 px-6 py-8 min-h-[80vh] md:px-12 md:py-10 lg:px-16">
      <h1 className="text-3xl font-bold tracking-tight">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
        <Card
          title="Total Products"
          type="total"
          value={stats.total}
          onClick={() => router.push("/dashboard/product")} 
          description="All products currently in the database"
          showButton={false}
        />
        <Card
          title="Low Stock"
          type="low"
          value={stats.low}
          onClick={() => router.push("/dashboard/product?filter=low-stock")}
          description="Currently low stock products"
          showButton={false}
        />
        <Card
          title="Out of Stock"
          type="out"
          onClick={() => router.push("/dashboard/product?filter=out-of-stock")}
          value={stats.out}
          description="Products that require restocking"
          showButton={false}
        />
        <Card
          title="Expired"
          type="out"
          onClick={() => router.push("/dashboard/product?filter=expired")}
          value={stats.expired}
          description="Products that already expired"
          showButton={false}
        />
        <Card
          title="Expiring Soon"
          type="low"
          value={stats.soon}
          onClick={() => router.push("/dashboard/product?filter=expiring-soon")}
          description="Products that soon expire"
          showButton={false}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          placeholder="Search product..."
          defaultValue={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="sm:w-[250px]"
        />
        <div className="flex gap-2">
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}>
            Export CSV <Download size={16} />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        {loading ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={paginatedProducts}
            rowClassName={(row: Product) =>
              new Date(row.expiry) < new Date() ? 'bg-red-50 dark:bg-red-900/50' : ''
            }
          />
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          Page {page} of {Math.ceil(filteredProducts.length / pageSize)}
        </div>
        <div className="flex gap-2 items-center">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>
          <Button
            disabled={page === Math.ceil(filteredProducts.length / pageSize)}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
          <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

/*
'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'


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
import { EditProductDialog } from '@/components/dashboard/edit-product'


interface Product {
  _id: string
  productId: string
  name: string
  price: number
  stock: number
  expiry: string
  createdAt: string
}


export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()

  const filter = searchParams?.get('filter') || 'all'
  const search = searchParams?.get('search') || ''
  

  

const columns: ColumnDef<Product>[] = [
  { accessorKey: "productId", header: "Product ID" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `₱${row.original.price.toFixed(2)}`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock
      const cls =
        stock === 0 ? "text-red-600" : stock <= 10 ? "text-yellow-600" : "text-green-600"
      return <span className={cls}>{stock}</span>
    },
  },
  
{
  accessorKey: "expiry",
  header: "Expiration Date",
  cell: ({ row }) => {
    const dt = new Date(row.original.expiry)
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  },
},
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  }, 
  {
  id: "actions",
  header: "",
  cell: ({ row }) => {
    const product = row.original
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <EditProductDialog
      productId={row.original.productId}
      name={row.original.name}
      price={row.original.price}
      stock={row.original.stock}
      expiry={row.original.expiry ? new Date(row.original.expiry).toISOString().split('T')[0] : ''}
      onUpdated={() => {
      
      }}
    />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={
              () => alert(`Deleting: ${product.productId}`)
            }
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
]



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
        console.log(json)
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
    router.push(`/dashboard/product?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (value) params.set('search', value)
    else params.delete('search')
    router.push(`/dashboard/product?${params.toString()}`)
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
*/
