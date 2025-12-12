"use client";

import { useEffect, useState } from "react";
import axios from "axios";

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

interface SaleItem {
  refId: string;
  items: {
    name: string;
    price: number;
    qty: number;
  }[];
  total: number;
}

interface TableRowType {
  refId: string;
  productName: string;
  price: number;
  qty: number;
  total: number;
}

interface Props {
  range: string;
}

export function PaginatedInvoiceTable({ range }: Props) {
  const [rows, setRows] = useState<TableRowType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadPage = async (p: number) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/product/sales?page=${p}&limit=10&range=${range}`
      );

      const sales: SaleItem[] = res.data.data;

      const flattened: TableRowType[] = [];
      sales.forEach((sale) => {
        sale.items.forEach((item) => {
          flattened.push({
            refId: sale.refId,
            productName: item.name,
            price: item.price,
            qty: item.qty,
            total: item.price * item.qty,
          });
        });
      });

      setRows(flattened);
      setTotalPages(res.data.totalPages);
      setPage(res.data.page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadPage(1);
  }, [range]);

  const grandTotal = rows.reduce((acc, row) => acc + row.total, 0);

  return (
    <div className="w-full  mt-10">
      <h4 className="pb-6 text-2xl font-semibold tracking-tight">
        Recent Orders
      </h4>

      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Ref ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-8" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            : rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.refId}</TableCell>
                  <TableCell className="truncate max-w-[150px]">
                    {row.productName}
                  </TableCell>
                  <TableCell className="text-right">
                    ₱{row.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{row.qty}</TableCell>
                  <TableCell className="text-right">
                    ₱{row.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>

        {!loading && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Grand Total</TableCell>
              <TableCell className="text-right">
                ₱{grandTotal.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => loadPage(page - 1)}
        >
          Previous
        </Button>

        <span className="text-sm self-center">
          Page {page} / {totalPages}
        </span>

        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => loadPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
