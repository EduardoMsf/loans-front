import { env } from '@shared/config/env'
import { apiClient } from '@shared/api/client'
import { mockContracts } from '@shared/api/mocks'
import type { Contract, CreateContractPayload } from './contract.types'

type RawContract = Omit<Contract, 'amount'> & { amount: string | number }

function normalize(c: RawContract): Contract {
  return { ...c, amount: Number(c.amount) }
}

export const contractService = {
  async getAll(): Promise<Contract[]> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 500))
      return mockContracts
    }
    const { data } = await apiClient.get<{ data: RawContract[] }>('/contracts')
    return data.data.map(normalize)
  },

  async getById(id: string): Promise<Contract> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 300))
      const contract = mockContracts.find((c) => c.id === id)
      if (!contract) throw new Error('Contract not found')
      return contract
    }
    const { data } = await apiClient.get<{ data: RawContract }>(`/contracts/${id}`)
    return normalize(data.data)
  },

  async create(payload: CreateContractPayload): Promise<Contract> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 800))
      const { mockProducts, mockAccounts } = await import('@shared/api/mocks')
      const product = mockProducts.find((p) => p.id === payload.productId)
      const debit = mockAccounts.find((a) => a.id === payload.debitAccountId)
      const credit = mockAccounts.find((a) => a.id === payload.creditAccountId)
      const newContract: Contract = {
        id: `cnt-${Date.now()}`,
        folio: `FLX-2025-${String(mockContracts.length + 1).padStart(3, '0')}`,
        userId: 'u-001',
        productId: payload.productId,
        debitAccountId: payload.debitAccountId,
        creditAccountId: payload.creditAccountId,
        status: 'ACTIVE',
        amount: payload.amount,
        currency: product?.currency ?? 'MXN',
        signedAt: new Date().toISOString(),
        clientInfo: payload.clientInfo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        product: {
          name: product?.name ?? 'Producto',
          type: product?.type ?? 'FOREX',
          icon: product?.icon ?? '📈',
        },
        debitAccount: { label: debit?.label ?? '', lastFour: debit?.lastFour ?? '' },
        creditAccount: { label: credit?.label ?? '', lastFour: credit?.lastFour ?? '' },
      }
      mockContracts.push(newContract)
      return newContract
    }
    const { data } = await apiClient.post<{ data: RawContract }>('/contracts', payload)
    return normalize(data.data)
  },
}
