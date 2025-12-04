
'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me')
        if (res.data.user) {
          setUsername(res.data.user.username)
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }
    fetchUser()
  }, [])

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Both fields are required')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
      })
      toast.success(res.data.message)
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div>
        <Label>Username</Label>
        <Input value={username} disabled className="bg-neutral-800 text-white" />
      </div>

      <div className="space-y-4">
        <div>
          <Label>Current Password</Label>
          <Input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-neutral-800 text-white"
          />
        </div>
        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-neutral-800 text-white"
          />
        </div>
        <Button
          onClick={handleChangePassword}
          disabled={loading}
          className="bg-[#f9f06b] text-black hover:bg-[#e6dc5a] w-full"
        >
          {loading ? 'Updating...' : 'Change Password'}
        </Button>
      </div>
    </div>
  )
}
