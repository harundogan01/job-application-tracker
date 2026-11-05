import { Badge } from '@/components/ui/Badge'
import { STATUS_META } from '@/features/applications/constants'
import type { ApplicationStatus } from '@/features/applications/types'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_META[status]
  return (
    <Badge className={meta.badgeClass}>
      <span className={cn('size-1.5 rounded-full', meta.dotClass)} aria-hidden />
      {meta.label}
    </Badge>
  )
}
