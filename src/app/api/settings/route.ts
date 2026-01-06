import { requireAuth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoose'
import { Settings } from '@/models/settings'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await requireAuth();
      
      if (!user) {
        return NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      }
  await connectDB()

  let settings = await Settings.findOne()
  if (!settings) settings = await Settings.create({})

  return NextResponse.json(settings)
}

export async function POST(req: Request) {
  const { autoDiscountPercent } = await req.json()
  await connectDB()

  const settings =
    (await Settings.findOne()) ||
    (await Settings.create({ autoDiscountPercent }))

  settings.autoDiscountPercent = autoDiscountPercent
  await settings.save()

  return NextResponse.json({ success: true })
}