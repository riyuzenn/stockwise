import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import nodemailer from "nodemailer"
import { requireAuth } from "@/lib/auth"
import { Product } from "@/models/product"

interface NotifyItem {
  product: {
    productId: string
    name: string
    stock: number
    orderQty: number
  }
  emails: string[]
}


export async function POST(req: Request) {
  const user = await requireAuth();
      
      if (!user) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      }
  try {
    const { payload }: { payload: NotifyItem[] } = await req.json()

    if (!payload || payload.length === 0) {
      return NextResponse.json(
        { success: false, message: "Notification payload required" },
        { status: 400 }
      )
    }

    

    await connectDB()

    /**
     * Group products by supplier email
     * {
     *   supplier@mail.com: [product, product]
     * }
     */
    const supplierMap: Record<string, NotifyItem["product"][]> = {}

    for (const item of payload) {
      for (const email of item.emails) {
        if (!supplierMap[email]) {
          supplierMap[email] = []
        }
        supplierMap[email].push(item.product)
      }
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    let sent = 0

    for (const [email, products] of Object.entries(supplierMap)) {
      const html = `
        <h2>Low Stock Alert</h2>
        <ul>
          ${products
            .map(
              (p) =>
                `<li><strong>${p.name}</strong> — Remaining: <b>${p.stock}</b></li>`
            )
            .join("")}
        </ul>

        <h2>Purchase Order</h2>
        <ul>
          ${products
            .map(
              (p) =>
                `<li><strong>${p.name}</strong> — Order Quantity: <b>${p.orderQty}</b></li>`
            )
            .join("")}
        </ul>
      `


      await transporter.sendMail({
        from: `"StockWise" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Low Stock Alert",
        html,
      })

      sent++
    }

    const productIds = payload.map(p => p.product.productId)

    const pp = await Product.updateMany(
      { productId: { $in: productIds } },
      { $set: { notified: true } }
    )

    console.log(pp)

    

    return NextResponse.json({
      success: true,
      sent,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, message: "Failed to notify suppliers" },
      { status: 500 }
    )
  }
}
