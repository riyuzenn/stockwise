'use client'

import React, { Suspense } from 'react'

import OverviewPage from './overview-page'
import { RightSideBar } from '@/components/dashboard/sidebar'

export default function Dashboard() {
  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="flex-1">
          <Suspense fallback={<div className="p-6">Loading dashboard..</div>}>
            <OverviewPage />
          </Suspense>
        </div>
        <Suspense fallback={<div className="p-6">Loading dashboard..</div>}>
          <RightSideBar />
        </Suspense>
      </div>
    </React.Fragment>
  )
}
