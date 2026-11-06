import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { ApplicationForm } from '@/features/applications/components/ApplicationForm'
import { ApplicationLoadError } from '@/features/applications/components/ApplicationLoadError'
import { useApplication, useUpdateApplication } from '@/features/applications/hooks/useApplications'
import { toFormValues } from '@/features/applications/schemas'
import type { ApplicationInput } from '@/features/applications/types'

export default function EditPage() {
  // Route tanımında ":id" olduğu için burada her zaman dolu; TypeScript
  // bunu bilemediği için varsayılan değer veriyoruz.
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: application, isPending, error } = useApplication(id)
  const updateApplication = useUpdateApplication(id)

  if (isPending) return <Spinner />
  if (error) return <ApplicationLoadError error={error} />

  const handleSubmit = async (input: ApplicationInput) => {
    await updateApplication.mutateAsync(input)
    toast.success('Değişiklikler kaydedildi.')
    navigate(`/applications/${id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Başvuruyu düzenle"
        description={`${application.company} · ${application.position}`}
      />
      <ApplicationForm
        // key değişirse React bileşeni sıfırdan oluşturur. Başka bir başvuruya
        // geçildiğinde formun eski değerleri taşımaması için id'yi key yapıyoruz.
        key={application.id}
        defaultValues={toFormValues(application)}
        submitLabel="Değişiklikleri kaydet"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/applications/${id}`)}
      />
    </div>
  )
}
