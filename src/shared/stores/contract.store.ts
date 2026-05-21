import { create } from 'zustand'
import type { Product } from '@entities/product/product.types'
import type { Account } from '@entities/account/account.types'

export type ContractStep = 1 | 2 | 3 | 4 | 5 | 6

export interface ClientInfo {
  fullName: string
  rfc: string
  phone: string
  email: string
  address: string
  investmentPurpose: string
}

interface ContractWizardState {
  currentStep: ContractStep
  selectedProduct: Product | null
  debitAccount: Account | null
  creditAccount: Account | null
  clientInfo: ClientInfo | null
  signatureToken: string | null
  isCompleted: boolean

  setStep: (step: ContractStep) => void
  nextStep: () => void
  prevStep: () => void
  setProduct: (product: Product) => void
  setDebitAccount: (account: Account) => void
  setCreditAccount: (account: Account) => void
  setClientInfo: (info: ClientInfo) => void
  setSignatureToken: (token: string) => void
  reset: () => void
}

const initialState = {
  currentStep: 1 as ContractStep,
  selectedProduct: null,
  debitAccount: null,
  creditAccount: null,
  clientInfo: null,
  signatureToken: null,
  isCompleted: false,
}

export const useContractStore = create<ContractWizardState>()((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => {
    const next = Math.min(get().currentStep + 1, 6) as ContractStep
    set({ currentStep: next })
  },
  prevStep: () => {
    const prev = Math.max(get().currentStep - 1, 1) as ContractStep
    set({ currentStep: prev })
  },
  setProduct: (product) => set({ selectedProduct: product }),
  setDebitAccount: (account) => set({ debitAccount: account }),
  setCreditAccount: (account) => set({ creditAccount: account }),
  setClientInfo: (info) => set({ clientInfo: info }),
  setSignatureToken: (token) => set({ signatureToken: token }),
  reset: () => set(initialState),
}))
