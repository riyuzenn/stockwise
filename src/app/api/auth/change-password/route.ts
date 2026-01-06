import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { User } from '@/models/user'
import bcrypt from 'bcryptjs'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { requireAuth } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    )
  }
  try {
    await connectDB()

    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both passwords are required' }, { status: 400 })
    }

    const user = await User.findById(decoded.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
