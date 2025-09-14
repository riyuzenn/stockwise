
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/jwt" 

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value

  if (!session) {
    // no token, redirect to login
    return NextResponse.redirect(new URL("/", req.url))
  }

  try {
    verifyToken(session) 
    return NextResponse.next() 
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], // make sure token is valid before accessing dashboard :)
}
