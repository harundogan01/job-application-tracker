import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Class isimlerini birleştirir ve çakışan Tailwind class'larını temizler.
 * Örn: cn('px-2', isActive && 'px-4') → 'px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
