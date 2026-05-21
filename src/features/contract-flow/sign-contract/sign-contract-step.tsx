'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContractStore } from '@shared/stores/contract.store'
import { contractService } from '@entities/contract/contract.service'
import { Button } from '@shared/ui/button/button'
import { ReAuthModal } from '@features/auth/re-auth-modal/re-auth-modal'
import { analytics } from '@shared/lib/analytics'

export function SignContractStep() {
  const [modalOpen, setModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    selectedProduct,
    debitAccount,
    creditAccount,
    clientInfo,
    setSignatureToken,
    nextStep,
    prevStep,
  } = useContractStore()
  const queryClient = useQueryClient()

  const { mutateAsync: submitContract, isPending } = useMutation({
    mutationFn: (signatureToken: string) =>
      contractService.create({
        productId: selectedProduct!.id,
        debitAccountId: debitAccount!.id,
        creditAccountId: creditAccount!.id,
        amount: selectedProduct!.minAmount,
        clientInfo: clientInfo!,
        signatureToken,
      }),
  })

  const handleSignSuccess = async (token: string) => {
    setSubmitError(null)
    setSignatureToken(token)
    try {
      const contract = await submitContract(token)
      analytics.contractSigned({
        transactionId: contract.folio,
        productName: selectedProduct!.name,
        amount: selectedProduct!.minAmount,
        currency: selectedProduct!.currency,
      })
      setModalOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['contracts'] })
      nextStep()
    } catch {
      setSubmitError('Error al procesar la firma. Intenta de nuevo.')
    }
  }

  const rows = [
    { label: 'Producto', value: selectedProduct?.name },
    {
      label: 'Monto mínimo',
      value: `$${selectedProduct?.minAmount.toLocaleString('es-MX')} ${selectedProduct?.currency}`,
    },
    { label: 'Cuenta de cargo', value: `**** ${debitAccount?.lastFour}` },
    { label: 'Cuenta de abono', value: `**** ${creditAccount?.lastFour}` },
    { label: 'Titular', value: clientInfo?.fullName },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          Firma tu solicitud
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
          Revisa el resumen y confirma con tu contraseña
        </p>
      </div>

      {/* Summary */}
      <div
        className="divide-y rounded-[2px] border text-sm"
        style={{
          background: 'var(--color-elevated)',
          borderColor: 'var(--color-border)',
        }}
      >
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between px-4 py-3"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <span className="[font-family:var(--font-mono)] text-[10px] tracking-[0.1em] text-[color:var(--color-text-muted)] uppercase">
              {label}
            </span>
            <span className="font-medium text-[color:var(--color-text-primary)]">{value}</span>
          </div>
        ))}
      </div>

      {submitError && (
        <p role="alert" className="text-center text-sm text-red-400">
          {submitError}
        </p>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={prevStep} disabled={isPending}>
          ← Atrás
        </Button>
        <Button onClick={() => setModalOpen(true)} loading={isPending}>
          Firmar solicitud
        </Button>
      </div>

      <ReAuthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleSignSuccess}
      />
    </div>
  )
}
