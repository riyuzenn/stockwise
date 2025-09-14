
'use client'

import { usePathname } from 'next/navigation'
import Plasma from '@/components/Plasma'

export default function PlasmaWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showPlasma = pathname === '/' || pathname === '/register'
  const plasmaColor = pathname === '/' ? '#f9f06b' : '#6ba8f9'

  return (
    <>
      {showPlasma && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <Plasma
            color={plasmaColor}
            speed={0.6}
            direction="forward"
            scale={1.1}
            opacity={0.8}
            mouseInteractive={true}
          />
        </div>
      )}
      {children}
    </>
  )
}
