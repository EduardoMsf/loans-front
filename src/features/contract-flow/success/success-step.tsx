'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@shared/ui/button/button'
import { useContractStore } from '@shared/stores/contract.store'

export function SuccessStep() {
  const router = useRouter()
  const { reset } = useContractStore()

  const handleGoToContracts = () => {
    reset()
    router.push('/contracts')
  }

  const handleGoToDashboard = () => {
    reset()
    router.push('/dashboard')
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-4xl dark:bg-green-900/30">
        ✅
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          ¡Solicitud enviada!
        </h2>
        <p className="mt-2 max-w-xs text-sm text-gray-500 dark:text-gray-400">
          Tu solicitud de contratación fue recibida exitosamente. Te notificaremos cuando esté
          activa.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleGoToContracts}>
          Ver mis solicitudes
        </Button>
        <Button onClick={handleGoToDashboard}>Ir al Dashboard</Button>
      </div>
    </div>
  )
}
