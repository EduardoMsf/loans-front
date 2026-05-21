'use client'

import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@shared/stores/auth.store'
import { useThemeStore } from '@shared/stores/theme.store'
import { analytics } from '@shared/lib/analytics'
import { useRouter } from 'next/navigation'
import { useIntl, locales } from '@shared/i18n/intl'
import type { Locale } from '@shared/i18n/intl'
import { Button } from '@shared/ui/button/button'

interface TopBarProps {
  readonly onMenuToggle: () => void
}

function SunIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3 w-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

const LOCALE_META: Record<Locale, { flag: string; label: string; short: string }> = {
  'en-US': { flag: '🇺🇸', label: 'English', short: 'EN' },
  'es-MX': { flag: '🇲🇽', label: 'Español', short: 'ES' },
  'it-IT': { flag: '🇮🇹', label: 'Italiano', short: 'IT' },
  'fr-FR': { flag: '🇫🇷', label: 'Français', short: 'FR' },
}

function LanguageSwitcher() {
  const { locale, setLocale } = useIntl()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouse)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouse)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = LOCALE_META[locale]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        className="flex items-center gap-1.5 rounded-[2px] border border-[color:var(--color-border)] px-2.5 py-1.5 [font-family:var(--font-mono)] text-[11px] font-medium tracking-wide text-[color:var(--color-text-muted)] uppercase transition-colors hover:border-amber-500 hover:text-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.short}</span>
        <ChevronDownIcon open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute top-full right-0 z-50 mt-1.5 min-w-[148px] overflow-hidden rounded-[2px] border border-[color:var(--color-border)] py-1 shadow-lg"
          style={{ background: 'var(--color-surface)' }}
        >
          {locales.map((loc) => {
            const meta = LOCALE_META[loc]
            const isActive = loc === locale
            return (
              <button
                key={loc}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setLocale(loc)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] transition-colors hover:bg-amber-500/10 hover:text-amber-500 ${
                  isActive
                    ? 'font-semibold text-amber-500'
                    : 'text-[color:var(--color-text-secondary)]'
                }`}
              >
                <span className="text-[14px]" aria-hidden="true">
                  {meta.flag}
                </span>
                <span>{meta.label}</span>
                {isActive && (
                  <svg
                    className="ml-auto h-3.5 w-3.5 shrink-0 text-amber-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { user, clearAuth } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const router = useRouter()
  const { t } = useIntl()

  const handleLogout = () => {
    analytics.logout()
    clearAuth()
    router.push('/login')
  }

  return (
    <header
      className="flex h-16 items-center justify-between border-b px-6"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <button
        onClick={onMenuToggle}
        className="rounded-[2px] p-2 text-[color:var(--color-text-muted)] transition-colors hover:text-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
        aria-label={t('toggleSidebar')}
        aria-controls="sidebar"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <div className="flex items-center gap-3">
        <span
          className="[font-family:var(--font-mono)] text-[11px] tracking-[0.08em] text-[color:var(--color-text-muted)] uppercase"
          aria-label={`${t('user')}: ${user?.name ?? t('user')}`}
        >
          {user?.name ?? t('user')}
        </span>

        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="flex h-9 w-9 items-center justify-center rounded-[2px] border border-[color:var(--color-border)] text-[color:var(--color-text-muted)] transition-colors hover:border-amber-500 hover:text-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <LanguageSwitcher />

        <Button variant="ghost" size="sm" onClick={handleLogout} aria-label={t('logout')}>
          {t('logout')}
        </Button>
      </div>
    </header>
  )
}
