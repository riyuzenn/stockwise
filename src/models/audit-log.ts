import mongoose, { Schema, models, model } from 'mongoose'

export type AuditAction = 'ADD_PRODUCT' | 'EDIT_PRODUCT' | 'DELETE_PRODUCT'

const AuditLogSchema = new Schema(
  {
    action: {
      type: String,
      enum: ['ADD_PRODUCT', 'EDIT_PRODUCT', 'DELETE_PRODUCT', 'NOTIFY_PRODUCT'],
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: String,
    userId: String,
    metadata: Object,
  },
  { timestamps: true },
)

export const AuditLog = models.AuditLog || model('AuditLog', AuditLogSchema)
