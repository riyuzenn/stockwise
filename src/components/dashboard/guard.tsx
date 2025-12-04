
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const token = document.cookie.includes('session=')
    if (!token) router.push('/')
  }, [])

  return <>{children}</>
}
