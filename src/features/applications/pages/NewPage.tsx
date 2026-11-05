import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { PageHeader } from '@/components/ui/PageHeader'
import { ApplicationForm } from '@/features/applications/components/ApplicationForm'
import { useCreateApplication } from '@/features/applications/hooks/useApplications'
import { emptyApplicationForm } from '@/features/applications/schemas'
import type { ApplicationInput } from '@/features/applications/types'

export default function NewPage() {
  const navigate = useNavigate()
  const createApplication = useCreateApplication()

  const handleSubmit = async (input: ApplicationInput) => {
    // mutateAsync, mutate'in Promise döndüren hali. Hata olursa fırlatır,
    // form da bu hatayı yakalayıp ekranda gösterir.
    const created = await createApplication.mutateAsync(input)
    toast.success(`${created.company} başvurusu eklendi.`)
    navigate(`/applications/${created.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Yeni başvuru" description="Takip etmek istediğin ilanın bilgilerini gir." />
      <ApplicationForm
        // Fonksiyon her render'da yeni bir nesne üretir ama useForm
        // defaultValues'u sadece ilk render'da kullanır; sorun olmaz.
        defaultValues={emptyApplicationForm()}
        submitLabel="Başvuruyu kaydet"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/applications')}
      />
    </div>
  )
}
