import Link from 'next/link'
import { Card } from '@shared/ui/card/card'
import { LoginForm } from '@features/auth/login-form/login-form'

export function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
          LP
        </div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Bienvenido</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ingresa a tu portal de inversiones
        </p>
      </div>
      <LoginForm />
      <div className="mt-4 flex flex-col gap-2 text-center text-sm">
        <Link href="/forgot-password" className="text-indigo-600 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </Card>
  )
}
