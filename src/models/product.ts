import { Schema, model, models } from 'mongoose'

const ProductSchema = new Schema(
  {
    prodId: {type: Number, required: true, unique: true}
    password: { type: String, required: true },
  },
  { timestamps: true },
)


export const Product = models.Product || model('Product', ProductSchema)
