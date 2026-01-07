'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface AuditLog {
  _id: string
  action: string
  productId: string
  productName?: string
  userId?: string
  createdAt: string
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const totalPages = Math.ceil(total / limit)

  const fetchLogs = async (page: number) => {
    const res = await axios.get(`/api/audit-log?page=${page}&limit=${limit}`)
    setLogs(res.data.logs)
    setTotal(res.data.total)
  }

  useEffect(() => {
    fetchLogs(page)
  }, [page])

  const exportCSV = () => {
    const header = ['Action', 'Product ID', 'Product', 'User', 'Date']
    const rows = logs.map(log => [
      log.action,
      log.productId,
      log.productName || '-',
      log.userId || 'System',
      new Date(log.createdAt).toLocaleString(),
    ])
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map(e => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `audit_logs_page_${page}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Audit Log</h1>

      <div className="flex justify-between items-center mb-2">
        <Button onClick={exportCSV}>Export CSV</Button>
        <div className="space-x-2">
          <Button
            disabled={page <= 1}
            onClick={() => setPage(prev => prev - 1)}
          >
            Prev
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page >= totalPages}
            onClick={() => setPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.productId}</TableCell>
                  <TableCell>{log.productName || '-'}</TableCell>
                  <TableCell>{log.userId || 'System'}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
