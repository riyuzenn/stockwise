'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'
import { MoonIcon, Sun } from 'lucide-react'
import Image from 'next/image'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/switch'

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
})

type PasswordValues = z.infer<typeof passwordSchema>

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
  const [pageLoad, setPageLoad] = useState(true);

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [supplierName, setSupplierName] = useState('')
  const [supplierEmail, setSupplierEmail] = useState('')
  const [supplierLoading, setSupplierLoading] = useState(false)

  const [autoDiscountEnabled, setAutoDiscountEnabled] = useState(true)

  const [discount, setDiscount] = useState(0)
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/auth/me')
        if (res.data.user) setUsername(res.data.user.username)
        setPageLoad(false)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    axios.get('/api/settings').then((res) => {
      setDiscount(res.data.autoDiscountPercent)
      setAutoDiscountEnabled(res.data.autoDiscountEnabled ?? true)
    })
  }, [])


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


  const handleRemoveSupplier = async (id: string) => {
    try {
      await axios.post('/api/supplier/delete', { id })
      toast.success('Supplier removed')
      fetchSuppliers()
    } catch {
      toast.error('Failed to remove supplier')
    }
  }

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  })

  const onChangePassword = async (values: PasswordValues) => {
    setLoading(true)
    try {
      const res = await axios.post('/api/auth/change-password', values)
      toast.success(res.data.message)
      form.reset()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

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

  if (pageLoad) {
      return (
        <div className="min-h-[90vh] w-full flex justify-center items-center">
          <Image unoptimized src="/loader.gif" height={64} width={64} alt="loader" />              
        </div>
      )
    }

  return (
    <div className="w-full max-w-xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className='flex items-center gap-5'>
        <p>Change Theme: </p>
        <Button onClick={() => {
          theme === "dark" ? setTheme("light") : setTheme("dark")
        }}>
          {theme === "dark" ? <Sun /> : <MoonIcon />}
        </Button>
      </div>
      
      <div className="space-y-2">
        <Label>Username</Label>
        <Input value={username} disabled />
      </div>

   
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onChangePassword)} className="space-y-4">

            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Current password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="New password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Change Password'}
            </Button>
          </form>
        </Form>
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

      <div className="space-y-2 border-t pt-6">
        <h2 className="text-lg font-semibold">Auto Price Discount</h2>

        <div className="flex items-center gap-3">
          <Switch
            checked={autoDiscountEnabled}
            onCheckedChange={(val) => setAutoDiscountEnabled(val as boolean)}
          />
          <p>Enable Auto Discount</p>
        </div>

        <div className="space-y-2 mt-2">
          <Label>Discount for expiring products (%)</Label>
          <Input
            type="number"
            min={0}
            max={90}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            disabled={!autoDiscountEnabled} // disable input if switch off
          />
          <p className="text-sm text-muted-foreground">
            Automatically reduce product price when expiring soon.
          </p>
        </div>

        <Button
          onClick={async () => {
            await axios.post('/api/settings', {
              autoDiscountPercent: discount,
              autoDiscountEnabled,
            })
            toast.success('Discount settings saved')
          }}
        >
          Save Discount Settings
        </Button>
      </div>


    </div>
  )
}
