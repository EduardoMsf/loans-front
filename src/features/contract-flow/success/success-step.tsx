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
      <div className="flex h-16 w-16 items-center justify-center rounded-[2px] border-2 border-amber-500 bg-amber-500/10 text-amber-500">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 className="[font-family:var(--font-display)] text-4xl tracking-wide text-[color:var(--color-text-primary)]">
          Solicitud enviada
        </h2>
        <p className="mt-2 max-w-xs text-sm text-[color:var(--color-text-secondary)]">
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
