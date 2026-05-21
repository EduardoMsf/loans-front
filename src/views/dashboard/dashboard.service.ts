import { env } from '@shared/config/env'
import { apiClient } from '@shared/api/client'
import { mockContracts } from '@shared/api/mocks'

export interface DashboardSummary {
  totalContracts: number
  activeContracts: number
  totalInvested: number
  avgAnnualReturn: number
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 400))
      const active = mockContracts.filter((c) => c.status === 'ACTIVE')
      return {
        totalContracts: mockContracts.length,
        activeContracts: active.length,
        totalInvested: active.reduce((s, c) => s + Number(c.amount), 0),
        avgAnnualReturn: 8.4,
      }
    }
    const { data } = await apiClient.get<{ data: DashboardSummary }>('/dashboard/summary')
    return data.data
  },
}
