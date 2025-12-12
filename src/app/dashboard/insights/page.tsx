// 'use client'

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
//   CardDescription
// } from '@/components/ui/card'
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from '@/components/ui/select'
// import { Skeleton } from '@/components/ui/skeleton'


// interface Sale {
//   total: number
//   createdAt: string
//   items: { name: string; price: number; qty: number }[]
// }

// interface TopProduct {
//   name: string
//   revenue: number
// }

// type RangeOption = 'all' | '7d' | '30d' | '90d'

// export default function RevenueOverviewPage() {
//   const [range, setRange] = useState<RangeOption>('all')
//   const [totalRevenue, setTotalRevenue] = useState(0)
//   const [totalOrders, setTotalOrders] = useState(0)
//   const [topProducts, setTopProducts] = useState<TopProduct[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         setLoading(true)
//         const res = await axios.get('/api/product/sales?limit=1000')
//         const sales: Sale[] = res.data.data

//         const now = new Date()
//         now.setHours(0, 0, 0, 0)

//         let startDate: Date
//         switch (range) {
//           case '7d':
//             startDate = new Date(now)
//             startDate.setDate(now.getDate() - 6)
//             break
//           case '30d':
//             startDate = new Date(now)
//             startDate.setDate(now.getDate() - 29)
//             break
//           case '90d':
//             startDate = new Date(now)
//             startDate.setDate(now.getDate() - 89)
//             break
//           default:
//             startDate = new Date(0) // all time
//         }

//         let totalRev = 0
//         let totalOrd = 0
//         const productRevenueMap: Record<string, number> = {}

//         sales.forEach((sale) => {
//           const saleDate = new Date(sale.createdAt)
//           if (saleDate >= startDate) {
//             totalRev += sale.total
//             totalOrd += 1

//             sale.items.forEach((item) => {
//               productRevenueMap[item.name] = (productRevenueMap[item.name] || 0) + item.price * item.qty
//             })
//           }
//         })

//         // Top 5 products
//         const top = Object.entries(productRevenueMap)
//           .map(([name, revenue]) => ({ name, revenue }))
//           .sort((a, b) => b.revenue - a.revenue)
//           .slice(0, 5)

//         setTotalRevenue(totalRev)
//         setTotalOrders(totalOrd)
//         setTopProducts(top)
//       } catch (error) {
//         console.error('Failed to fetch sales:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchSales()
//   }, [range])

//   const formatCurrency = (amount: number) => `₱${amount.toFixed(2)}`

//   return (
//     <div className="w-full flex flex-col gap-8 px-6 py-8 md:px-12 md:py-10 lg:px-16">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Revenue Overview</h1>
//         <Select value={range} onValueChange={(val) => setRange(val as RangeOption)}>
//           <SelectTrigger className="w-[140px]">
//             <SelectValue placeholder="Select range" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Time</SelectItem>
//             <SelectItem value="7d">Last 7 Days</SelectItem>
//             <SelectItem value="30d">Last 30 Days</SelectItem>
//             <SelectItem value="90d">Last 90 Days</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       {/* Metrics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             {loading ? <Skeleton className="h-5 w-24" /> : <CardTitle>💰 Total Revenue</CardTitle>}
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {loading ? <Skeleton className="h-8 w-32" /> : formatCurrency(totalRevenue)}
//           </CardContent>
//           <CardFooter>
//             {loading ? <Skeleton className="h-4 w-40" /> : 'Total revenue in selected range'}
//           </CardFooter>
//         </Card>

//         <Card>
//           <CardHeader>
//             {loading ? <Skeleton className="h-5 w-20" /> : <CardTitle>📦 Total Orders</CardTitle>}
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">
//             {loading ? <Skeleton className="h-8 w-24" /> : totalOrders}
//           </CardContent>
//           <CardFooter>
//             {loading ? <Skeleton className="h-4 w-32" /> : 'Total orders in selected range'}
//           </CardFooter>
//         </Card>
//       </div>

//       {/* Top Products Card */}
//       <div className="mt-6">
//         <Card>
//           <CardHeader>
//             {loading ? (
//               <Skeleton className="h-10 w-full mb-2" /> // single skeleton covering header + description area
//             ) : (
//               <>
//                 <CardTitle>Top Products</CardTitle>
//                 <CardDescription>Top products by revenue</CardDescription>
//               </>
//             )}
//           </CardHeader>
//           <CardContent className="flex flex-col gap-2">
//             {loading ? (
//               <Skeleton className="h-20 w-full rounded-md" /> // one big skeleton for entire content
//             ) : topProducts.length === 0 ? (
//               <div className="text-gray-500 py-4 text-center">No products available</div>
//             ) : (
//               topProducts.map((product, idx) => (
//                 <div
//                   key={idx}
//                   className="flex justify-between items-center px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
//                 >
//                   <span className="truncate">{product.name}</span>
//                   <span className="font-medium">{formatCurrency(product.revenue)}</span>
//                 </div>
//               ))
//             )}
//           </CardContent>
//         </Card>
//       </div>


//     </div>
//   )
// }

"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import {
  RevenueOrdersAreaChart,
  ChartData,
} from "@/components/dashboard/insights/revenue-order-chart";

import {
  TopProduct,
  TopProductsCard,
} from "@/components/dashboard/insights/top-product";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";
import { Package, PhilippinePeso, ShoppingCart } from "lucide-react";
import { PaginatedInvoiceTable } from "@/components/dashboard/recent-invoice-table/paginated";

type RangeOption = "all" | "7d" | "30d" | "90d";

interface Sale {
  total: number;
  createdAt: string;
  items: { name: string; price: number; qty: number }[];
}

export default function InsightsPage() {
  const [range, setRange] = useState<RangeOption>("all");
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async (r: RangeOption) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/product/sales?range=${r}`);
      setSales(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(range);
  }, [range]);

  const chartData: ChartData[] = useMemo(() => {
    const daily: Record<string, { revenue: number; orders: number }> = {};
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt).toISOString().split("T")[0];
      if (!daily[date]) daily[date] = { revenue: 0, orders: 0 };
      daily[date].revenue += sale.total;
      daily[date].orders += sale.items.reduce((acc, item) => acc + item.qty, 0);
    });
    return Object.entries(daily)
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sales]);

  const topProducts: TopProduct[] = useMemo(() => {
    const map: Record<string, { price: number; sold: number; revenue: number }> = {};
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!map[item.name]) {
          map[item.name] = { price: item.price, sold: 0, revenue: 0 };
        }
        map[item.name].sold += item.qty;
        map[item.name].revenue += item.qty * item.price;
      });
    });
    return Object.entries(map)
      .map(([name, data]) => ({
        name,
        price: data.price,
        sold: data.sold,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales]);

  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalOrders = sales.length;
  const avgValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="w-full flex flex-col gap-8 px-6 py-8 min-h-[80vh] md:px-12 md:py-10 lg:px-16">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Insights</h1>
        <Select
          value={range}
          onValueChange={(val) => setRange(val as RangeOption)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            {loading ? (
              <Skeleton className="h-5 w-24" />
            ) : (
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6" /> Total Revenue
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              `₱${totalRevenue.toFixed(2)}`
            )}
          </CardContent>
          <CardFooter>
            {loading ? <Skeleton className="h-4 w-40" /> : "Revenue in selected range"}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            {loading ? (
              <Skeleton className="h-5 w-28" />
            ) : (
              <CardTitle className="flex items-center gap-2">
                <PhilippinePeso className="h-6" /> Average Order Value
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              `₱${avgValue.toFixed(2)}`
            )}
          </CardContent>
          <CardFooter>
            {loading ? <Skeleton className="h-4 w-40" /> : "Average per order"}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            {loading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6" /> Total Orders
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {loading ? <Skeleton className="h-8 w-24" /> : totalOrders}
          </CardContent>
          <CardFooter>
            {loading ? <Skeleton className="h-4 w-32" /> : "Orders in selected range"}
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-[4]">
          <RevenueOrdersAreaChart data={chartData} />
        </div>

        <div className="flex-[2]">
          <TopProductsCard products={topProducts} loading={loading} />
        </div>
      </div>
      
      <PaginatedInvoiceTable range={range} />

    </div>
  );
}
