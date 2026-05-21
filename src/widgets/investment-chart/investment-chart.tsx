'use client'

import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Spinner } from '@shared/ui/spinner/spinner'
import { format } from 'date-fns'
import { useIntl } from '@shared/i18n/intl'

interface ExchangeRateData {
  date: string
  USD: number
  EUR: number
}

async function fetchExchangeRates(): Promise<ExchangeRateData[]> {
  const res = await fetch('/api/exchange-rates')
  const json = (await res.json()) as { rates: Record<string, { USD: number; EUR: number }> }

  return Object.entries(json.rates).map(([date, rates]) => ({
    date: format(new Date(date), 'dd/MM'),
    USD: Number.parseFloat((1 / (rates.USD ?? 0.05)).toFixed(2)),
    EUR: Number.parseFloat((1 / (rates.EUR ?? 0.055)).toFixed(2)),
  }))
}

export function InvestmentChart() {
  const { t } = useIntl()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60 * 30,
  })

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )

  if (isError || !data) {
    return (
      <p className="py-8 text-center text-sm text-[color:var(--color-text-muted)]">
        {t('exchangeDataError')}
      </p>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'var(--color-text-muted)' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'var(--color-text-muted)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--color-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-primary)',
          }}
          formatter={(value) =>
            value === null || value === undefined ? ['', ''] : [`$${value} MXN`, '']
          }
        />
        <Legend
          wrapperStyle={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
          }}
        />
        <Line
          type="monotone"
          dataKey="USD"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          name="USD/MXN"
        />
        <Line
          type="monotone"
          dataKey="EUR"
          stroke="#9a9690"
          strokeWidth={2}
          dot={false}
          name="EUR/MXN"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
