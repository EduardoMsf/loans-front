'use client'

import { useQuery } from '@tanstack/react-query'
import { contractService } from '@entities/contract/contract.service'
import { useAuthStore } from '@shared/stores/auth.store'
import { Card } from '@shared/ui/card/card'
import { Spinner } from '@shared/ui/spinner/spinner'
import { InvestmentChart } from '@widgets/investment-chart/investment-chart'
import { ContractStatusBadge } from '@entities/contract/contract-status-badge'
import { useIntl } from '@shared/i18n/intl'

export function DashboardPage() {
  const { user } = useAuthStore()
  const { locale, t } = useIntl()
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractService.getAll(),
  })

  const activeContracts = contracts?.filter((c) => c.status === 'ACTIVE') ?? []

  const numberLocale = locale === 'es-MX' ? 'es-MX' : 'en-US'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {t('welcome')}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('investmentSummary')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label={t('investmentOverview')}>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('activeContracts')}</p>
          <p className="mt-1 text-3xl font-bold text-indigo-600" aria-live="polite">
            {activeContracts.length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('totalInvested')}</p>
          <p
            className="mt-1 text-3xl font-bold text-gray-900"
            aria-live="polite"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span aria-label={t('loading')}>—</span>
            ) : (
              `${new Intl.NumberFormat(numberLocale, { style: 'currency', currency: 'MXN' }).format(activeContracts.reduce((s, c) => s + c.amount, 0))}`
            )}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('estimatedYield')}</p>
          <p className="mt-1 text-3xl font-bold text-green-600">+8.4%</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
          {t('investmentEvolution')}
        </h2>
        <InvestmentChart />
      </Card>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
          {t('recentContracts')}
        </h2>
        <div aria-live="polite" aria-busy={isLoading}>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner label={t('loadingContracts')} />
            </div>
          ) : (
            <div className="space-y-3">
              {(contracts ?? []).slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {c.productName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{c.folio}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold dark:text-gray-100">
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
