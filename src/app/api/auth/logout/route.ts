import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server'

export async function POST() {

   const user = await requireAuth();
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }
  const res = NextResponse.json({ message: 'Logged out' })
  res.cookies.set({
    name: 'session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0, // expire immediately
  })
  return res
}
