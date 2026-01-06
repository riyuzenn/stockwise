"use server"

import cron from 'node-cron'
import { connectDB } from '@/lib/mongoose'
import { Product } from '@/models/product'
import { Settings } from '@/models/settings'

export async function startAutoDiscountCron() {
  cron.schedule(
    '* */5 * * * *',
    async () => {
      console.log('[CRON] Auto-discount started')

      await connectDB()

      const settings = await Settings.findOne()
      const discount = settings?.autoDiscountPercent ?? 0

      if (discount <= 0) {
        console.log('[CRON] Discount disabled')
        return
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
        console.log(product)
        const newPrice = Number(
          (product.price * (1 - discount / 100)).toFixed(2)
        )

        product.price = newPrice
        product.autoDiscounted = true
        await product.save()

        console.log(
          `[CRON] ${product.productId} discounted → ₱${newPrice}`
        )
      }

      console.log(`[CRON] Done (${products.length} updated)`)
    },
    {
      timezone: 'Asia/Manila',
    }
  )
}
