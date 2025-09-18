// Overview Page

import TestCard from '@/components/dashboard/card'
import React from 'react'

export default function OverviewPage() {
  return (
    <React.Fragment>
      <div className="px-16 py-10 flex flex-col gap-50 min-h-[80vh]">
        <div>
        <div className="flex items-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Overview
          </h1>
          <hr className="w-[1px] h-9 bg-gray-500 dark:bg-white/50 border-none mx-5" />
          <p className="text-gray-500 dark:text-white/50">
            Keep tracks of all your products & sales.
          </p>
        </div>
        </div>
        <div className="flex flex-col gap-10">
          <h3 className="scroll-m-20 text-2xl font-semibold trac/king-tight">Stock Levels</h3>
          <div>
            <TestCard />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
