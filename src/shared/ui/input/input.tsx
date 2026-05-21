import { cn } from '@shared/lib/cn'
import { forwardRef, useId, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | undefined
  hint?: string | undefined
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, required, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    const describedBy =
      [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') ||
      undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="[font-family:var(--font-mono)] text-[10px] tracking-[0.12em] text-[color:var(--color-text-muted)] uppercase"
          >
            {label}
            {required && (
              <span className="ml-1 text-amber-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'rounded-[2px] border px-3 py-2 text-sm transition-colors duration-200',
            'bg-[color:var(--color-elevated)] text-[color:var(--color-text-primary)]',
            'placeholder:text-[color:var(--color-text-muted)]',
            'focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none',
            error
              ? 'border-red-500/50 bg-red-950/20 focus:ring-red-500'
              : 'border-[color:var(--color-border)] hover:border-amber-500/30',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-[color:var(--color-text-muted)]">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
