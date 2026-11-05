import { Link } from 'react-router'
import { STATUS_META } from '@/features/applications/constants'
import { APPLICATION_STATUSES } from '@/features/applications/types'
import type { ApplicationStats } from '@/features/applications/utils/stats'

/** Başvuruların duruma göre dağılımı: yatay yığılmış çubuk + açıklama */
export function StatusBreakdown({ stats }: { stats: ApplicationStats }) {
  const statuses = APPLICATION_STATUSES.filter((status) => stats.byStatus[status] > 0)

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        {statuses.map((status) => (
          <div
            key={status}
            className={STATUS_META[status].dotClass}
            style={{ width: `${(stats.byStatus[status] / stats.total) * 100}%` }}
            title={`${STATUS_META[status].label}: ${stats.byStatus[status]}`}
          />
        ))}
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        {APPLICATION_STATUSES.map((status) => (
          <li key={status}>
            {/* Duruma tıklanınca liste o filtreyle açılır */}
            <Link
              to={`/applications?status=${status}`}
              className="flex items-center gap-2 rounded-md px-1 py-0.5 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className={`size-2.5 rounded-full ${STATUS_META[status].dotClass}`} aria-hidden />
              <span className="text-gray-600 dark:text-gray-400">{STATUS_META[status].label}</span>
              <span className="ml-auto font-medium tabular-nums">{stats.byStatus[status]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
