import { Link } from 'react-router'
import { CalendarDays, MapPin } from 'lucide-react'
import { StatusBadge } from '@/features/applications/components/StatusBadge'
import { WORK_TYPE_LABELS } from '@/features/applications/constants'
import type { Application } from '@/features/applications/types'
import { formatDate } from '@/lib/format'

export function ApplicationCards({ applications }: { applications: Application[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {applications.map((application) => (
        <li key={application.id}>
          <Link
            to={`/applications/${application.id}`}
            className="block h-full rounded-xl border bg-white p-5 shadow-xs transition hover:border-indigo-300 hover:shadow-md dark:bg-gray-900 dark:hover:border-indigo-500/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{application.company}</p>
                <p className="truncate text-sm text-gray-500">{application.position}</p>
              </div>
              <StatusBadge status={application.status} />
            </div>
            <div className="mt-4 space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-gray-400" aria-hidden />
                {application.location || 'Konum belirtilmemiş'} · {WORK_TYPE_LABELS[application.workType]}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 text-gray-400" aria-hidden />
                {application.appliedAt ? formatDate(application.appliedAt) : 'Henüz başvurulmadı'}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
