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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Cuenta de cargo</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
        'flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
        selected
          ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/30'
          : 'border-gray-200 hover:border-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-700',
      )}
    >
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">{account.label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {account.bank} · **** {account.lastFour}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          ${account.balance.toLocaleString('es-MX')}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{account.currency}</p>
      </div>
    </button>
  )
}
