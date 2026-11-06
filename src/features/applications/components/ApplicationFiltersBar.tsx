import { LayoutGrid, List, Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { STATUS_OPTIONS } from '@/features/applications/constants'
import { SORT_OPTIONS, type ApplicationFilters } from '@/features/applications/utils/filterApplications'
import { useUiStore, type ViewMode } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

type Props = {
  filters: ApplicationFilters
  onChange: (key: 'q' | 'status' | 'sort', value: string) => void
}

const viewModes: { value: ViewMode; label: string; icon: typeof List }[] = [
  { value: 'table', label: 'Tablo görünümü', icon: List },
  { value: 'cards', label: 'Kart görünümü', icon: LayoutGrid },
]

export function ApplicationFiltersBar({ filters, onChange }: Props) {
  const viewMode = useUiStore((state) => state.viewMode)
  const setViewMode = useUiStore((state) => state.setViewMode)

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" aria-hidden />
        {/*
          Kontrollü (controlled) input: değeri her zaman URL'den gelir,
          değişiklik de URL'i günceller. Vue'daki v-model'in elle yazılmış hali:
          value + onChange.
        */}
        <Input
          type="search"
          value={filters.query}
          onChange={(event) => onChange('q', event.target.value)}
          placeholder="Şirket, pozisyon ya da konum ara…"
          aria-label="Başvurularda ara"
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <Select
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
          options={STATUS_OPTIONS}
          placeholder="Tüm durumlar"
          aria-label="Duruma göre filtrele"
          className="sm:w-44"
        />
        <Select
          value={filters.sort}
          onChange={(event) => onChange('sort', event.target.value)}
          options={SORT_OPTIONS}
          aria-label="Sıralama"
          className="sm:w-44"
        />
        <div className="hidden rounded-lg bg-gray-100 p-1 sm:flex dark:bg-gray-800" role="radiogroup" aria-label="Görünüm">
          {viewModes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={viewMode === value}
              title={label}
              onClick={() => setViewMode(value)}
              className={cn(
                'cursor-pointer rounded-md px-2 text-gray-500',
                viewMode === value && 'bg-white text-gray-900 shadow-xs dark:bg-gray-950 dark:text-gray-100',
              )}
            >
              <Icon className="size-4" aria-hidden />
              <span className="sr-only">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
