'use client'

import { useState } from 'react'
import { cn } from '@shared/lib/cn'
import { Sidebar } from '@widgets/sidebar/sidebar'
import { TopBar } from '@widgets/top-bar/top-bar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} />
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-all',
          sidebarOpen ? 'ml-64' : 'ml-0',
        )}
      >
        <TopBar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main id="main-content" className="flex-1 overflow-y-auto p-6" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  )
}
