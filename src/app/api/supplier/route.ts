import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Supplier } from "@/models/supplier"

export async function GET() {
  await connectDB()
  const suppliers = await Supplier.find().sort({ createdAt: -1 })
  return NextResponse.json({ success: true, data: suppliers })
}

export async function POST(req: Request) {
  await connectDB()
  const { name, email } = await req.json()

  if (!name || !email) {
    return NextResponse.json(
      { success: false, message: "Name and email required" },
      { status: 400 }
    )
  }

  const supplier = await Supplier.create({ name, email })
  return NextResponse.json({ success: true, data: supplier })
}
