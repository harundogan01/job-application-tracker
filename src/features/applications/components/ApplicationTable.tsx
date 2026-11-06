import { Link } from 'react-router'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/features/applications/components/StatusBadge'
import { WORK_TYPE_LABELS } from '@/features/applications/constants'
import type { Application } from '@/features/applications/types'
import { formatDate } from '@/lib/format'

export function ApplicationTable({ applications }: { applications: Application[] }) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b text-xs font-medium tracking-wide text-gray-500 uppercase">
          <tr>
            <th scope="col" className="px-5 py-3">Şirket / Pozisyon</th>
            <th scope="col" className="px-5 py-3">Durum</th>
            <th scope="col" className="hidden px-5 py-3 md:table-cell">Konum</th>
            <th scope="col" className="hidden px-5 py-3 md:table-cell">Başvuru</th>
            <th scope="col" className="hidden px-5 py-3 lg:table-cell">Mülakat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {applications.map((application) => (
            <tr key={application.id} className="group relative hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-5 py-3">
                {/* Link'i tüm satırı kaplayacak şekilde genişletiyoruz (after:absolute) */}
                <Link
                  to={`/applications/${application.id}`}
                  className="font-medium after:absolute after:inset-0 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                >
                  {application.company}
                </Link>
                <p className="text-gray-500">{application.position}</p>
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={application.status} />
              </td>
              <td className="hidden px-5 py-3 text-gray-600 md:table-cell dark:text-gray-400">
                {application.location || '—'}
                <span className="block text-xs text-gray-400">{WORK_TYPE_LABELS[application.workType]}</span>
              </td>
              <td className="hidden px-5 py-3 text-gray-600 md:table-cell dark:text-gray-400">
                {formatDate(application.appliedAt)}
              </td>
              <td className="hidden px-5 py-3 text-gray-600 lg:table-cell dark:text-gray-400">
                {application.interviews.length || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}
