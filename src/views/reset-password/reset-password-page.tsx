'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@shared/ui/card/card'
import { Input } from '@shared/ui/input/input'
import { Button } from '@shared/ui/button/button'
import { authService } from '@features/auth/auth.service'

const schema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = use(searchParams)
  const token = params.token ?? ''
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
      await authService.resetPassword(token, values.password)
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch {
      setServerError('Error al restablecer la contraseña. El enlace puede haber expirado.')
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-sm text-center">
        <p className="mb-3 text-4xl">✅</p>
        <h2 className="text-lg font-semibold text-gray-900">¡Contraseña actualizada!</h2>
        <p className="mt-1 text-sm text-gray-500">Redirigiendo al login...</p>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Nueva contraseña</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nueva contraseña"
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
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <Button type="submit" loading={isSubmitting} className="w-full">
          Actualizar contraseña
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        <Link href="/login" className="text-indigo-600 hover:underline">
          Volver al login
        </Link>
      </p>
    </Card>
  )
}
