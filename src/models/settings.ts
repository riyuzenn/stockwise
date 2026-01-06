
import mongoose, { Schema, Document, models } from 'mongoose'

export interface ISettings extends Document {
  autoDiscountPercent: number
  autoDiscountEnabled: boolean
}

const SettingsSchema = new Schema<ISettings>(
  {
    autoDiscountPercent: { type: Number, default: 0, min: 0, max: 90 },
    autoDiscountEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Settings =
  models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema)
