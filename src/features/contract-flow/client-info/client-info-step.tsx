'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useContractStore, type ClientInfo } from '@shared/stores/contract.store'
import { useAuthStore } from '@shared/stores/auth.store'
import { Input } from '@shared/ui/input/input'
import { Button } from '@shared/ui/button/button'
import { analytics } from '@shared/lib/analytics'

const schema = z.object({
  fullName: z.string().min(3),
  rfc: z.string().length(13, 'RFC debe tener 13 caracteres'),
  phone: z.string().min(10),
  email: z.string().email(),
  address: z.string().min(10),
  investmentPurpose: z.string().min(5),
})

type FormValues = z.infer<typeof schema>

export function ClientInfoStep() {
  const { user } = useAuthStore()
  const { clientInfo, setClientInfo, nextStep, prevStep } = useContractStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: clientInfo?.fullName ?? user?.name ?? '',
      email: clientInfo?.email ?? user?.email ?? '',
      rfc: clientInfo?.rfc ?? '',
      phone: clientInfo?.phone ?? '',
      address: clientInfo?.address ?? '',
      investmentPurpose: clientInfo?.investmentPurpose ?? '',
    },
  })

  const onSubmit = (values: FormValues) => {
    setClientInfo(values as ClientInfo)
    analytics.wizardStepComplete(4, 'Información del cliente')
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Información del cliente
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Confirma tus datos personales
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nombre completo" error={errors.fullName?.message} {...register('fullName')} />
        <Input
          label="RFC"
          error={errors.rfc?.message}
          placeholder="GAAN850101ABC"
          {...register('rfc')}
        />
        <Input label="Teléfono" error={errors.phone?.message} {...register('phone')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <div className="sm:col-span-2">
          <Input label="Domicilio" error={errors.address?.message} {...register('address')} />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Propósito de inversión"
            error={errors.investmentPurpose?.message}
            placeholder="Ahorro a largo plazo, retiro, etc."
            {...register('investmentPurpose')}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={prevStep}>
          ← Atrás
        </Button>
        <Button type="submit">Continuar →</Button>
      </div>
    </form>
  )
}
