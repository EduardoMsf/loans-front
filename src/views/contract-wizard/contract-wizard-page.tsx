'use client'

import { useContractStore } from '@shared/stores/contract.store'
import { Card } from '@shared/ui/card/card'
import { Stepper } from '@shared/ui/stepper/stepper'
import { SelectProductStep } from '@features/contract-flow/select-product/select-product-step'
import { DebitAccountStep } from '@features/contract-flow/debit-account/debit-account-step'
import { CreditAccountStep } from '@features/contract-flow/credit-account/credit-account-step'
import { ClientInfoStep } from '@features/contract-flow/client-info/client-info-step'
import { SignContractStep } from '@features/contract-flow/sign-contract/sign-contract-step'
import { SuccessStep } from '@features/contract-flow/success/success-step'

const STEPS = [
  { label: 'Producto' },
  { label: 'Cta. Cargo' },
  { label: 'Cta. Abono' },
  { label: 'Tus datos' },
  { label: 'Firma' },
  { label: '¡Listo!' },
]

export function ContractWizardPage() {
  const { currentStep } = useContractStore()

  return (
    <section aria-label="Flujo de nueva contratación" className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Nueva contratación
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Sigue los pasos para contratar tu producto de inversión
        </p>
      </div>

      <Card>
        <Stepper steps={STEPS} currentStep={currentStep} />
      </Card>

      <Card>
        {currentStep === 1 && <SelectProductStep />}
        {currentStep === 2 && <DebitAccountStep />}
        {currentStep === 3 && <CreditAccountStep />}
        {currentStep === 4 && <ClientInfoStep />}
        {currentStep === 5 && <SignContractStep />}
        {currentStep === 6 && <SuccessStep />}
      </Card>
    </section>
  )
}
