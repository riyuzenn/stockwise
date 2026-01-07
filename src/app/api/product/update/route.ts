
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Product } from "@/models/product";
import { requireAuth } from "@/lib/auth";
import { AuditLog } from "@/models/audit-log";

export async function POST(req: Request) {
  const user = await requireAuth();
      
      if (!user) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      }
  try {
    await connectDB();

    const { productId, name, price, stock, expiry, autoDiscounted } = await req.json();


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
    product.autoDiscounted =
    typeof autoDiscounted === 'boolean'
      ? autoDiscounted
      : product.autoDiscounted
    

    await AuditLog.create({
    action: 'EDIT_PRODUCT',
    productId,
    productName: name,
    userId: user?.username,
    metadata: {
    price,
    stock,
    expiry,
    autoDiscounted,
    },
    })

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

