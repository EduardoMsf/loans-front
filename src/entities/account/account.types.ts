export type AccountType = 'DEBIT' | 'CREDIT'

export interface Account {
  id: string
  label: string
  bank: string
  clabe: string
  lastFour: string
  type: AccountType
  balance: number
  currency: string
}
