'use client'

import { useQuery } from '@tanstack/react-query'
import { contractService } from '@entities/contract/contract.service'
import { useAuthStore } from '@shared/stores/auth.store'
import { Card } from '@shared/ui/card/card'
import { Spinner } from '@shared/ui/spinner/spinner'
import { InvestmentChart } from '@widgets/investment-chart/investment-chart'
import { ContractStatusBadge } from '@entities/contract/contract-status-badge'
import { useIntl } from '@shared/i18n/intl'
import { dashboardService } from './dashboard.service'

export function DashboardPage() {
  const { user } = useAuthStore()
  const { locale, t } = useIntl()

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardService.getSummary(),
  })

  const { data: contracts, isLoading: contractsLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractService.getAll(),
  })

  const numberLocale = locale

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          {t('welcome')}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
          {t('investmentSummary')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label={t('investmentOverview')}>
        <Card className="sweep-top">
          <p className="[font-family:var(--font-mono)] text-[10px] tracking-[0.12em] text-[color:var(--color-text-muted)] uppercase">
            {t('activeContracts')}
          </p>
          <p
            className="mt-2 [font-family:var(--font-display)] text-5xl leading-none text-amber-500"
            aria-live="polite"
          >
            {summaryLoading ? '—' : (summary?.activeContracts ?? 0)}
          </p>
        </Card>
        <Card className="sweep-top">
          <p className="[font-family:var(--font-mono)] text-[10px] tracking-[0.12em] text-[color:var(--color-text-muted)] uppercase">
            {t('totalInvested')}
          </p>
          <p
            className="mt-2 [font-family:var(--font-display)] text-4xl leading-none text-[color:var(--color-text-primary)]"
            aria-live="polite"
            aria-busy={summaryLoading}
          >
            {summaryLoading ? (
              <span aria-label={t('loading')}>—</span>
            ) : (
              new Intl.NumberFormat(numberLocale, { style: 'currency', currency: 'MXN' }).format(
                summary?.totalInvested ?? 0,
              )
            )}
          </p>
        </Card>
        <Card className="sweep-top">
          <p className="[font-family:var(--font-mono)] text-[10px] tracking-[0.12em] text-[color:var(--color-text-muted)] uppercase">
            {t('estimatedYield')}
          </p>
          <p className="mt-2 [font-family:var(--font-display)] text-5xl leading-none text-amber-500">
            {summaryLoading ? '—' : `+${summary?.avgAnnualReturn ?? 0}%`}
          </p>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <h2 className="mb-4 [font-family:var(--font-mono)] text-[10px] tracking-[0.2em] text-[color:var(--color-text-muted)] uppercase">
          {t('investmentEvolution')}
        </h2>
        <InvestmentChart />
      </Card>

      {/* Recent contracts */}
      <Card>
        <h2 className="mb-4 [font-family:var(--font-mono)] text-[10px] tracking-[0.2em] text-[color:var(--color-text-muted)] uppercase">
          {t('recentContracts')}
        </h2>
        <div aria-live="polite" aria-busy={contractsLoading}>
          {contractsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner label={t('loadingContracts')} />
            </div>
          ) : (
            <div
              className="divide-y"
              style={
                {
                  borderColor: 'var(--color-border)',
                  '--divide-color': 'var(--color-border)',
                } as React.CSSProperties
              }
            >
              {(contracts ?? []).slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-3 transition-colors duration-200 hover:bg-amber-500/5"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div>
                    <p className="text-sm font-medium text-[color:var(--color-text-primary)]">
                      {c.product.name}
                    </p>
                    <p className="[font-family:var(--font-mono)] text-[10px] text-[color:var(--color-text-muted)]">
                      {c.folio}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
                      {new Intl.NumberFormat(numberLocale, {
                        style: 'currency',
                        currency: 'MXN',
                      }).format(c.amount)}
                    </p>
                    <ContractStatusBadge status={c.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
