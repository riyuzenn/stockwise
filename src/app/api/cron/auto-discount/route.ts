import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models/product'
import { Settings } from '@/models/settings'



export async function GET(req: Request) {
  const url = new URL(req.url)
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

  console.log('[VERCEL CRON] Auto-discount started')

  await connectDB()

  const settings = await Settings.findOne()
  const discount = settings?.autoDiscountPercent ?? 0
  const enabled = settings?.autoDiscountEnabled ?? true

  if (!enabled || discount <= 0) {
    console.log('[VERCEL CRON] Auto-discount disabled')
    return NextResponse.json({ message: 'Auto-discount disabled' })
  }

  const now = new Date()
  const weekFromNow = new Date()
  weekFromNow.setDate(now.getDate() + 7)

  const products = await Product.find({
    expiry: { $gte: now, $lte: weekFromNow },
    stock: { $gt: 0 },
    autoDiscounted: false,
  })

  for (const product of products) {
    const newPrice = Number((product.price * (1 - discount / 100)).toFixed(2))
    product.price = newPrice
    product.autoDiscounted = true
    await product.save()
    console.log(`[VERCEL CRON] ${product.productId} discounted → ₱${newPrice}`)
  }

  console.log(`[VERCEL CRON] Done (${products.length} updated)`)

  return NextResponse.json({ updated: products.length })
}