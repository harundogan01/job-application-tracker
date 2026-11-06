import { useMemo } from 'react'
import { Link } from 'react-router'
import { Activity, Briefcase, CalendarClock, Inbox, PartyPopper, Plus, TrendingUp } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { SeedButton } from '@/features/applications/components/SeedButton'
import { StatusBadge } from '@/features/applications/components/StatusBadge'
import { INTERVIEW_TYPE_LABELS } from '@/features/applications/constants'
import { useApplications } from '@/features/applications/hooks/useApplications'
import { getApplicationStats, getUpcomingInterviews } from '@/features/applications/utils/stats'
import { useAuth } from '@/features/auth/useAuth'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { StatusBreakdown } from '@/features/dashboard/components/StatusBreakdown'
import { formatDate, formatDateTime } from '@/lib/format'

export default function DashboardPage() {
  const { user } = useAuth()
  // Liste sayfasıyla aynı sorgu: önbellekte varsa tekrar istek atılmaz
  const { data: applications, isPending } = useApplications()

  // Türetilmiş veriler. Ayrı bir state'te tutmuyoruz; veriden hesaplıyoruz.
  // "State'te tutulan her şeyin tek bir kaynağı olmalı" kuralı.
  const stats = useMemo(() => getApplicationStats(applications ?? []), [applications])
  const upcoming = useMemo(() => getUpcomingInterviews(applications ?? []), [applications])
  const recent = useMemo(
    () =>
      [...(applications ?? [])]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5),
    [applications],
  )

  const firstName = user?.fullName.split(' ')[0]

  return (
    <>
      <PageHeader
        title={firstName ? `Merhaba, ${firstName} 👋` : 'Genel bakış'}
        description="İş arama sürecinin özeti"
        actions={
          <Link to="/applications/new" className={buttonVariants()}>
            <Plus className="size-4" aria-hidden /> Yeni başvuru
          </Link>
        }
      />

      {isPending ? (
        <Spinner />
      ) : stats.total === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Takip edilecek başvuru yok"
          description="Başvuru ekledikçe istatistiklerin ve yaklaşan mülakatların burada görünecek."
          action={<SeedButton />}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Toplam başvuru" value={stats.total} icon={Briefcase} />
            <StatCard
              label="Devam eden"
              value={stats.active}
              icon={Activity}
              hint="Başvurulan ve mülakat aşamasındakiler"
            />
            <StatCard label="Teklif" value={stats.byStatus.offer} icon={PartyPopper} />
            <StatCard
              label="Geri dönüş oranı"
              value={`%${stats.responseRate}`}
              icon={TrendingUp}
              hint="Mülakat, teklif ya da ret alınanlar"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Durum dağılımı</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusBreakdown stats={stats} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yaklaşan mülakatlar</CardTitle>
                <CalendarClock className="size-5 text-gray-400" aria-hidden />
              </CardHeader>
              <CardContent>
                {upcoming.length === 0 ? (
                  <p className="text-sm text-gray-500">Planlanmış bir mülakat yok.</p>
                ) : (
                  <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                    {upcoming.map((interview) => (
                      <li key={interview.id} className="py-2.5 first:pt-0 last:pb-0">
                        <Link
                          to={`/applications/${interview.applicationId}`}
                          className="flex items-center justify-between gap-4 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{interview.company}</p>
                            <p className="truncate text-xs text-gray-500">
                              {INTERVIEW_TYPE_LABELS[interview.type]} · {interview.position}
                            </p>
                          </div>
                          <span className="shrink-0 text-sm text-gray-600 dark:text-gray-400">
                            {formatDateTime(interview.scheduledAt)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Son güncellenenler</CardTitle>
              <Link to="/applications" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                Tümünü gör
              </Link>
            </CardHeader>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {recent.map((application) => (
                <li key={application.id}>
                  <Link
                    to={`/applications/${application.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{application.company}</p>
                      <p className="truncate text-xs text-gray-500">
                        {application.position} · {formatDate(application.appliedAt)}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  )
}
