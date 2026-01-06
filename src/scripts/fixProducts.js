import { connectDB } from '../lib/mongoose'
import { Product } from '../models/product'

async function fixProducts() {
  await connectDB()
  const result = await Product.updateMany(
    { autoDiscounted: { $exists: false } },
    { $set: { autoDiscounted: false } }
  )
  console.log(`Updated ${result.modifiedCount} products.`)
  process.exit(0)
}

fixProducts().catch(err => {
  console.error(err)
  process.exit(1)
})
