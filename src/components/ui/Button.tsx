import type { ComponentProps } from 'react'
import { Loader2 } from 'lucide-react'
import {
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from '@/components/ui/button-variants'

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  /** true iken spinner gösterir ve butonu devre dışı bırakır */
  isLoading?: boolean
}

export function Button({
  variant,
  size,
  isLoading = false,
  className,
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonVariants({ variant, size, className })}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}
