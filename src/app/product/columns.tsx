
'use client'

import { ColumnDef } from '@tanstack/react-table'
import { IProduct } from '@/models/product'

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: 'productId',
    header: 'Product ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => `₱${row.original.price.toLocaleString()}`,
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.original.stock
      const color =
        stock === 0 ? 'text-red-600' : stock <= 10 ? 'text-yellow-600' : 'text-green-600'
      return <span className={color}>{stock}</span>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
]
