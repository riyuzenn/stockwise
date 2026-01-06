import mongoose, { Schema, Document, models } from "mongoose"

export interface ISupplier extends Document {
  name: string
  email: string
  createdAt: Date
}

const SupplierSchema = new Schema<ISupplier>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

export const Supplier =
  models.Supplier || mongoose.model<ISupplier>("Supplier", SupplierSchema)
