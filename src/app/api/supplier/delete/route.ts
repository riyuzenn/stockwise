import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import { Supplier } from "@/models/supplier"

export async function POST(req: Request) {
  await connectDB()
  const { id } = await req.json()

  await Supplier.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
