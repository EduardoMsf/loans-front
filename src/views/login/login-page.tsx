import Link from 'next/link'
import { Card } from '@shared/ui/card/card'
import { LoginForm } from '@features/auth/login-form/login-form'

export function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div
          className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-[2px] bg-amber-500 [font-family:var(--font-mono)] font-bold text-[#0c0c0a]"
          aria-hidden="true"
        >
          LP
        </div>
        <h1 className="text-xl font-semibold text-[color:var(--color-text-primary)]">Bienvenido</h1>
        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
          Ingresa a tu portal de inversiones
        </p>
      </div>
      <LoginForm />
      <div className="mt-5 flex flex-col gap-2 text-center text-sm">
        <Link
          href="/forgot-password"
          className="text-amber-500 transition-colors hover:text-amber-400"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <p className="text-[color:var(--color-text-muted)]">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-amber-500 transition-colors hover:text-amber-400">
            Regístrate
          </Link>
        </p>
      </div>
    </Card>
  )
}
