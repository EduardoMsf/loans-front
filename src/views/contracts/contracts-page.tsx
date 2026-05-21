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

  const numberLocale = locale === 'es-MX' ? 'es-MX' : 'en-US'
  const dateLocale = locale === 'es-MX' ? 'es-MX' : 'en-US'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {t('myRequests')}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('contractHistory')}</p>
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
                <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
                  >
                    {t('folio')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
                  >
                    {t('product')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
                  >
                    {t('amount')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
                  >
                    {t('status')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400"
                  >
                    {t('date')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {(contracts ?? []).map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                      {c.folio}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {c.productName}
                    </td>
                    <td className="px-6 py-4">
                      {new Intl.NumberFormat(numberLocale, {
                        style: 'currency',
                        currency: 'MXN',
                      }).format(c.amount)}{' '}
                      {c.currency}
                    </td>
                    <td className="px-6 py-4">
                      <ContractStatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
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
              <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                {t('noRequestsYet')}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
