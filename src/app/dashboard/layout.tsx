
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/dashboard/sidebar'
import { useEffect } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()


  const pageTitles: Record<string, string> = {
    '/dashboard': 'Overview',
    '/dashboard/product': 'Products',
    '/dashboard/insights': 'Insights',
  }

  const pageTitle = pageTitles[pathname] || 'Dashboard'

  

  

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="h-16 flex items-center px-4 border-b">
          <SidebarTrigger className="mr-2" />
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

