import type { Application, ApplicationStatus } from '@/features/applications/types'
import { CLOSED_STATUSES } from '@/features/applications/constants'
import { normalize } from '@/lib/normalize'

export function findActiveDuplicate(
  applications: Application[],
  candidate: { company: string, position: string, status: ApplicationStatus },
  excludeId?: string
): Application | undefined {
  if (CLOSED_STATUSES.includes(candidate.status))
    return undefined
  const company = normalize(candidate.company)
  const position = normalize(candidate.position)
  return applications.find(
    (app) =>
      app.id !== excludeId && !CLOSED_STATUSES.includes(app.status) && 
      normalize(app.company) === company &&
      normalize(app.position) === position)
}