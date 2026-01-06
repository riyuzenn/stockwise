'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import { toast } from 'sonner'

interface EditProductDialogProps {
  productId: string
  name: string
  price: number
  stock: number
  expiry?: string
  autoDiscounted?: boolean
  open: boolean
  onOpenChange: (v: boolean) => void
  onUpdated: () => void
}

export function EditProductDialog({
  productId,
  name,
  price,
  stock,
  expiry,
  autoDiscounted = false,
  open,
  onOpenChange,
  onUpdated
}: EditProductDialogProps) {
  const [formData, setFormData] = useState({
    name: name || '',
    price: price || 0,
    stock: stock || 0,
    expiry: expiry || '',
    autoDiscounted: autoDiscounted,
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFormData({
      name: name || '',
      price: price || 0,
      stock: stock || 0,
      expiry: expiry || '',
      autoDiscounted: autoDiscounted,
    })
  }, [name, price, stock, expiry, autoDiscounted])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleToggle = (checked: boolean) => {
    setFormData(prev => ({ ...prev, autoDiscounted: checked }))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.stock || !formData.expiry) {
      toast.error('All fields are required')
      return
    }

    setLoading(true)
    try {
      const res = await axios.post('/api/product/update', {
        productId,
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        expiry: formData.expiry,
        autoDiscounted: formData.autoDiscounted,
      })

      if (res.data.success) {
        toast.success(`Product ${productId} updated`)
        onUpdated()
        onOpenChange(false)
      } else {
        toast.error(res.data.message || 'Failed to update product')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#1b1b1b] border border-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 text-white">
          <div className="flex flex-col gap-1">
            <label className="text-sm">Product Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Price</label>
            <Input type="number" name="price" value={formData.price} onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Stock</label>
            <Input type="number" name="stock" value={formData.stock} onChange={handleChange} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm">Expiry Date</label>
            <Input type="date" name="expiry" value={formData.expiry} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Checkbox
              checked={formData.autoDiscounted}
              onCheckedChange={(checked) => handleToggle(Boolean(checked))}
            />
            <span>Discounted</span>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



// 'use client'

// import { useState, useEffect } from 'react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import axios from 'axios'
// import { toast } from 'sonner'

// interface EditProductDialogProps {
//   productId: string
//   name: string
//   price: number
//   stock: number
//   expiry?: string
//   open: boolean
//   onOpenChange: (v: boolean) => void
//   onUpdated: () => void
// }

// export function EditProductDialog({
//   productId,
//   name,
//   price,
//   stock,
//   expiry,
//   open,
//   onOpenChange,
//   onUpdated
// }: EditProductDialogProps) {
//   const [formData, setFormData] = useState({
//     name: name || '',
//     price: price || 0,
//     stock: stock || 0,
//     expiry: expiry || '',
//   })

//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     setFormData({
//       name: name || '',
//       price: price || 0,
//       stock: stock || 0,
//       expiry: expiry || '',
//     })
//   }, [name, price, stock, expiry])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
//   }

//   const handleSubmit = async () => {
//     if (!formData.name || !formData.price || !formData.stock || !formData.expiry) {
//       toast.error('All fields are required')
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await axios.post('/api/product/update', {
//         productId,
//         name: formData.name,
//         price: Number(formData.price),
//         stock: Number(formData.stock),
//         expiry: formData.expiry,
//       })

//       if (res.data.success) {
//         toast.success(`Product ${productId} updated`)
//         onUpdated()
//         onOpenChange(false)
//       } else {
//         toast.error(res.data.message || 'Failed to update product')
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || err.message || 'Server error')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px] bg-[#1b1b1b] border border-[#2a2a2a] text-white">
//         <DialogHeader>
//           <DialogTitle>Edit Product</DialogTitle>
//         </DialogHeader>

//         <div className="grid gap-4 py-4 text-white">
//           <div className="flex flex-col gap-1">
//             <label className="text-sm">Product Name</label>
//             <Input name="name" value={formData.name} onChange={handleChange} />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="text-sm">Price</label>
//             <Input type="number" name="price" value={formData.price} onChange={handleChange} />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="text-sm">Stock</label>
//             <Input type="number" name="stock" value={formData.stock} onChange={handleChange} />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="text-sm">Expiry Date</label>
//             <Input type="date" name="expiry" value={formData.expiry} onChange={handleChange} />
//           </div>
//         </div>

//         <DialogFooter>
//           <Button disabled={loading} onClick={handleSubmit}>
//             {loading ? 'Updating...' : 'Update'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
