import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models/product'
import { requireAuth } from '@/lib/auth'

export async function GET(req: Request) {
  const user = await requireAuth();
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
  await connectDB()

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter') || 'all'

  let query: any = {}

  const now = new Date()

  if (filter === 'low-stock') query.stock = { $lte: 10 }
  if (filter === 'out-of-stock') query.stock = 0
  if (filter === 'expired') query.expiry = { $lt: now }
  if (filter === 'expiring-soon') {
    const soon = new Date()
    soon.setDate(soon.getDate() + 7)
    query.expiry = { $gte: now, $lte: soon }
  }

  const products = await Product.find(query).lean()

  const headers = ['Product ID', 'Name', 'Price', 'Stock', 'Expiry', 'Created At']
  const rows = products.map((p) => [
    p.productId,
    p.name,
    p.price,
    p.stock,
    p.expiry?.toISOString(),
    p.createdAt?.toISOString(),
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${v ?? ''}"`).join(','))
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="products.csv"',
    },
  })
}
