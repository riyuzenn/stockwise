import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'

export async function requireAuth() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
    if (!token) return null
    
    const decoded = verifyToken(token)
    if (!decoded) return null
    return decoded
}
