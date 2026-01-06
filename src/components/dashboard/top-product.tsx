'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis, Cell } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type Product = {
  name: string
  sales: number
}

interface TopProductChartProps {
  products: Product[]
}

export function TopProductChart({ products }: TopProductChartProps) {
  // take only top 5 products by sales
  const chartData = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5)

  return (
    <Card className="md:w-1/2">
      <CardHeader>
        <CardTitle>Top 5 Products</CardTitle>
        <CardDescription>Based on sales from the <b>recent orders</b></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            sales: { label: 'Sales' },
          }}
          className="max-h-64 w-full"
        >
          <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0 }}>
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              width={120}
              tickFormatter={(value: string) =>
                value.length > 12 ? value.slice(0, 12) + '…' : value
              }
            />
            <XAxis dataKey="sales" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="sales" layout="vertical" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => {
                // Base color #f9f06b = hsl(55, 92%, 70%)
                const baseHue = 55
                const saturation = 92
                const lightness = Math.max(30, 70 - index * 8) // darker for each bar
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${baseHue}, ${saturation}%, ${lightness}%)`}
                  />
                )
              })}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">      
        <div className="text-muted-foreground leading-none">Showing the graph of top selling products based on <b>recent orders.</b></div>
      </CardFooter>
    </Card>
  )
}
