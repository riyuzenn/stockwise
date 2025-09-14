import { NextResponse } from 'next/server'

export async function POST() {
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
