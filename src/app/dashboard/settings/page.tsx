'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Supplier {
  _id: string
  name: string
  email: string
}

export default function SettingsPage() {
  const [username, setUsername] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [supplierName, setSupplierName] = useState('')
  const [supplierEmail, setSupplierEmail] = useState('')
  const [supplierLoading, setSupplierLoading] = useState(false)

  const [discount, setDiscount] = useState(0)


  useEffect(() => {
    axios.get('/api/settings').then((res) => {
      setDiscount(res.data.autoDiscountPercent)
    })
  }, [])

  const saveDiscount = async () => {
    await axios.post('/api/settings', {
      autoDiscountPercent: discount,
    })
    toast.success('Discount settings saved')
  }

  /* ======================
     FETCH USER
  ====================== */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me')
        if (res.data.user) setUsername(res.data.user.username)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  /* ======================
     FETCH SUPPLIERS
  ====================== */
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('/api/supplier')
      setSuppliers(res.data.data || [])
    } catch {
      toast.error('Failed to load suppliers')
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  /* ======================
     CHANGE PASSWORD
  ====================== */
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

  /* ======================
     ADD SUPPLIER
  ====================== */
  const handleAddSupplier = async () => {
    if (!supplierName || !supplierEmail) {
      toast.error('Name and email are required')
      return
    }

    setSupplierLoading(true)
    try {
      await axios.post('/api/supplier', {
        name: supplierName,
        email: supplierEmail,
      })
      toast.success('Supplier added')
      setSupplierName('')
      setSupplierEmail('')
      fetchSuppliers()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add supplier')
    } finally {
      setSupplierLoading(false)
    }
  }

  /* ======================
     REMOVE SUPPLIER
  ====================== */
  const handleRemoveSupplier = async (id: string) => {
    try {
      await axios.post('/api/supplier/delete', { id })
      toast.success('Supplier removed')
      fetchSuppliers()
    } catch {
      toast.error('Failed to remove supplier')
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      
      <div className="space-y-2">
        <Label>Username</Label>
        <Input value={username} disabled />
      </div>

   
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <div>
          <Label className='py-4'>Current Password</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <Label className='py-4'>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <Button onClick={handleChangePassword} disabled={loading} className="w-full">
          {loading ? 'Updating...' : 'Change Password'}
        </Button>
      </div>

   
      <div className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold">Suppliers</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Supplier name"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
          <Input
            placeholder="Supplier email"
            value={supplierEmail}
            onChange={(e) => setSupplierEmail(e.target.value)}
          />
          <Button onClick={handleAddSupplier} disabled={supplierLoading}>
            Add
          </Button>
        </div>

        {suppliers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suppliers added yet.</p>
        ) : (
          <ul className="space-y-2">
            {suppliers.map((s) => (
              <li
                key={s._id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-muted-foreground">{s.email}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveSupplier(s._id)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4 border-t pt-6">
        <h2 className="text-lg font-semibold">Auto Price Discount</h2>

        <div className="space-y-2">
          <Label>Discount for expiring products (%)</Label>
          <Input
            type="number"
            min={0}
            max={90}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
          <p className="text-sm text-muted-foreground">
            Automatically reduce product price when expiring soon.
          </p>
        </div>

        <Button onClick={saveDiscount}>
          Save Discount Settings
        </Button>
      </div>

    </div>
  )
}
