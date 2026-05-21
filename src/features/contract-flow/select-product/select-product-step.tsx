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
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          Elige tu producto de inversión
        </h2>
        <p
          className="mt-1 text-sm text-[color:var(--color-text-secondary)]"
          id="product-group-desc"
        >
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
                  'sweep-top flex flex-col gap-2 rounded-[2px] border-2 p-4 text-left transition-all duration-200',
                  'focus:ring-1 focus:ring-amber-500 focus:outline-none',
                  isSelected
                    ? 'border-amber-500 bg-amber-500/5'
                    : 'border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:border-amber-500/40 hover:bg-[color:var(--color-elevated)]',
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
                <p className="font-semibold text-[color:var(--color-text-primary)]">
                  {product.name}
                </p>
                <p className="text-xs text-[color:var(--color-text-secondary)]">
                  {product.description}
                </p>
                <p className="[font-family:var(--font-mono)] text-[11px] tracking-[0.05em] text-amber-500">
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
