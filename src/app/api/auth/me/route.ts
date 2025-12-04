
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { User } from '@/models/user'
import { verifyToken } from '@/lib/jwt'

export async function GET(req: Request) {
  try {
    await connectDB()
    const token = req.cookies.get('session')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const user = await User.findById(decoded.id).select('username')
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 })
    }

    return NextResponse.json({ user: { id: user._id, username: user.username } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
