import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type FormStepsProps = {
  steps: readonly { title: string }[]
  current: number
  /** Hata içeren adımların index'leri */
  errorSteps: number[]
  onStepClick: (index: number) => void
}

/** Çok adımlı formun üstündeki adım göstergesi */
export function FormSteps({ steps, current, errorSteps, onStepClick }: FormStepsProps) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isDone = index < current
        const isCurrent = index === current
        const hasError = errorSteps.includes(index)

        return (
          <li key={step.title} className="flex flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => onStepClick(index)}
              aria-current={isCurrent ? 'step' : undefined}
              className="flex cursor-pointer items-center gap-2 text-left"
            >
              <span
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-inset',
                  hasError && 'bg-red-50 text-red-700 ring-red-500 dark:bg-red-500/10 dark:text-red-300',
                  !hasError && isCurrent && 'bg-indigo-600 text-white ring-indigo-600',
                  !hasError && isDone && 'bg-indigo-50 text-indigo-700 ring-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300',
                  !hasError && !isDone && !isCurrent && 'text-gray-500 ring-gray-300 dark:ring-gray-700',
                )}
              >
                {isDone && !hasError ? <Check className="size-4" aria-hidden /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-sm font-medium sm:block',
                  isCurrent ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500',
                )}
              >
                {step.title}
              </span>
            </button>
            {index < steps.length - 1 && (
              <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" aria-hidden />
            )}
          </li>
        )
      })}
    </ol>
  )
}
