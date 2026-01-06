import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models/product'
import mongoose from 'mongoose'
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
   const user = await requireAuth();
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
    
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'all'
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit
    
    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { productId: { $regex: search, $options: 'i' } } // search by productId string
      ]
    }

    switch (filter) {
      case 'low-stock':
        query.stock = { $gt: 0, $lte: 10 }
        break
      case 'out-of-stock':
        query.stock = 0
        break
      case 'expired':
        query.expiry = { $lt: new Date() }
        break
      case 'expiring-soon':
        const now = new Date()
        const weekFromNow = new Date()
        weekFromNow.setDate(now.getDate() + 7)
        query.expiry = { $gte: now, $lte: weekFromNow }
        break
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const count = await Product.countDocuments(query)

    return NextResponse.json({ success: true, filter, count, data: products }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
