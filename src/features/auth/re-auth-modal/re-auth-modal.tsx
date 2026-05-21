'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Modal } from '@shared/ui/modal/modal'
import { Input } from '@shared/ui/input/input'
import { Button } from '@shared/ui/button/button'
import { useAuthStore } from '@shared/stores/auth.store'
import { authService } from '../auth.service'

const schema = z.object({
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

type FormValues = z.infer<typeof schema>

interface ReAuthModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (signatureToken: string) => void
}

export function ReAuthModal({ open, onClose, onSuccess }: ReAuthModalProps) {
  const { user } = useAuthStore()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    try {
      const { signatureToken } = await authService.reAuthenticate({
        email: user?.email ?? '',
        password: values.password,
      })
      reset()
      onSuccess(signatureToken)
    } catch {
      setServerError('Contraseña incorrecta. Intenta de nuevo.')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Confirma tu identidad">
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Para firmar el contrato, ingresa tu contraseña de acceso.
      </p>
      <p className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-100">{user?.email}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          autoFocus
          {...register('password')}
        />
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Confirmar firma
          </Button>
        </div>
      </form>
    </Modal>
  )
}
