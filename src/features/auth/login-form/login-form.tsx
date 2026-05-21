'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@shared/ui/input/input'
import { Button } from '@shared/ui/button/button'
import { useAuthStore } from '@shared/stores/auth.store'
import { analytics } from '@shared/lib/analytics'
import { authService } from '../auth.service'

const schema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const { setTokens } = useAuthStore()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    try {
      const { accessToken, refreshToken } = await authService.login(values)
      setTokens(accessToken, refreshToken)
      analytics.login()
      router.push('/dashboard')
    } catch {
      setServerError('Email o contraseña incorrectos')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="ana@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      {serverError && (
        <p role="alert" className="text-center text-sm text-red-600">
          {serverError}
        </p>
      )}
      <Button type="submit" loading={isSubmitting} className="w-full">
        Iniciar sesión
      </Button>
    </form>
  )
}
