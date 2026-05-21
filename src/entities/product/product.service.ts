import { env } from '@shared/config/env'
import { apiClient } from '@shared/api/client'
import { mockProducts } from '@shared/api/mocks'
import type { Product } from './product.types'

type RawProduct = Omit<Product, 'minAmount' | 'annualReturn'> & {
  minAmount: string | number
  annualReturn: string | number
}

function normalize(p: RawProduct): Product {
  return { ...p, minAmount: Number(p.minAmount), annualReturn: Number(p.annualReturn) }
}

export const productService = {
  async getAll(): Promise<Product[]> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 400))
      return mockProducts
    }
    const { data } = await apiClient.get<{ data: RawProduct[] }>('/products')
    return data.data.map(normalize)
  },

  async getById(id: string): Promise<Product> {
    if (env.useMocks) {
      await new Promise((r) => setTimeout(r, 300))
      const product = mockProducts.find((p) => p.id === id)
      if (!product) throw new Error('Product not found')
      return product
    }
    const { data } = await apiClient.get<{ data: RawProduct }>(`/products/${id}`)
    return normalize(data.data)
  },
}
