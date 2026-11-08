import { useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Spinner } from '@/components/ui/Spinner'
import { ApplicationLoadError } from '@/features/applications/components/ApplicationLoadError'
import { InterviewTimeline } from '@/features/applications/components/InterviewTimeline'
import { StatusBadge } from '@/features/applications/components/StatusBadge'
import { StatusSelect } from '@/features/applications/components/StatusSelect'
import { WORK_TYPE_LABELS } from '@/features/applications/constants'
import { useApplication, useDeleteApplication } from '@/features/applications/hooks/useApplications'
import { formatDate, formatDateTime, formatSalaryRange } from '@/lib/format'
import { getErrorMessage } from '@/lib/errors'

export default function DetailsPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: application, isPending, error } = useApplication(id)
  const deleteApplication = useDeleteApplication()
  const [isDeleteOpen, setDeleteOpen] = useState(false)

  if (isPending) return <Spinner />
  if (error) return <ApplicationLoadError error={error} />

  const handleDelete = () => {
    deleteApplication.mutate(application.id, {
      onSuccess: () => {
        toast.success(`${application.company} başvurusu silindi.`)
        navigate('/applications', { replace: true })
      },
      onError: (deleteError) => {
        setDeleteOpen(false)
        toast.error(getErrorMessage(deleteError))
      },
    })
  }

  return (
    <>
      <Link
        to="/applications"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ArrowLeft className="size-4" aria-hidden /> Başvurular
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{application.company}</h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1 text-gray-500">{application.position}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusSelect application={application} />
          <Link to="edit" className={buttonVariants({ variant: 'secondary' })}>
            <Pencil className="size-4" aria-hidden /> Düzenle
          </Link>
          <Button variant="secondary" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="size-4 text-red-600" aria-hidden />
            <span className="sr-only sm:not-sr-only">Sil</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mülakatlar</CardTitle>
              <span className="text-sm text-gray-500">{application.interviews.length} görüşme</span>
            </CardHeader>
            <CardContent>
              <InterviewTimeline interviews={application.interviews} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notlar</CardTitle>
            </CardHeader>
            <CardContent>
              {application.notes ? (
                <p className="text-sm whitespace-pre-wrap">{application.notes}</p>
              ) : (
                <p className="text-sm text-gray-500">Not eklenmemiş.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Bilgiler</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4 text-sm">
              <Detail label="Başvuru tarihi">{formatDate(application.appliedAt)}</Detail>
              <Detail label="Konum">
                {application.location || '—'} · {WORK_TYPE_LABELS[application.workType]}
              </Detail>
              <Detail label="Maaş aralığı">
                {formatSalaryRange(application.salaryMin, application.salaryMax, application.currency)}
              </Detail>
              <Detail label="Kaynak">{application.source || '—'}</Detail>
              <Detail label="İlan">
                {application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 break-all text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    İlanı aç <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                ) : (
                  '—'
                )}
              </Detail>
              <Detail label="Son güncelleme">{formatDateTime(application.updatedAt)}</Detail>
            </dl>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={isDeleteOpen}
        title="Başvuru silinsin mi?"
        description={`${application.company} · ${application.position} başvurusu ve tüm mülakat notları kalıcı olarak silinecek.`}
        confirmLabel="Sil"
        isLoading={deleteApplication.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  )
}

/** Sadece bu dosyada kullanılan küçük bir yardımcı bileşen */
function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="mt-0.5 font-medium">{children}</dd>
    </div>
  )
}
