'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  expiry: string
}

interface CartItem extends Product {
  qty: number
}

export default function POSPage() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  const fetchProducts = async (searchTerm = '', page = 1) => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/product/get?search=${searchTerm}&page=${page}&limit=${itemsPerPage}`)
      setProducts(res.data.data)
      setTotalPages(Math.ceil(res.data.count / itemsPerPage))
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Refetch products when search or page changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts(search, currentPage)
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, currentPage])

  const addToCart = (product: Product) => {
    const exists = cart.find((c) => c._id === product._id)
    if (exists) {
      setCart(cart.map(c => c._id === product._id ? { ...c, qty: c.qty + 1 } : c))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  const isExpired = (expiry: string) => {
    if (!expiry) return false
    return new Date(expiry).getTime() < new Date().setHours(0, 0, 0, 0)
  }


  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter((i) => i._id !== id))
      return
    }
    setCart(cart.map((i) => (i._id === id ? { ...i, qty } : i)))
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const total = subtotal

  const placeOrder = async () => {
    if (cart.length === 0) return
    setPlacingOrder(true)
    try {
      const res = await axios.post('/api/product/sales', { cart })
      if (res.data.success) {
        setCart([])
        fetchProducts(search, currentPage)
        toast.success(`Order placed successfully (Ref: ${res.data.sale.refId})`)
      } else {
        toast.error(res.data.message)
      }
    } catch (err: any) {
      console.error('Error placing order:', err)
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <div className='w-full flex flex-col gap-8 px-6 py-8 min-h-[80vh] md:px-12 md:py-10 lg:px-16'>
      <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
      <Input
        placeholder="Search by name or ID"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
        className="mb-4"
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Product List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {products.map((item) => (
                  <Card key={item._id} className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 transition">
                    <CardContent className="p-4 space-y-2">
                      <p className="text-sm text-neutral-400">{item.stock} left</p>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-neutral-400 text-sm">₱{item.price.toFixed(2)}</p>
                      <Button
                        className="w-full mt-2"
                        onClick={() => addToCart(item)}
                        disabled={item.stock === 0 || isExpired(item.expiry)}
                      >
                        {isExpired(item.expiry)
                          ? 'Expired'
                          : item.stock === 0
                          ? 'Out of Stock'
                          : 'Add'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="self-center text-sm">Page {currentPage} / {totalPages}</span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 && <p className="text-neutral-500 text-sm">No items added</p>}
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b border-neutral-700">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-neutral-400 text-sm">₱{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQty(item._id, item.qty - 1)}>-</Button>
                    <span className="w-6 text-center">{item.qty}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => updateQty(item._id, item.qty + 1)}>+</Button>
                  </div>
                </div>
              ))}
              <div className="border-t border-neutral-700 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total</span>
                  <span>₱{total.toFixed(2)}</span>
                </div>
              </div>
              <Button className="w-full mt-4 text-lg py-6" onClick={placeOrder} disabled={placingOrder}>
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
