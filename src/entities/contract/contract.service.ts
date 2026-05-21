import { env } from '@shared/config/env'
import { apiClient } from '@shared/api/client'
import { mockContracts } from '@shared/api/mocks'
import type { Contract, CreateContractPayload } from './contract.types'

export const contractService = {
  async getAll(): Promise<Contract[]> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 500))
      return mockContracts
    }
    const { data } = await apiClient.get<{ data: Contract[] }>('/contracts')
    return data.data
  },

  async getById(id: string): Promise<Contract> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 300))
      const contract = mockContracts.find((c) => c.id === id)
      if (!contract) throw new Error('Contract not found')
      return contract
    }
    const { data } = await apiClient.get<{ data: Contract }>(`/contracts/${id}`)
    return data.data
  },

  async create(payload: CreateContractPayload): Promise<Contract> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 800))
      const { mockProducts } = await import('@shared/api/mocks')
      const product = mockProducts.find((p) => p.id === payload.productId)
      const newContract: Contract = {
        id: `cnt-${Date.now()}`,
        folio: `FLX-2025-${String(mockContracts.length + 1).padStart(3, '0')}`,
        productId: payload.productId,
        productName: product?.name ?? 'Producto',
        productType: product?.type ?? 'FOREX',
        status: 'ACTIVE',
        amount: payload.amount,
        currency: product?.currency ?? 'MXN',
        debitAccountId: payload.debitAccountId,
        creditAccountId: payload.creditAccountId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockContracts.push(newContract)
      return newContract
    }
    const { data } = await apiClient.post<{ data: Contract }>('/contracts', payload)
    return data.data
  },
}
