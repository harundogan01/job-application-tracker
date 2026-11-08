import { cn } from '@/lib/utils'

/** Input, Textarea ve Select'in ortak görünümü */
export const fieldClassName = cn(
  'block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset',
  'placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none',
  'aria-invalid:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60',
  'dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700 dark:focus:ring-indigo-500',
)
