"use client"

import * as React from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const productFormSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price"),
  stock: z.string().regex(/^\d+$/, "Enter a valid quantity"),
  expiry: z.string().min(1, "Expiry date is required"),
})


const parsedProductSchema = productFormSchema.transform((data) => ({
  ...data,
  price: Number(data.price),
  stock: Number(data.stock),
}))

type ProductFormInput = z.infer<typeof productFormSchema>
type ProductFormParsed = z.infer<typeof parsedProductSchema>



export function AddProductDialog() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
  })

  const onSubmit = async (values: ProductFormInput) => {
    try {
      setLoading(true)

      // Parse & convert types safely
      const data: ProductFormParsed = parsedProductSchema.parse(values)

      const expiryDate = new Date(data.expiry)
      if (isNaN(expiryDate.getTime())) {
        toast.error("Invalid expiry date")
        return
      }

      const res = await axios.post("/api/product/add", {
        ...data,
        expiry: expiryDate.toISOString(),
      })

      if (res.status === 200 || res.status === 201) {
        toast.success("Product added successfully!")
        reset()
        setOpen(false)
      } else {
        toast.error("Unexpected server response.")
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="size-16 bg-white rounded-full flex items-center justify-center"
        >
          <Plus className="size-8 text-black" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-[#1b1b1b] border border-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Enter product details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Product ID */}
          <div className="grid gap-2">
            <Label htmlFor="id">Product ID</Label>
            <Input
              id="id"
              placeholder="e.g. PROD001"
              className="bg-[#2b2b2b] border-none text-white"
              {...register("id")}
            />
            {errors.id && (
              <p className="text-red-400 text-sm">{errors.id.message}</p>
            )}
          </div>

          {/* Product Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g. Ice Cream"
              className="bg-[#2b2b2b] border-none text-white"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              placeholder="₱0.00"
              className="bg-[#2b2b2b] border-none text-white"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-red-400 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Stock */}
          <div className="grid gap-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              placeholder="0"
              className="bg-[#2b2b2b] border-none text-white"
              {...register("stock")}
            />
            {errors.stock && (
              <p className="text-red-400 text-sm">{errors.stock.message}</p>
            )}
          </div>

          {/* Expiry */}
          <div className="grid gap-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              type="date"
              id="expiry"
              className="bg-[#2b2b2b] border-none text-white"
              {...register("expiry")}
            />
            {errors.expiry && (
              <p className="text-red-400 text-sm">{errors.expiry.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#f9f06b] text-black hover:bg-[#e6dc5a]"
            >
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
