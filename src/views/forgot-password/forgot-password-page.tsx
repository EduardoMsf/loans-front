'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Card } from '@shared/ui/card/card'
import { Input } from '@shared/ui/input/input'
import { Button } from '@shared/ui/button/button'
import { authService } from '@features/auth/auth.service'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    try {
      await authService.forgotPassword(values.email)
      setSuccess(true)
    } catch {
      setServerError('Error al enviar el correo. Intenta de nuevo.')
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-sm text-center">
        <p className="mb-3 text-4xl">📧</p>
        <h2 className="text-lg font-semibold text-gray-900">Revisa tu correo</h2>
        <p className="mt-1 text-sm text-gray-500">
          Te enviamos las instrucciones para restablecer tu contraseña.
        </p>
        <Link href="/login" className="mt-4 block text-sm text-indigo-600 hover:underline">
          Volver al login
        </Link>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <h1 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        ¿Olvidaste tu contraseña?
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Ingresa tu email y te enviaremos las instrucciones.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        {serverError && (
          <p role="alert" className="text-sm text-red-600">
            {serverError}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="w-full">
          Enviar instrucciones
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/login" className="text-indigo-600 hover:underline">
          Volver al login
        </Link>
      </p>
    </Card>
  )
}
