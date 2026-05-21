import type { ProductType } from '@entities/product/product.types'

export type ContractStatus =
  | 'DRAFT'
  | 'IN_PROGRESS'
  | 'PENDING_SIGN'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'REJECTED'

export interface Contract {
  id: string
  folio: string
  productId: string
  productName: string
  productType: ProductType
  status: ContractStatus
  amount: number
  currency: string
  debitAccountId: string
  creditAccountId: string
  createdAt: string
  updatedAt: string
}

export interface CreateContractPayload {
  productId: string
  debitAccountId: string
  creditAccountId: string
  amount: number
  clientInfo: {
    fullName: string
    rfc: string
    phone: string
    email: string
    address: string
    investmentPurpose: string
  }
  signatureToken: string
}
