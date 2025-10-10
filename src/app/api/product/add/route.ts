import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models/product'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, name, price, stock } = body

    if (!id || !name || price == null || stock == null) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    await connectDB()

    const existing = await Product.findOne({ productId: id })
    if (existing) {
      return NextResponse.json({ error: 'Product ID already exists.' }, { status: 400 })
    }

    const newProduct = new Product({
      productId: id,
      name,
      price,
      stock,
    })

    await newProduct.save()

    return NextResponse.json(
      { message: 'Product added successfully', product: newProduct },
      { status: 201 },
    )
  } catch (error: any) {
    console.error('❌ Error adding product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
