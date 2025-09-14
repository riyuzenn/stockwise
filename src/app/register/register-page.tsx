
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import React from "react"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import Plasma from "@/components/Plasma"
import axios from "axios"

const registerSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "" },
  })

  const onSubmit = async (values: RegisterValues) => {
    setLoading(true)
    setError(null)

    try {
      await axios.post("/api/auth/register", values)
      router.push("/dashboard")
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Registration failed")
      } else {
        setError("Unexpected error")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
     
      <div className="flex min-h-screen justify-center items-center">
        <div className="">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Register for StockWise
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="pt-16 flex flex-col gap-8">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 pl-4"
                          placeholder="Enter your username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 pl-4"
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>
            </form>
          </Form>
          <p className="pt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

