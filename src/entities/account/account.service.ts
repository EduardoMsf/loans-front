import { env } from '@shared/config/env'
import { apiClient } from '@shared/api/client'
import { mockAccounts } from '@shared/api/mocks'
import type { Account } from './account.types'

type RawAccount = Omit<Account, 'balance'> & { balance: string | number; isActive: boolean }

function normalize(a: RawAccount): Account {
  return {
    id: a.id,
    label: a.label,
    bank: a.bank,
    clabe: a.clabe,
    lastFour: a.lastFour,
    type: a.type,
    balance: Number(a.balance),
    currency: a.currency,
  }
}

export const accountService = {
  async getAll(): Promise<Account[]> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 300))
      return mockAccounts
    }
    const { data } = await apiClient.get<{ data: RawAccount[] }>('/accounts')
    return data.data.map(normalize)
  },
}
