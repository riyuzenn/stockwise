'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Prevent SSR/client mismatch
    return (
      <Button variant="outline" size="icon" disabled>
        <span className="opacity-50">
          <Sun className="h-[2rem] w-[2rem]" />
        </span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <Sun className="h-[2rem] w-[2rem]" />
      ) : (
        <Moon className="h-[2rem] w-[2rem]" />
      )}
    </Button>
  )
}
