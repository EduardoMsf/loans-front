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
        'fixed top-0 left-0 z-30 flex h-full w-64 flex-col border-r transition-transform duration-300',
        'border-[color:var(--color-border)] bg-[color:var(--color-surface)]',
        !open && '-translate-x-full',
      )}
    >
      {/* Logo row */}
      <div
        className="flex h-16 items-center gap-3 border-b px-6"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-amber-500 [font-family:var(--font-mono)] text-sm font-bold text-[#0c0c0a]"
        >
          LP
        </div>
        <span className="[font-family:var(--font-mono)] text-[11px] tracking-[0.12em] text-[color:var(--color-text-primary)] uppercase">
          {t('portalName')}
        </span>
      </div>

      <nav aria-label={t('portalSections')} className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-0.5">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'sweep-fill relative flex items-center gap-3 px-3 py-2.5 transition-colors duration-200',
                    '[font-family:var(--font-mono)] text-[11px] tracking-[0.1em] uppercase',
                    isActive
                      ? 'border-l-2 border-amber-500 bg-amber-500/5 pl-[10px] text-amber-500'
                      : 'text-[color:var(--color-text-secondary)] hover:text-amber-500',
                  )}
                >
                  <span className="relative z-10" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="relative z-10">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
