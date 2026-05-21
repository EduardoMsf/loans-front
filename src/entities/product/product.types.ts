export type ProductType = 'FOREX' | 'FUND' | 'FIXED_INCOME' | 'EQUITY'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Product {
  id: string
  name: string
  type: ProductType
  description: string
  minAmount: number
  currency: string
  annualReturn: number
  riskLevel: RiskLevel
  icon: string
}
