import mongoose, { Schema, Document, models } from 'mongoose'

export interface IProduct extends Document {
  productId: string
  name: string
  price: number
  stock: number
  expiry: Date
  autoDiscounted: boolean
  createdAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    expiry: { type: Date, required: true },
    stock: { type: Number, required: true },
    autoDiscounted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const Product =
  models.Product || mongoose.model<IProduct>('Product', ProductSchema)

