import type { ComponentProps } from 'react'
import { fieldClassName } from '@/components/ui/field-styles'
import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea className={cn(fieldClassName, 'min-h-24', className)} {...props} />
  )
}
