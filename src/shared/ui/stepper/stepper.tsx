'use client'

import { cn } from '@shared/lib/cn'
import { useIntl } from '@shared/i18n/intl'

interface Step {
  label: string
  description?: string
}

interface StepperProps {
  readonly steps: readonly Step[]
  readonly currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  const { t } = useIntl()

  return (
    <nav aria-label={t('wizardProgress')}>
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          let status = t('pending')

          if (isCompleted) {
            status = t('completed')
          } else if (isCurrent) {
            status = t('current')
          }

          const statusLabel = `${t('step')} ${stepNumber}: ${step.label} — ${status}`
          let labelColorClass = 'text-(--color-text-muted)'

          if (isCurrent) {
            labelColorClass = 'text-amber-500'
          } else if (isCompleted) {
            labelColorClass = 'text-(--color-text-secondary)'
          }

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
                    'flex h-8 w-8 items-center justify-center rounded-xs text-sm font-semibold transition-colors duration-200',
                    'font-mono',
                    isCompleted && 'bg-amber-500 text-[#0c0c0a]',
                    isCurrent && 'border border-amber-500 text-amber-500',
                    !isCompleted &&
                      !isCurrent &&
                      'border border-(--color-border) text-(--color-text-muted)',
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
                    'font-mono text-[10px] tracking-[0.08em] uppercase',
                    labelColorClass,
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
                    isCompleted ? 'bg-amber-500' : 'bg-(--color-border)',
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
