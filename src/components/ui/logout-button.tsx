'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await axios.post('/api/auth/logout')
      router.push('/')
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="destructive" onClick={handleLogout} disabled={loading} className="w-full">
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}
