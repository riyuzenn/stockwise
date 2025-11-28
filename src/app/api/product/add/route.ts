
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Product } from "@/models/product"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, name, price, stock, expiry } = body
    console.log(`Expiry: ${expiry}`)
    
    if (!id || !name || price == null || stock == null || !expiry) {
      return NextResponse.json(
        { error: "All fields (including expiry) are required." },
        { status: 400 }
      )
    }

   
    const expiryDate = new Date(expiry)
    if (isNaN(expiryDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid expiry date format." },
        { status: 400 }
      )
    }


    await connectDB()

  
    const existing = await Product.findOne({ productId: id })
    if (existing) {
      return NextResponse.json(
        { error: "Product ID already exists." },
        { status: 400 }
      )
    }

    console.log(expiryDate) 
    const newProduct = new Product({
      productId: id,
      expiry: expiryDate,
      name,
      price,
      stock,
      
    })
    
    console.log(`New Product: ${newProduct}`)
    await newProduct.save()
    
    return NextResponse.json(
      {
        message: "Product added successfully",
        product: newProduct,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error adding product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/*
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
*/
