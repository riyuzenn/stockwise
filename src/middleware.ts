import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { cookies } from 'next/headers'

export async function middleware(req: NextRequest) {

  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value;

  const url = req.nextUrl.clone();

  if (!token) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
