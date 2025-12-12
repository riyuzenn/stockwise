

import mongoose, { Schema, Document, models } from 'mongoose'

export interface ISale extends Document {
  refId: string
  items: {
    productId: string
    name: string
    price: number
    qty: number
  }[]
  subtotal: number

  total: number
  createdAt: Date
}

const SaleSchema = new Schema<ISale>(
  {
    refId: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
)

export const Sale = models.Sale || mongoose.model<ISale>('Sale', SaleSchema)

