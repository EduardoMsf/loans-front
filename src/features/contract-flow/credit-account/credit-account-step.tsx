'use client'

import { useQuery } from '@tanstack/react-query'
import { accountService } from '@entities/account/account.service'
import { useContractStore } from '@shared/stores/contract.store'
import { Button } from '@shared/ui/button/button'
import { Spinner } from '@shared/ui/spinner/spinner'
import { cn } from '@shared/lib/cn'
import { analytics } from '@shared/lib/analytics'
import { useIntl } from '@shared/i18n/intl'
import type { Account } from '@entities/account/account.types'

export function CreditAccountStep() {
  const { t } = useIntl()
  const { creditAccount, setCreditAccount, nextStep, prevStep } = useContractStore()
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAll(),
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t('creditAccountTitle')}
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
          {t('creditAccountDescription')}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner label={t('loadingAccounts')} />
        </div>
      ) : (
        <div role="radiogroup" aria-label={t('creditAccountTitle')} className="space-y-3">
          {(accounts ?? []).map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              selected={creditAccount?.id === account.id}
              onSelect={setCreditAccount}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={prevStep}>
          ← {t('back')}
        </Button>
        <Button
          onClick={() => {
            analytics.wizardStepComplete(3, t('creditAccountTitle'))
            nextStep()
          }}
          disabled={!creditAccount}
        >
          {t('continue')} →
        </Button>
      </div>
    </div>
  )
}

function AccountCard({
  account,
  selected,
  onSelect,
}: {
  readonly account: Account
  readonly selected: boolean
  readonly onSelect: (a: Account) => void
}) {
  return (
    <button
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(account)}
      className={cn(
        'sweep-left flex w-full items-center justify-between rounded-[2px] border-2 p-4 text-left',
        'transition-all duration-200 focus:ring-1 focus:ring-amber-500 focus:outline-none',
        selected
          ? 'border-amber-500 bg-amber-500/5'
          : 'border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-amber-500/40',
      )}
    >
      <div className="relative z-10">
        <p className="font-medium text-[color:var(--color-text-primary)]">{account.label}</p>
        <p className="[font-family:var(--font-mono)] text-[10px] text-[color:var(--color-text-muted)]">
          {account.bank} · **** {account.lastFour}
        </p>
      </div>
      <div className="relative z-10 text-right">
        <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">
          ${account.balance.toLocaleString('es-MX')}
        </p>
        <p className="[font-family:var(--font-mono)] text-[10px] text-[color:var(--color-text-muted)]">
          {account.currency}
        </p>
      </div>
    </button>
  )
}
