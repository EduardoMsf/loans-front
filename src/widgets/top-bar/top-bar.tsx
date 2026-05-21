'use client'

import { useAuthStore } from '@shared/stores/auth.store'
import { useThemeStore } from '@shared/stores/theme.store'
import { Button } from '@shared/ui/button/button'
import { analytics } from '@shared/lib/analytics'
import { useRouter } from 'next/navigation'
import { useIntl } from '@shared/i18n/intl'

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

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { user, clearAuth } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const router = useRouter()
  const { locale, setLocale, t } = useIntl()

  const handleLogout = () => {
    analytics.logout()
    clearAuth()
    router.push('/login')
  }

  const handleLocaleToggle = () => {
    setLocale(locale === 'es-MX' ? 'en-US' : 'es-MX')
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

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLocaleToggle}
          aria-label={locale === 'es-MX' ? t('switchToEnglish') : t('switchToSpanish')}
        >
          {locale === 'es-MX' ? 'EN' : 'ES'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLogout} aria-label={t('logout')}>
          {t('logout')}
        </Button>
      </div>
    </header>
  )
}
