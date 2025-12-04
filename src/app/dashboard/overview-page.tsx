
'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { InvoiceTable } from '@/components/dashboard/recent-invoice-table'
import { TopProductChart } from '@/components/dashboard/top-product'
import LogoutButton from '@/components/ui/logout-button'
import { Card } from '@/components/dashboard/card'
import { useRouter } from 'next/navigation'

interface SaleItem {
  refId: string
  productName: string
  price: number
  qty: number
  total: number
}

interface Sale {
  refId: string
  items: {
    name: string
    price: number
    qty: number
  }[]
  subtotal: number
  total: number
  createdAt: string
}

export default function OverviewPage() {
  const [data, setData] = useState({ total: 0, low: 0, out: 0 })
  const [sales, setSales] = useState<SaleItem[]>([])
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number }[]>([])

  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, lowRes, outRes, salesRes] = await Promise.all([
          axios.get('/api/product/get?filter=all'),
          axios.get('/api/product/get?filter=low-stock'),
          axios.get('/api/product/get?filter=out-of-stock'),
          axios.get('/api/product/sales?limit=50'),
        ])

        setData({
          total: allRes.data.count,
          low: lowRes.data.count,
          out: outRes.data.count,
        })

        const flattenedSales: SaleItem[] = []
        const productSalesMap: Record<string, number> = {}

        salesRes.data.data.forEach((sale: Sale) => {
          sale.items.forEach((item) => {
            flattenedSales.push({
              refId: sale.refId,
              productName: item.name,
              price: item.price,
              qty: item.qty,
              total: item.price * item.qty,
            })
            productSalesMap[item.name] = (productSalesMap[item.name] || 0) + item.qty
          })
        })

        setSales(flattenedSales)

        const top = Object.entries(productSalesMap)
          .map(([name, sales]) => ({ name, sales }))
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5)

        setTopProducts(top)
      } catch (error) {
        console.error('Error fetching overview data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="w-full flex flex-col gap-12 px-6 py-8 min-h-[80vh] md:px-12 md:py-10 lg:px-16">
      <div className="flex flex-col justify-between md:flex-row md:items-center md:gap-5">
        <div className="gap-5 flex items-center">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight md:text-4xl">
            Overview
          </h1>
          <hr className="hidden h-9 w-[1px] border-none bg-gray-500 dark:bg-white/50 md:block" />
          <p className="mt-2 text-gray-500 dark:text-white/50 md:mt-0">
            Keep track of all your products & sales.
          </p>
        </div>
      </div>

      <div className="w-full rounded-md bg-[#f9f06b] px-6 py-4 text-black shadow-md dark:bg-[#d9d05a]">
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight md:text-3xl truncate">
          StockWise
        </h1>
        <p className="mt-2 text-black/70 md:mt-0 pt-2">Track. Manage. Grow.</p>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl">
          Stock Levels
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-6">
          <Card
            title="Total Products"
            type="total"
            onClick={() => router.push('/dashboard/product/')}
            value={data.total}
            description="All products currently in the database"
          />
          <Card
            title="Low Stock"
            type="low"
            onClick={() => router.push('/dashboard/product?filter=low-stock')}
            value={data.low}
            description="Currently low stock products"
          />
          <Card
            title="Out of Stock"
            type="out"
            onClick={() => router.push('/dashboard/product?filter=out-of-stock')}
            value={data.out}
            description="Products that require restocking"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl">
          Top 5 Products
        </h3>
        <div className="flex flex-col gap-8 lg:flex-row">
          <TopProductChart products={topProducts} />
          <InvoiceTable caption="A list of recent ordered products." data={sales} />
        </div>
      </div>

      <LogoutButton />
    </div>
  )
}

