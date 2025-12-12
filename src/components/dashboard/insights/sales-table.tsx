"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type SaleRow = {
  refId: string;
  productName: string;
  price: number;
  qty: number;
  total: number;
};

interface Props {
  data: SaleRow[];
  loading: boolean;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function SalesTable({ data, loading, page, pageCount, onPageChange }: Props) {
  const grandTotal = data.reduce((acc, row) => acc + row.total, 0);

  return (
    <div className="w-full mt-10">
      <h4 className="pb-6 text-2xl font-semibold tracking-tight">
        Sales Records
      </h4>

      {loading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <Table className="text-sm">
          <TableCaption>Paginated list of all sales</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead className="px-2">Ref ID</TableHead>
              <TableHead className="px-2">Product</TableHead>
              <TableHead className="px-2 text-right">Price</TableHead>
              <TableHead className="px-2 text-right">Qty</TableHead>
              <TableHead className="px-2 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="px-2 font-medium">{row.refId}</TableCell>
                <TableCell className="px-2 truncate max-w-[120px]">
                  {row.productName}
                </TableCell>
                <TableCell className="px-2 text-right">
                  ₱{row.price.toFixed(2)}
                </TableCell>
                <TableCell className="px-2 text-right">{row.qty}</TableCell>
                <TableCell className="px-2 text-right">
                  ₱{row.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="px-2 font-semibold">
                Grand Total
              </TableCell>
              <TableCell className="px-2 text-right font-semibold">
                ₱{grandTotal.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        <p className="text-sm">
          Page {page} / {pageCount}
        </p>

        <Button
          variant="outline"
          disabled={page === pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
