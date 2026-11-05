import type { ComponentProps } from 'react'
import { fieldClassName } from '@/components/ui/field-styles'
import { cn } from '@/lib/utils'

/**
 * React 19'da "ref" normal bir prop gibi geçilebiliyor, forwardRef gerekmiyor.
 * React Hook Form'un register() fonksiyonu ref döndürdüğü için bu önemli:
 *   <Input {...register('email')} />
 */
export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(fieldClassName, 'h-10', className)} {...props} />
}
