'use client'

import { useQuery } from '@tanstack/react-query'
import { productService } from '@entities/product/product.service'
import { useContractStore } from '@shared/stores/contract.store'
import { Button } from '@shared/ui/button/button'
import { Badge } from '@shared/ui/badge/badge'
import { Spinner } from '@shared/ui/spinner/spinner'
import { cn } from '@shared/lib/cn'
import { analytics } from '@shared/lib/analytics'
import type { Product } from '@entities/product/product.types'

const riskVariant = {
  LOW: 'success' as const,
  MEDIUM: 'warning' as const,
  HIGH: 'error' as const,
}

const riskLabel = { LOW: 'bajo', MEDIUM: 'medio', HIGH: 'alto' }

export function SelectProductStep() {
  const { selectedProduct, setProduct, nextStep } = useContractStore()
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  })

  const handleSelect = (product: Product) => {
    setProduct(product)
    analytics.productSelected(product.name, product.riskLevel)
  }

  const handleContinue = () => {
    analytics.wizardStart()
    nextStep()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Elige tu producto de inversión
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400" id="product-group-desc">
          Selecciona el producto que deseas contratar
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner label="Cargando productos…" />
        </div>
      ) : (
        <div
          role="radiogroup"
          aria-labelledby="product-group-desc"
          className="grid gap-3 sm:grid-cols-2"
        >
          {(products ?? []).map((product) => {
            const isSelected = selectedProduct?.id === product.id
            return (
              <button
                key={product.id}
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(product)}
                className={cn(
                  'flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none',
                  'hover:border-indigo-300 hover:bg-indigo-50 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/20',
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/30'
                    : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
                )}
              >
                <div className="flex items-center justify-between">
                  <span aria-hidden="true" className="text-2xl">
                    {product.icon}
                  </span>
                  <Badge variant={riskVariant[product.riskLevel]}>
                    Riesgo {riskLabel[product.riskLevel]}
                  </Badge>
                </div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{product.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{product.description}</p>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Rendimiento estimado: {product.annualReturn}% anual
                </p>
              </button>
            )
          })}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedProduct}
          aria-label={selectedProduct ? `Continuar con ${selectedProduct.name}` : 'Continuar'}
        >
          Continuar →
        </Button>
      </div>
    </div>
  )
}
