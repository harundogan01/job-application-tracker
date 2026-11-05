import type { ComponentProps } from 'react'
import { fieldClassName } from '@/components/ui/field-styles'
import { cn } from '@/lib/utils'

type SelectProps = ComponentProps<'select'> & {
  options: readonly { value: string; label: string }[]
  placeholder?: string
}

/** Tarayıcının yerel <select> elemanı. Erişilebilir ve mobilde de iyi çalışır. */
export function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <select className={cn(fieldClassName, 'h-10 pr-8', className)} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
