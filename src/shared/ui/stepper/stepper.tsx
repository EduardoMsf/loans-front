import { cn } from '@shared/lib/cn'

interface Step {
  label: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <nav aria-label="Progreso de contratación">
      <ol className="flex items-center" role="list">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          const statusLabel = isCompleted
            ? `Paso ${stepNumber}: ${step.label} — completado`
            : isCurrent
              ? `Paso ${stepNumber}: ${step.label} — actual`
              : `Paso ${stepNumber}: ${step.label} — pendiente`

          return (
            <li
              key={step.label}
              className={cn('flex items-center', index < steps.length - 1 && 'flex-1')}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  aria-hidden="true"
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-[2px] text-sm font-semibold transition-colors duration-200',
                    '[font-family:var(--font-mono)]',
                    isCompleted && 'bg-amber-500 text-[#0c0c0a]',
                    isCurrent && 'border border-amber-500 text-amber-500',
                    !isCompleted &&
                      !isCurrent &&
                      'border border-[color:var(--color-border)] text-[color:var(--color-text-muted)]',
                  )}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    '[font-family:var(--font-mono)] text-[10px] tracking-[0.08em] uppercase',
                    isCurrent
                      ? 'text-amber-500'
                      : isCompleted
                        ? 'text-[color:var(--color-text-secondary)]'
                        : 'text-[color:var(--color-text-muted)]',
                  )}
                >
                  <span className="sr-only">{statusLabel} — </span>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className={cn(
                    'mx-2 mb-5 h-px flex-1 transition-colors duration-200',
                    isCompleted ? 'bg-amber-500' : 'bg-[color:var(--color-border)]',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
