// Overview Page

import React from "react"
import TestCard from "@/components/dashboard/card"
import { InvoiceTable } from "@/components/dashboard/recent-invoice-table"
import { TopProductChart } from "@/components/dashboard/top-product"

const sampleData = [
  {
    refId: "REF001",
    productName: "Product A",
    price: 25,
    qty: 2,
    total: 50,
  },
  {
    refId: "REF002",
    productName: "Product B",
    price: 300,
    qty: 1,
    total: 300,
  },
  {
    refId: "REF003",
    productName: "Product C",
    price: 15,
    qty: 5,
    total: 75,
  },
]

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-12 px-6 py-8 min-h-[80vh] md:px-12 md:py-10 lg:px-16">
      <div className="flex flex-col md:flex-row md:items-center md:gap-5">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight md:text-4xl">
          Overview
        </h1>
        <hr className="hidden h-9 w-[1px] border-none bg-gray-500 dark:bg-white/50 md:block" />
        <p className="mt-2 text-gray-500 dark:text-white/50 md:mt-0">
          Keep tracks of all your products & sales.
        </p>
      </div>

      <div className="w-full rounded-md bg-[#f9f06b] px-6 py-4 text-black shadow-md dark:bg-[#d9d05a]">
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight md:text-3xl truncate">
          Daegu KoreanMart Indang
        </h1>
        <p className="mt-2 text-black/70 md:mt-0 pt-2">
          Track. Manage. Grow.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl">
          Stock Levels
        </h3>
        <TestCard />
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <h3 className="scroll-m-20 text-xl font-semibold tracking-tight md:text-2xl">
          Top 5 Products
        </h3>
        <div className="flex flex-col gap-8 lg:flex-row">
          <TopProductChart
            products={[
              { name: "Product A Extra Long Name Example", sales: 320 },
              { name: "Product B", sales: 280 },
              { name: "Product C", sales: 210 },
              { name: "Product D", sales: 190 },
              { name: "Product E", sales: 120 },
            ]}
          />
          <InvoiceTable
            caption="A list of recent ordered products."
            data={sampleData}
          />
          
        </div>
      </div>
    </div>
  )
}

