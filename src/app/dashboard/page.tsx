"use client"

import { Label } from '@/components/ui/label'
import { useTheme } from 'next-themes'
import React from 'react'

import { Switch } from "@/components/ui/switch"
import LogoutButton from '@/components/ui/logout-button'


export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  

  return (
    <React.Fragment>
      <div className="flex justify-center items-center min-h-[90vh]">
        <h1 className="font-semibold text-2xl dark:text-green-100 text-black">Dashboard Page</h1>
        <Switch checked={theme === "dark" ? true : false} onCheckedChange={(checked) => {
          if (checked) {
            setTheme("dark")
          } else {
            setTheme("light")
          }
        }} />
        <p>{theme === "dark" ? "Dark" : "Light"}</p>
      </div>
      <LogoutButton />
    </React.Fragment>
  )
}
