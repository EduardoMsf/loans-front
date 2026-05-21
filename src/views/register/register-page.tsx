'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@shared/ui/card/card'
import { Input } from '@shared/ui/input/input'
import { Button } from '@shared/ui/button/button'
import { authService } from '@features/auth/auth.service'
import { analytics } from '@shared/lib/analytics'

const schema = z
  .object({
    name: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
      })
      analytics.signUp()
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setServerError('Error al crear la cuenta. Intenta de nuevo.')
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-sm text-center">
        <p className="mb-3 text-4xl">✅</p>
        <h2 className="text-lg font-semibold text-gray-900">¡Cuenta creada!</h2>
        <p className="mt-1 text-sm text-gray-500">Redirigiendo al login...</p>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">Crear cuenta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Nombre completo" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Contraseña"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        {serverError && (
          <p role="alert" className="text-sm text-red-600">
            {serverError}
          </p>
        )}
        <Button type="submit" loading={isSubmitting} className="w-full">
          Crear cuenta
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </Card>
  )
}
