import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { APPLICATION_STATUSES, type ApplicationStatus } from '@/features/applications/types'
import {
  SORT_OPTIONS,
  type ApplicationFilters,
  type SortOption,
} from '@/features/applications/utils/filterApplications'

const isStatus = (value: string | null): value is ApplicationStatus =>
  APPLICATION_STATUSES.includes(value as ApplicationStatus)

const isSort = (value: string | null): value is SortOption =>
  SORT_OPTIONS.some((option) => option.value === value)

/**
 * Filtreleri state yerine URL'de tutar: /applications?q=react&status=offer
 * Böylece sayfa yenilenince filtreler kaybolmaz, link paylaşılabilir ve
 * tarayıcının geri butonu beklendiği gibi çalışır.
 *
 * URL'den gelen değerlere güvenilmez; geçersizse varsayılan değer kullanılır.
 */
export function useApplicationFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const statusParam = searchParams.get('status')
  const sortParam = searchParams.get('sort')

  const filters = useMemo<ApplicationFilters>(
    () => ({
      query,
      status: isStatus(statusParam) ? statusParam : '',
      sort: isSort(sortParam) ? sortParam : 'updated',
    }),
    [query, statusParam, sortParam],
  )

  const setFilter = useCallback(
    (key: 'q' | 'status' | 'sort', value: string) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous)
          // Varsayılan değerleri URL'de tutmuyoruz, adres temiz kalsın
          if (!value || (key === 'sort' && value === 'updated')) next.delete(key)
          else next.set(key, value)
          return next
        },
        // Her tuş vuruşunda tarayıcı geçmişine yeni kayıt eklenmesin
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(
    () => setSearchParams({}, { replace: true }),
    [setSearchParams],
  )

  const hasActiveFilters = Boolean(filters.query || filters.status)

  return { filters, setFilter, clearFilters, hasActiveFilters }
}
