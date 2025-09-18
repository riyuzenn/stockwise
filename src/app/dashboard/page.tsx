'use client'

import React from 'react'

import LogoutButton from '@/components/ui/logout-button'
import Header from '@/components/header'
import OverviewPage from './overview-page'

export default function Dashboard() {

  return (
    <React.Fragment>
    {/*<Header />*/}
      <OverviewPage />
      {/*<LogoutButton />*/}
    </React.Fragment>
  )
}
