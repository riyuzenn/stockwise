
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models/product'
import { Sale } from '@/models/sale'

function generateRefId() {
  return 'INV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase()
}


export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const skip = (page - 1) * limit

    const sales = await Sale.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const count = await Sale.countDocuments()

    return NextResponse.json({ success: true, count, data: sales }, { status: 200 })
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const { cart } = body

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 })
    }

    let subtotal = 0
    for (const item of cart) {
      const product = await Product.findById(item._id)
      if (!product) {
        return NextResponse.json({ success: false, message: `Product not found: ${item.name}` }, { status: 404 })
      }
      if (product.stock < item.qty) {
        return NextResponse.json({ success: false, message: `Not enough stock for: ${item.name}` }, { status: 400 })
      }
      product.stock -= item.qty
      await product.save()
      subtotal += product.price * item.qty
    }

    const tax = subtotal * 0.1
    const total = subtotal + tax
    const refId = generateRefId()

    const sale = new Sale({
      refId,
      items: cart.map(i => ({
        productId: i._id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
      subtotal,
      tax,
      total,
    })

    await sale.save()

    return NextResponse.json({ success: true, message: 'Order placed successfully', sale }, { status: 200 })
  } catch (error) {
    console.error('Error placing order:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

