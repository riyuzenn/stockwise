'use client'

import { Label } from '@/components/ui/label'
import { useTheme } from 'next-themes'
import React from 'react'

import { Switch } from '@/components/ui/switch'
import LogoutButton from '@/components/ui/logout-button'
import Header from '@/components/header'
import OverviewPage from './overview-page'

export default function Dashboard() {
  const { theme, setTheme } = useTheme()

  return (
    <React.Fragment>
      <Header />
      <OverviewPage />
      <LogoutButton />
    </React.Fragment>
  )
}
