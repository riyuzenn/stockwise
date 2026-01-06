import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongoose"
import nodemailer from "nodemailer"
import { requireAuth } from "@/lib/auth"

interface NotifyItem {
  product: {
    productId: string
    name: string
    stock: number
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
        <h2>⚠️ Low Stock Alert</h2>
        <p>The following products are low on stock:</p>
        <ul>
          ${products
            .map(
              (p) =>
                `<li><strong>${p.name}</strong> — Remaining: <b>${p.stock}</b></li>`
            )
            .join("")}
        </ul>
      `

      await transporter.sendMail({
        from: `"StockWise" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "⚠️ Low Stock Alert",
        html,
      })

      sent++
    }

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
