'use client'
{
  /*
import * as React from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price")
    .transform((val) => Number(val)),
  stock: z
    .string()
    .regex(/^\d+$/, "Enter a valid quantity")
    .transform((val) => Number(val)),
});

type ProductForm = z.infer<typeof productSchema>;

export function AddProductDialog() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductForm) => {
    try {
      setLoading(true);

      const res = await axios.post("/api/product", data);

      if (res.data.success) {
        toast.success("✅ Product added successfully!");
        reset();
        setOpen(false);
      } else {
        toast.error(res.data.message || "Failed to add product.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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

      <DialogContent className="sm:max-w-[425px] bg-[#1c1c1c] border border-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>Enter product details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g. Ice Cream"
              className="bg-[#2b2b2b] border-none"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              placeholder="₱0.00"
              className="bg-[#2b2b2b] border-none"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-red-400 text-sm">{errors.price.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              placeholder="0"
              className="bg-[#2b2b2b] border-none"
              {...register("stock")}
            />
            {errors.stock && (
              <p className="text-red-400 text-sm">{errors.stock.message}</p>
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
  );
}
*/
}

import * as React from 'react'
import axios from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const productSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price')
    .transform((val) => Number(val)),
  stock: z
    .string()
    .regex(/^\d+$/, 'Enter a valid quantity')
    .transform((val) => Number(val)),
})

type ProductForm = z.infer<typeof productSchema>

export function AddProductDialog() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  })

  const onSubmit = async (data: ProductForm) => {
    try {
      setLoading(true)
      const res = await axios.post('/api/product/add', data)

      if (res.status === 201 || res.status === 200) {
        toast.success('Product added successfully!')
        reset()
        setOpen(false)
      } else {
        toast.error('Unexpected response from server.')
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error)
      } else {
        toast.error('Something went wrong.')
      }
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

      <DialogContent className="sm:max-w-[425px] bg-[#1c1c1c] border border-[#2a2a2a] text-white">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>Enter product details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="id">Product ID</Label>
            <Input
              id="id"
              placeholder="e.g. PROD001"
              className="bg-[#2b2b2b] border-none text-white"
              {...register('id')}
            />
            {errors.id && <p className="text-red-400 text-sm">{errors.id.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="e.g. Ice Cream"
              className="bg-[#2b2b2b] border-none text-white"
              {...register('name')}
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              placeholder="₱0.00"
              className="bg-[#2b2b2b] border-none text-white"
              {...register('price')}
            />
            {errors.price && <p className="text-red-400 text-sm">{errors.price.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              placeholder="0"
              className="bg-[#2b2b2b] border-none text-white"
              {...register('stock')}
            />
            {errors.stock && <p className="text-red-400 text-sm">{errors.stock.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#f9f06b] text-black hover:bg-[#e6dc5a]"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
