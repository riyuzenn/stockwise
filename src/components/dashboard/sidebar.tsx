import React from 'react'
import { Button } from '../ui/button'
import { FileDownIcon, Plus } from 'lucide-react'
import { AddProductDialog } from './add-product'

export function RightSideBar() {
  return (
    <div
      className=" border-l border-black/10 dark:border-white/10
        flex bg-[#a0a0a0] dark:bg-[#171717] 
        md:flex-col md:w-40 md:px-4 md:sticky md:top-0 md:h-screen
        flex-row w-full px-6 py-4 sticky bottom-0
        items-center justify-center gap-10 z-50
      "
    >
      {/* Add Product */}
      <div className="flex flex-col items-center gap-3">
        <AddProductDialog />
        <p className="text-sm md:text-md">Add Product</p>
      </div>

      {/* Export CSV */}
      <div className="flex flex-col items-center gap-3">
        <Button variant="secondary" className="size-16 rounded-full">
          <FileDownIcon className="size-6 text-black dark:text-[#dadada]" />
        </Button>
        <p className="text-sm md:text-md">Export CSV</p>
      </div>
    </div>
  )
}
