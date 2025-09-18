// Header for the Dashboard :>

import React from 'react'
import { Switch } from './ui/switch'
import { useTheme } from 'next-themes'

export default function Header() {
  const { theme, setTheme } = useTheme()
  return (
    <React.Fragment>
      <Switch
        checked={theme === 'dark' ? true : false}
        onCheckedChange={(checked) => {
          if (checked) {
            setTheme('dark')
          } else {
            setTheme('light')
          }
        }}
      />
    </React.Fragment>
  )
}
