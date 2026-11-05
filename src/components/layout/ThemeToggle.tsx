import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useUiStore, type Theme } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const options: { value: Theme; label: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Açık', icon: Sun },
  { value: 'dark', label: 'Koyu', icon: Moon },
  { value: 'system', label: 'Sistem', icon: Monitor },
]

export function ThemeToggle() {
  const theme = useUiStore((state) => state.theme)
  const setTheme = useUiStore((state) => state.setTheme)

  return (
    <div role="radiogroup" aria-label="Tema" className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center rounded-md py-1.5 text-gray-500 transition-colors',
            theme === value
              ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-950 dark:text-gray-100'
              : 'hover:text-gray-900 dark:hover:text-gray-100',
          )}
        >
          <Icon className="size-4" aria-hidden />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  )
}
