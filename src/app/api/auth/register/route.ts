import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongoose'
import { User } from '@/models/user'
import { signToken } from '@/lib/jwt'

const REGISTER_SECRET = process.env.REGISTER_SECRET || 'defaultsecret'

export async function POST(req: Request) {
  try {
    const { username, password, secret } = await req.json()
    await connectDB()

    // Check secret key
    if (secret !== REGISTER_SECRET) {
      return NextResponse.json({ error: 'Invalid registration secret' }, { status: 401 })
    }

    // Only allow 1 admin user
    const existingUser = await User.findOne()
    if (existingUser) {
      return NextResponse.json({ error: 'An admin account already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      password: hashedPassword,
    })

    const token = signToken({ id: user._id, username: user.username })

    const res = NextResponse.json({
      message: 'User registered successfully',
      user: { id: user._id, username: user.username },
    })

    res.cookies.set({
      name: 'session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


// import { NextResponse } from 'next/server'
// import bcrypt from 'bcryptjs'
// import { connectDB } from '@/lib/mongoose'
// import { User } from '@/models/user'
// import { signToken } from '@/lib/jwt'

// export async function POST(req: Request) {
//   try {
//     const { username, password } = await req.json()
//     await connectDB()

//     const existingUser = await User.findOne()
//     if (existingUser) {
//       return NextResponse.json({ error: 'An admin account already exists' }, { status: 400 })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const user = await User.create({
//       username,
//       password: hashedPassword,
//     })

//     const token = signToken({ id: user._id, username: user.username })

//     const res = NextResponse.json({
//       message: 'User registered successfully',
//       user: { id: user._id, username: user.username },
//     })

//     res.cookies.set({
//       name: 'session',
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     })

//     return res
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 })
//   }
// }
