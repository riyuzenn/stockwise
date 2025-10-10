'use client'

import React from 'react'

import LogoutButton from '@/components/ui/logout-button'
import Header from '@/components/header'
import OverviewPage from './overview-page'
import { RightSideBar } from '@/components/dashboard/sidebar'

export default function Dashboard() {
  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="flex-1">
          <OverviewPage />
        </div>

        <RightSideBar />
      </div>
    </React.Fragment>
  )
}
