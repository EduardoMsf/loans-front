'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import enUS from './messages/en-US.json'
import esMX from './messages/es-MX.json'

export type Locale = 'es-MX' | 'en-US'
export const locales: Locale[] = ['es-MX', 'en-US']
export const defaultLocale: Locale = 'es-MX'

const messages: Record<Locale, Record<string, string>> = {
  'es-MX': esMX,
  'en-US': enUS,
}

const STORAGE_KEY = 'locale'

function getBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return defaultLocale

  const language = navigator.language

  if (language.toLowerCase().startsWith('en')) return 'en-US'
  if (language.toLowerCase().startsWith('es')) return 'es-MX'

  return defaultLocale
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale

  const storedLocale = window.localStorage.getItem(STORAGE_KEY) as Locale | null
  if (storedLocale && locales.includes(storedLocale)) return storedLocale

  return getBrowserLocale()
}

function translate(locale: Locale, key: string) {
  return messages[locale][key] ?? messages[defaultLocale][key] ?? key
}

interface IntlContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const IntlContext = createContext<IntlContextValue | undefined>(undefined)

export function IntlProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Sync with client-side preference after hydration — must differ from server's defaultLocale
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(getInitialLocale())
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string) => translate(locale, key),
    }),
    [locale],
  )

  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>
}

export function useIntl() {
  const context = useContext(IntlContext)

  if (!context) {
    throw new Error('useIntl must be used inside an IntlProvider')
  }

  return context
}
