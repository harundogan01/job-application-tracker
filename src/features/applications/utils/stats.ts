import { APPLICATION_STATUSES, type Application, type ApplicationStatus, type Interview } from '@/features/applications/types'

export type ApplicationStats = {
  total: number
  byStatus: Record<ApplicationStatus, number>
  /** Başvurusu yapılmış ve henüz sonuçlanmamış olanlar */
  active: number
  /** Başvurulanlar içinde geri dönüş (mülakat, teklif ya da ret) alınanların yüzdesi */
  responseRate: number
}

export function getApplicationStats(applications: Application[]): ApplicationStats {
  const byStatus = Object.fromEntries(APPLICATION_STATUSES.map((s) => [s, 0])) as Record<
    ApplicationStatus,
    number
  >
  for (const application of applications) byStatus[application.status]++

  const submitted = applications.length - byStatus.wishlist
  const responded = byStatus.interviewing + byStatus.offer + byStatus.rejected

  return {
    total: applications.length,
    byStatus,
    active: byStatus.applied + byStatus.interviewing,
    responseRate: submitted > 0 ? Math.round((responded / submitted) * 100) : 0,
  }
}

export type UpcomingInterview = Interview & {
  applicationId: string
  company: string
  position: string
}

/** Şu andan sonraki mülakatları, en yakından uzağa sıralı döndürür */
export function getUpcomingInterviews(
  applications: Application[],
  now: Date = new Date(),
  limit = 5,
): UpcomingInterview[] {
  return applications
    .flatMap((application) =>
      application.interviews.map((interview) => ({
        ...interview,
        applicationId: application.id,
        company: application.company,
        position: application.position,
      })),
    )
    .filter((interview) => new Date(interview.scheduledAt) >= now)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    .slice(0, limit)
}
