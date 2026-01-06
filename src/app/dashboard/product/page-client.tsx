
'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
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
import { DeleteConfirmationDialog } from '@/components/dashboard/delete-product'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

interface Product {
  _id: string
  productId: string
  name: string
  price: number
  stock: number
  expiry: string
  createdAt: string
  autoDiscounted: boolean
}

interface IStats {
  total: number
  low: number
  out: number
  expired: number
  soon: number
}

interface Supplier {
  _id: string
  name: string
  email: string
}

const ActionsCell: React.FC<{ product: Product; onUpdated: () => void }> = ({ product, onUpdated }) => {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await axios.post('/api/product/delete', { productId: product.productId })
      if (res.data.success) {
        toast.success(`Product ${product.productId} deleted`)
        onUpdated()
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
        onUpdated={onUpdated}
        productId={product.productId}
        name={product.name}
        price={product.price}
        stock={product.stock}
        expiry={product.expiry ? new Date(product.expiry).toISOString().split('T')[0] : ''}
        autoDiscounted={product.autoDiscounted}
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
}


export default function ProductPageClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [lowStock, setLowStock] = useState<Product[]>([])
  const [stats, setStats] = useState<IStats>({
    total: 0,
    low: 0,
    out: 0,
    expired: 0,
    soon: 0,
  })

  const [notifyOpen, setNotifyOpen] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])
  const [notifying, setNotifying] = useState(false)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = searchParams?.get('filter') || 'all'
  const search = searchParams?.get('search') || ''


  const isExpiringSoon = (expiry: string, days = 7) => {
    const now = new Date()
    const exp = new Date(expiry)
    const diffDays = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays >= 0 && diffDays <= days
  }



  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('/api/supplier')
      setSuppliers(res.data.data || [])
    } catch {
      toast.error('Failed to load suppliers')
    }
  }
  

  // State to track selected low-stock products
const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

// Function to notify selected products
const notifySelectedProducts = async () => {
  if (selectedSuppliers.length === 0) {
    toast.error('Select at least one supplier')
    return
  }
  if (selectedProducts.length === 0) {
    toast.error('Select at least one product')
    return
  }

  setNotifying(true)
  try {
    const payload = selectedProducts.map((p) => ({
      product: { productId: p.productId, name: p.name, stock: p.stock },
      emails: selectedSuppliers,
    }))
    await axios.post('/api/stock/notify', { payload })
    toast.success('Suppliers notified successfully')
    setNotifyOpen(false)
    setSelectedSuppliers([])
    setSelectedProducts([])
  } catch {
    toast.error('Failed to notify suppliers')
  } finally {
    setNotifying(false)
  }
}


  useEffect(() => {
    fetchSuppliers()
  }, [])

  const notifier = async () => {
    if (selectedSuppliers.length === 0) {
      toast.error('Select at least one supplier')
      return
    }

    setNotifying(true)
    try {
      await axios.post('/api/stock/notify', {
        emails: selectedSuppliers,
        products: lowStock,
      })
      toast.success('Supplier notified successfully')
      setNotifyOpen(false)
      setSelectedSuppliers([])
    } catch {
      toast.error('Failed to notify supplier')
    } finally {
      setNotifying(false)
    }
  }

  const fetchLowStock = async () => {
    try {
      const res = await axios.get('/api/stock/low')
      setLowStock(res.data.data || [])
    } catch {
      setLowStock([])
    }
  }

  useEffect(() => {
    fetchLowStock()
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/product/get?filter=${filter}`)
      const json = await res.json()
      setProducts(json?.data ?? [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [filter])
  
  const fetchStats = useCallback(async () => {
    try {
      const [allRes, lowRes, outRes, expiredRes, soonRes] = await Promise.all([
        axios.get('/api/product/get?filter=all'),
        axios.get('/api/product/get?filter=low-stock'),
        axios.get('/api/product/get?filter=out-of-stock'),
        axios.get('/api/product/get?filter=expired'),
        axios.get('/api/product/get?filter=expiring-soon'),
      ])

      setStats({
        total: allRes.data.count,
        low: lowRes.data.count,
        out: outRes.data.count,
        expired: expiredRes.data.count,
        soon: soonRes.data.count,
      })
    } catch (error) {
      console.error(error)
    }
  }, [])


  useEffect(() => {
    fetchProducts()
    fetchStats()
  }, [fetchProducts, fetchStats])

  const handleUpdated = () => {
    fetchProducts()
    fetchStats()
  }

  const filteredProducts = useMemo(() => {
    if (!search) return products
    const s = search.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(s) || p.productId.toLowerCase().includes(s)
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
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n')
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
          stock === 0 ? 'text-red-600' : stock <= 10 ? 'text-yellow-600' : 'text-green-600'
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
      cell: ({ row }) => <ActionsCell product={row.original} onUpdated={handleUpdated} />,
    }
  ]

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
      <div className="min-h-[90vh] w-full flex justify-center items-center">
        <Image unoptimized src="/loader.gif" height={64} width={64} alt="loader" />
      </div>
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
          onClick={() => router.push('/dashboard/product')}
          description="All products currently in the database"
          showButton={false}
        />
        <Card
          title="Low Stock"
          type="low"
          value={stats.low}
          onClick={() => router.push('/dashboard/product?filter=low-stock')}
          description="Currently low stock products"
          showButton={false}
        />
        <Card
          title="Out of Stock"
          type="out"
          value={stats.out}
          onClick={() => router.push('/dashboard/product?filter=out-of-stock')}
          description="Products that require restocking"
          showButton={false}
        />
        <Card
          title="Expired"
          type="out"
          value={stats.expired}
          onClick={() => router.push('/dashboard/product?filter=expired')}
          description="Products that already expired"
          showButton={false}
        />
        <Card
          title="Expiring Soon"
          type="low"
          value={stats.soon}
          onClick={() => router.push('/dashboard/product?filter=expiring-soon')}
          description="Products that soon expire"
          showButton={false}
        />
      </div>

      {lowStock.length > 0 && (
  <div className="rounded-xl border bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-200 dark:border-amber-800 p-5 shadow-sm">
    <h3 className="text-lg font-semibold mb-2">⚠️ Low Stock Items</h3>

    <div className="space-y-2 max-h-[300px] overflow-auto">
      {lowStock.map((p) => (
        <label key={p._id} className="flex items-center gap-3 rounded-md border p-3 cursor-pointer">
          <Checkbox
            checked={selectedProducts.some(sp => sp._id === p._id)}
            onCheckedChange={(checked) => {
              setSelectedProducts((prev) =>
                checked ? [...prev, p] : prev.filter(sp => sp._id !== p._id)
              )
            }}
          />
          <div>
            <p className="font-medium">{p.name}</p>
            <p className="text-sm text-muted-foreground">Stock: {p.stock}</p>
          </div>
        </label>
      ))}
    </div>

    <Button
      className="mt-4"
      variant="destructive"
      onClick={() => setNotifyOpen(true)}
      disabled={selectedProducts.length === 0}
    >
      Notify Supplier
    </Button>
  </div>
)}


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

      <div className="rounded-lg border bg-card p-4 shadow-sm overflow-x-auto">
        {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">Loading products...</div>
        ) : (
            <div className="min-w-[800px]">
            <DataTable
                columns={columns}
                data={paginatedProducts}
                rowClassName={(row: Product) => {
                if (new Date(row.expiry) < new Date()) return 'bg-red-100 dark:bg-red-900/50'
                if (isExpiringSoon(row.expiry)) return 'bg-yellow-100 dark:bg-yellow-900/40'
                return ''
                }}
            />
            </div>
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

      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select suppliers to notify</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[300px] overflow-auto">
            {suppliers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No suppliers found. Add suppliers in Settings.
              </p>
            ) : (
              suppliers.map((s) => (
                <label
                  key={s._id}
                  className="flex items-center gap-3 rounded-md border p-3 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedSuppliers.includes(s.email)}
                    onCheckedChange={(checked) => {
                      setSelectedSuppliers((prev) =>
                        checked ? [...prev, s.email] : prev.filter((e) => e !== s.email)
                      )
                    }}
                  />
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.email}</p>
                  </div>
                </label>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={notifySelectedProducts} disabled={notifying}>
  {notifying ? 'Sending…' : 'Notify Supplier'}
</Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
