
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import { AddProductDialog } from './add-product'
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
} from '@/components/ui/sidebar'
import {
  Home,
  Package,
  BarChart3,
  Weight,
  Settings,
  FileDownIcon,
  Plus,
} from 'lucide-react'
import LogoutButton from '../ui/logout-button'

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Product', href: '/dashboard/product', icon: Package },
  { name: 'Insights', href: '/dashboard/insights', icon: BarChart3 },
  { name: 'Sales', href: '/dashboard/sales', icon: Weight },
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
          <SidebarGroupLabel className="text-md">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} className="flex items-center gap-2 py-6">
                      <item.icon className="size-6" />
                      <span className="text-lg">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'}>
              <Link href="/dashboard/settings" className="flex items-center gap-2 py-6">
                <Settings className="size-6" />
                <span className="text-lg">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="py-6">
              <LogoutButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export function RightSideBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const exportCSV = async () => {
    if (!pathname.startsWith('/dashboard/product')) return

    const filter = searchParams.get('filter') || 'all'
    const res = await fetch(`/api/product/export?filter=${filter}`)
    const blob = await res.blob()

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.csv'
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="border-l border-black/10 dark:border-white/10 flex bg-[#fafafa] dark:bg-[#171717] md:flex-col md:w-40 md:px-4 md:sticky md:top-0 md:h-screen flex-row w-full px-6 py-4 sticky bottom-0 items-center justify-center gap-10 z-50">
      <div className="flex flex-col items-center gap-3">
        <AddProductDialog />
        <p className="text-sm md:text-md">Add Product</p>
      </div>

      {/* <div className="flex flex-col items-center gap-3">
        <Button variant="secondary" className="size-16 rounded-full">
          <FileDownIcon className="size-6 text-black dark:text-[#dadada]" />
        </Button>
        <p className="text-sm md:text-md">Export CSV</p>
      </div> */}
    </div>
  )
}

