import type { Application, ApplicationStatus } from '@/features/applications/types'

export const SORT_OPTIONS = [
  { value: 'updated', label: 'Son güncellenen' },
  { value: 'applied', label: 'Başvuru tarihi' },
  { value: 'company', label: 'Şirket adı (A-Z)' },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]['value']

export type ApplicationFilters = {
  query: string
  status: ApplicationStatus | ''
  sort: SortOption
}

const normalize = (text: string) => text.toLocaleLowerCase('tr').trim()

/**
 * Saf (pure) fonksiyon: aynı girdiye her zaman aynı çıktıyı verir, dışarıdaki
 * hiçbir şeyi değiştirmez. Bu sayede bileşenden bağımsız olarak test edilebilir
 * (bkz. filterApplications.test.ts).
 */
export function filterApplications(
  applications: Application[],
  { query, status, sort }: ApplicationFilters,
) {
  const q = normalize(query)

  const filtered = applications.filter((application) => {
    if (status && application.status !== status) return false
    if (!q) return true
    return [application.company, application.position, application.location]
      .some((field) => normalize(field).includes(q))
  })

  // sort() diziyi yerinde değiştirir; filter zaten yeni dizi döndürdüğü için güvenli
  return filtered.sort((a, b) => {
    switch (sort) {
      case 'company':
        return a.company.localeCompare(b.company, 'tr')
      case 'applied':
        // Tarihi olmayanlar (null) en sona
        return (b.appliedAt ?? '').localeCompare(a.appliedAt ?? '')
      case 'updated':
      default:
        return b.updatedAt.localeCompare(a.updatedAt)
    }
  })
}
