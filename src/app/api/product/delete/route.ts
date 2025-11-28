
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models/product' 
export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 })
    }

    const deleted = await Product.findOneAndDelete({ productId })

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: `Product ${productId} deleted successfully` })
  } catch (err: any) {
    console.error('Delete product error:', err)
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 })
  }
}
