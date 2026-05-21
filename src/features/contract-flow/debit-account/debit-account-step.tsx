'use client'

import { useQuery } from '@tanstack/react-query'
import { accountService } from '@entities/account/account.service'
import { useContractStore } from '@shared/stores/contract.store'
import { Button } from '@shared/ui/button/button'
import { Spinner } from '@shared/ui/spinner/spinner'
import { cn } from '@shared/lib/cn'
import { analytics } from '@shared/lib/analytics'
import type { Account } from '@entities/account/account.types'

export function DebitAccountStep() {
  const { debitAccount, setDebitAccount, nextStep, prevStep } = useContractStore()
  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => accountService.getAll(),
  })

  const debitAccounts = accounts?.filter((a) => a.type === 'DEBIT') ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          Cuenta de cargo
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
          ¿De qué cuenta se realizará el cargo?
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner label="Cargando cuentas…" />
        </div>
      ) : (
        <div role="radiogroup" aria-label="Cuenta de cargo" className="space-y-3">
          {debitAccounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              selected={debitAccount?.id === account.id}
              onSelect={setDebitAccount}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={prevStep}>
          ← Atrás
        </Button>
        <Button
          onClick={() => {
            analytics.wizardStepComplete(2, 'Cuenta de cargo')
            nextStep()
          }}
          disabled={!debitAccount}
        >
          Continuar →
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
  account: Account
  selected: boolean
  onSelect: (a: Account) => void
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
