import { CalendarClock, CheckCircle2 } from 'lucide-react'
import { INTERVIEW_TYPE_LABELS } from '@/features/applications/constants'
import type { Interview } from '@/features/applications/types'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'

export function InterviewTimeline({ interviews }: { interviews: Interview[] }) {
  if (interviews.length === 0) {
    return <p className="text-sm text-gray-500">Bu başvuru için henüz mülakat eklenmedi.</p>
  }

  const now = new Date()

  return (
    <ol className="space-y-5">
      {interviews.map((interview) => {
        const isPast = new Date(interview.scheduledAt) < now
        const Icon = isPast ? CheckCircle2 : CalendarClock

        return (
          <li key={interview.id} className="flex gap-3">
            <Icon
              className={cn('mt-0.5 size-5 shrink-0', isPast ? 'text-green-600' : 'text-amber-500')}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {INTERVIEW_TYPE_LABELS[interview.type]}
                {!isPast && (
                  <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                    Yaklaşıyor
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500">{formatDateTime(interview.scheduledAt)}</p>
              {interview.notes && (
                <p className="mt-1 text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {interview.notes}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
