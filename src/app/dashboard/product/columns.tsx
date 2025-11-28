
'use client'


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { IProduct } from "@/models/product"

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "productId",
    header: "Product ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => console.log("Edit", product.productId)}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => console.log("Delete", product.productId)}
              className="text-red-600 focus:text-red-700"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

//
// import { ColumnDef } from '@tanstack/react-table'
// import { IProduct } from '@/models/product'
//
// export const columns: ColumnDef<IProduct>[] = [
//   {
//     accessorKey: 'productId',
//     header: 'Product ID',
//   },
//   {
//     accessorKey: 'name',
//     header: 'Name',
//   },
//   {
//     accessorKey: 'price',
//     header: 'Price',
//     cell: ({ row }) => `₱${row.original.price.toLocaleString()}`,
//   },
//   {
//     accessorKey: 'stock',
//     header: 'Stock',
//     cell: ({ row }) => {
//       const stock = row.original.stock
//       const color =
//         stock === 0 ? 'text-red-600' : stock <= 10 ? 'text-yellow-600' : 'text-green-600'
//       return <span className={color}>{stock}</span>
//     },
//   },
//   {
//     accessorKey: 'createdAt',
//     header: 'Created At',
//     cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
//   },
// ]
