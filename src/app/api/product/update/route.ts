
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/product";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { productId, name, price, stock, expiry } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Missing productId" },
        { status: 400 }
      );
    }

    const product = await Product.findOne({ productId });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.expiry = expiry ? new Date(expiry) : product.expiry;

    await product.save();

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

