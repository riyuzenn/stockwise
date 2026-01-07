import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { AuditLog } from '@/models/audit-log'

export async function GET(req: Request) {
  await connectDB()

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const total = await AuditLog.countDocuments()
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  return NextResponse.json({ logs, total, page, limit })
}
