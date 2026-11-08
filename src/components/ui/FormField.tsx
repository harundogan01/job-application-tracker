import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** FormField'ın, içindeki alana verdiği erişilebilirlik özellikleri */
export type FieldA11yProps = {
  id: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

type FormFieldProps = {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  /**
   * Render prop: children bir fonksiyon. FormField ürettiği id ve aria
   * özelliklerini bu fonksiyona verir, sen de bunları alana yayarsın:
   *
   *   <FormField label="E-posta" error={errors.email?.message}>
   *     {(field) => <Input {...field} {...register('email')} />}
   *   </FormField>
   *
   * Vue'daki "scoped slot" (<template #default="{ field }">) ile aynı fikir.
   */
  children: (field: FieldA11yProps) => ReactNode
}

export function FormField({
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': message ? messageId : undefined,
      })}
      {message && (
        <p
          id={messageId}
          className={cn(
            'text-xs',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500',
          )}
        >
          {message}
        </p>
      )}
    </div>
  )
}
