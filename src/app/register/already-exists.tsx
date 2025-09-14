
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AlreadyExists() {
  const router = useRouter()
  const [seconds, setSeconds] = useState(3) 

  useEffect(() => {
    if (seconds <= 0) {
      router.push("/") 
      return
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [seconds, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-semibold">
        Admin already exists. Redirecting to login in{" "}
        <span className="font-bold">{seconds}</span> second
        {seconds !== 1 ? "s" : ""}...
      </p>
    </div>
  )
}

