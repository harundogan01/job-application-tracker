import { toast } from 'sonner'
import { Select } from '@/components/ui/Select'
import { STATUS_META, STATUS_OPTIONS } from '@/features/applications/constants'
import { useUpdateApplicationStatus } from '@/features/applications/hooks/useApplications'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '@/features/applications/types'
import { getErrorMessage } from '@/lib/errors'

/**
 * Detay sayfasında durumu hızlıca değiştirmek için.
 * Değişiklik "optimistic" olarak anında görünür (bkz. useUpdateApplicationStatus).
 */
export function StatusSelect({ application }: { application: Application }) {
  const updateStatus = useUpdateApplicationStatus()

  const handleChange = (value: string) => {
    if (!APPLICATION_STATUSES.includes(value as ApplicationStatus)) return
    const status = value as ApplicationStatus

    updateStatus.mutate(
      { id: application.id, status },
      {
        onSuccess: () => toast.success(`Durum "${STATUS_META[status].label}" olarak güncellendi.`),
        onError: (error) => toast.error(`Durum güncellenemedi: ${getErrorMessage(error)}`),
      },
    )
  }

  return (
    <Select
      aria-label="Başvuru durumu"
      value={application.status}
      onChange={(event) => handleChange(event.target.value)}
      options={STATUS_OPTIONS}
      className="w-48"
    />
  )
}
