import { cn } from '@shared/lib/cn'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-amber-500 text-[#0c0c0a] border border-amber-500 hover:bg-transparent hover:text-amber-500 disabled:opacity-40',
  secondary:
    'bg-transparent text-[color:var(--color-text-secondary)] border border-[color:var(--color-border)] hover:border-amber-500/40 hover:text-amber-500',
  ghost:
    'bg-transparent text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-elevated)] hover:text-amber-500',
  danger:
    'bg-transparent text-red-400 border border-red-500/30 hover:border-red-400 hover:bg-red-400/10',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[0.7rem]',
  md: 'px-4 py-2 text-[0.7rem]',
  lg: 'px-6 py-3 text-[0.75rem]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[2px] font-medium transition-colors duration-200',
        '[font-family:var(--font-mono)] tracking-[0.1em] uppercase',
        'focus:ring-1 focus:ring-amber-500 focus:ring-offset-1 focus:ring-offset-[color:var(--color-bg)] focus:outline-none',
        'disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      aria-disabled={(disabled ?? loading) || undefined}
      {...props}
    >
      {loading && (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="sr-only">Cargando…</span>
        </>
      )}
      {children}
    </button>
  )
}
