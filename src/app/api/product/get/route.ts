
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models/product'

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'all'

    let products

    switch (filter) {
      case 'low-stock':
        products = await Product.find({ stock: { $gt: 0, $lte: 10 } }).sort({ createdAt: -1 })
        break

      case 'out-of-stock':
        products = await Product.find({ stock: 0 }).sort({ createdAt: -1 })
        break

      case 'expired':
        products = await Product.find({
          expiry: { $lt: new Date() }
        }).sort({ expiry: 1 })
        break

      case 'expiring-soon':
        const now = new Date()
        const weekFromNow = new Date()
        weekFromNow.setDate(now.getDate() + 7)

        products = await Product.find({
          expiry: { $gte: now, $lte: weekFromNow }
        }).sort({ expiry: 1 })
        break

      case 'all':
      default:
        products = await Product.find().sort({ createdAt: -1 })
        break
    }

    return NextResponse.json(
      { success: true, filter, count: products.length, data: products },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

