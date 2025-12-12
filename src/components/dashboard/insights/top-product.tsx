'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export interface TopProduct {
  name: string
  price: number
  sold: number
  revenue: number
}

interface Props {
  products: TopProduct[]
  loading?: boolean
}

export function TopProductsCard({ products, loading = false }: Props) {
  const formatCurrency = (amount: number) => `₱${amount.toFixed(2)}`

  return (
    <Card className="w-full h-full flex-shrink-0">
      <CardHeader>
        {loading ? (
          <Skeleton className="h-10 w-full mb-2" />
        ) : (
          <>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Top 5 products by revenue</CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent className="py-5">
        {loading ? (
          <Skeleton className="h-48 w-full rounded-md" />
        ) : products.length === 0 ? (
          <div className="text-gray-500 py-4 text-center">No products available</div>
        ) : (
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, idx) => (
                <TableRow key={idx}>
                  <TableCell className="truncate">{product.name}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.sold}</TableCell>
                  <TableCell>{formatCurrency(product.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
