import { cn } from '@shared/lib/cn'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-amber-500/10 text-amber-500 border border-amber-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-400/40',
  error: 'bg-red-950/40 text-red-400 border border-red-500/20',
  info: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  neutral:
    'bg-[color:var(--color-ghost)] text-[color:var(--color-text-muted)] border border-[color:var(--color-border)]',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[2px] px-2 py-0.5',
        '[font-family:var(--font-mono)] text-[10px] tracking-[0.08em]',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
