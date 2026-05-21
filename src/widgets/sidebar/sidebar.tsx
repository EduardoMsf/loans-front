'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@shared/lib/cn'
import { useIntl } from '@shared/i18n/intl'

interface SidebarProps {
  readonly open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useIntl()

  const navigation = [
    { name: t('dashboard'), href: '/dashboard', icon: '📊' },
    { name: t('contracts'), href: '/contracts', icon: '📄' },
  ]

  return (
    <aside
      aria-label={t('mainNavigation')}
      aria-hidden={!open}
      id="sidebar"
      className={cn(
        'fixed top-0 left-0 z-30 flex h-full w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-700 dark:bg-gray-900',
        !open && '-translate-x-full',
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-700">
        <div
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white"
        >
          LP
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t('portalName')}
        </span>
      </div>

      <nav aria-label={t('portalSections')} className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                  )}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
