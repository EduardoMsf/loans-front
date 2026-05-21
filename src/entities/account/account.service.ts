import { env } from '@shared/config/env'
import { apiClient } from '@shared/api/client'
import { mockAccounts } from '@shared/api/mocks'
import type { Account } from './account.types'

export const accountService = {
  async getAll(): Promise<Account[]> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 300))
      return mockAccounts
    }
    const { data } = await apiClient.get<{ data: Account[] }>('/accounts')
    return data.data
  },
}
