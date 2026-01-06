import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Product } from "@/models/product"
import { requireAuth } from "@/lib/auth"

const LOW_STOCK_THRESHOLD = 10

export async function GET() {
  const user = await requireAuth();
      
      if (!user) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      }
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
