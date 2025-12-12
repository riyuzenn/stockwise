'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ProductRow = {
  refId: string
  productName: string
  price: number
  qty: number
  total: number
}

interface InvoiceTableProps {
  caption?: string
  data: ProductRow[]
}

export function InvoiceTable({ caption, data }: InvoiceTableProps) {
  const grandTotal = data.reduce((acc, row) => acc + row.total, 0)

  return (
    <div className="w-full md:w-1/2 max-w-2xl">
      <h4 className="pb-10 scroll-m-20 text-2xl font-semibold tracking-tight">Recent Orders</h4>
      <Table className="text-sm">
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead className="px-2">Ref ID</TableHead>
            <TableHead className="px-2">Product Name</TableHead>
            <TableHead className="px-2 text-right">Price</TableHead>
            <TableHead className="px-2 text-right">Qty</TableHead>
            <TableHead className="px-2 text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              <TableCell className="px-2 font-medium">{row.refId}</TableCell>
              <TableCell className="px-2 truncate max-w-[150px]">{row.productName}</TableCell>
              <TableCell className="px-2 text-right">PHP {row.price.toFixed(2)}</TableCell>
              <TableCell className="px-2 text-right">{row.qty}</TableCell>
              <TableCell className="px-2 text-right">PHP {row.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="px-2">
              Grand Total
            </TableCell>
            <TableCell className="px-2 text-right">PHP {grandTotal.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
