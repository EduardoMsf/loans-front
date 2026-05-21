'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { contractService } from '@entities/contract/contract.service'
import { ContractStatusBadge } from '@entities/contract/contract-status-badge'
import { Card } from '@shared/ui/card/card'
import { Button } from '@shared/ui/button/button'
import { Spinner } from '@shared/ui/spinner/spinner'
import { useIntl } from '@shared/i18n/intl'

export function ContractsPage() {
  const router = useRouter()
  const { locale, t } = useIntl()
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractService.getAll(),
  })

  const numberLocale = locale
  const dateLocale = locale

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
            {t('myRequests')}
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            {t('contractHistory')}
          </p>
        </div>
        <Button onClick={() => router.push('/contracts/new')}>{t('newContract')}</Button>
      </div>

      <Card padding="none">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label={t('contractHistory')}>
              <caption className="sr-only">{t('contractHistoryCaption')}</caption>
              <thead>
                <tr
                  className="border-b"
                  style={{
                    background: 'var(--color-elevated)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  {[t('folio'), t('product'), t('amount'), t('status'), t('date')].map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-6 py-3 text-left [font-family:var(--font-mono)] text-[10px] tracking-[0.15em] text-[color:var(--color-text-muted)] uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(contracts ?? []).map((c) => (
                  <tr
                    key={c.id}
                    className="border-b transition-colors duration-200 hover:bg-amber-500/5"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <td className="px-6 py-4 [font-family:var(--font-mono)] text-xs text-[color:var(--color-text-muted)]">
                      {c.folio}
                    </td>
                    <td className="px-6 py-4 font-medium text-[color:var(--color-text-primary)]">
                      {c.product.name}
                    </td>
                    <td className="px-6 py-4 text-[color:var(--color-text-secondary)]">
                      {new Intl.NumberFormat(numberLocale, {
                        style: 'currency',
                        currency: 'MXN',
                      }).format(c.amount)}{' '}
                      {c.currency}
                    </td>
                    <td className="px-6 py-4">
                      <ContractStatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-[color:var(--color-text-secondary)]">
                      {new Intl.DateTimeFormat(dateLocale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }).format(new Date(c.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(contracts ?? []).length === 0 && (
              <p className="py-12 text-center text-sm text-[color:var(--color-text-muted)]">
                {t('noRequestsYet')}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
