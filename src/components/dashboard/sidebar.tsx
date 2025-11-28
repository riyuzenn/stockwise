'use client'

import React from 'react'
import { Button } from '../ui/button'
import { AddProductDialog } from './add-product'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { 
  Home, 
  Package, 
  BarChart3,
  FileDownIcon, 
  Plus,
  User
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: Home,
  },
  {
    name: 'Product',
    href: '/dashboard/product',
    icon: Package,
  },
  {
    name: 'Insights',
    href: '/dashboard/insights',
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2 text-xl font-bold">StockWise</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-md'>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem className='' key={item.href}>
                  <SidebarMenuButton 
                    asChild
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href} className="flex items-center gap-2 py-6">
                      <span className='size-6'><item.icon /></span>
                      <span className='text-lg'>{item.name} </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  )
}

export function RightSideBar() {
  return (
    <div
      className=" border-l border-black/10 dark:border-white/10
        flex bg-[#fafafa] dark:bg-[#171717] 
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
