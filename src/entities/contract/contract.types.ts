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
  userId: string
  productId: string
  debitAccountId: string
  creditAccountId: string
  status: ContractStatus
  amount: number
  currency: string
  signedAt: string | null
  clientInfo: Record<string, unknown>
  createdAt: string
  updatedAt: string
  product: {
    name: string
    type: ProductType
    icon: string
  }
  debitAccount: {
    label: string
    lastFour: string
  }
  creditAccount: {
    label: string
    lastFour: string
  }
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
