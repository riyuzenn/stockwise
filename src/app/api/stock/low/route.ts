import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Product } from "@/models/product"

const LOW_STOCK_THRESHOLD = 10

export async function GET() {
  try {
    await connectDB()

    const products = await Product.find({
      stock: { $lte: LOW_STOCK_THRESHOLD },
    })
      .sort({ stock: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, message: "Failed to fetch low stock products" },
      { status: 500 }
    )
  }
}
