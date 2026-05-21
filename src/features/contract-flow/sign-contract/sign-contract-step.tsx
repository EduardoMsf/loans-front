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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Firma tu solicitud
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Revisa el resumen y confirma con tu contraseña
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Producto</span>
          <span className="font-medium dark:text-gray-200">{selectedProduct?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Monto mínimo</span>
          <span className="font-medium dark:text-gray-200">
            ${selectedProduct?.minAmount.toLocaleString('es-MX')} {selectedProduct?.currency}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Cuenta de cargo</span>
          <span className="font-medium dark:text-gray-200">**** {debitAccount?.lastFour}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Cuenta de abono</span>
          <span className="font-medium dark:text-gray-200">**** {creditAccount?.lastFour}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Titular</span>
          <span className="font-medium dark:text-gray-200">{clientInfo?.fullName}</span>
        </div>
      </div>

      {submitError && (
        <p role="alert" className="text-center text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex justify-between">
        <Button variant="secondary" onClick={prevStep} disabled={isPending}>
          ← Atrás
        </Button>
        <Button onClick={() => setModalOpen(true)} loading={isPending}>
          🔒 Firmar solicitud
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
