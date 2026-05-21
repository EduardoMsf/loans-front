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
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                    isCompleted && 'bg-indigo-600 text-white',
                    isCurrent && 'border-2 border-indigo-600 text-indigo-600',
                    !isCompleted &&
                      !isCurrent &&
                      'border-2 border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500',
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
                    'text-xs font-medium',
                    isCurrent
                      ? 'text-indigo-600'
                      : isCompleted
                        ? 'text-gray-600 dark:text-gray-300'
                        : 'text-gray-400 dark:text-gray-500',
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
                    'mx-2 mb-5 h-0.5 flex-1 transition-colors',
                    isCompleted ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700',
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
