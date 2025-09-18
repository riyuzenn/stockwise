// Overview Page


import TestCard from '@/components/dashboard/card'
import React from 'react'

export default function OverviewPage() {
  return (
    <div className="px-6 md:px-12 lg:px-16 py-8 md:py-10 flex flex-col gap-12 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center md:gap-5">
        <h1 className="scroll-m-20 text-3xl md:text-4xl font-extrabold tracking-tight">
          Overview
        </h1>
        <hr className="hidden md:block w-[1px] h-9 bg-gray-500 dark:bg-white/50 border-none" />
        <p className="text-gray-500 dark:text-white/50 mt-2 md:mt-0">
          Keep tracks of all your products & sales.
        </p>
      </div>
      
      <div className='px-6 py-6 rounded-md w-full bg-[#0a0a0a] dark:bg-[#FDFDFD]'>
        <h1 className="scroll-m-20  text-white dark:text-black text-3xl md:text-3xl font-bold tracking-tight">
          Daegu KoreanMart Indang
        </h1>
        <p className="text-gray-500 dark:text-black/50 mt-2 md:mt-0">
          Keep tracks of all your products & sales.
        </p>

      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <h3 className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight">
          Stock Levels
        </h3>
        <TestCard />
      </div>
    </div>
  )
}

