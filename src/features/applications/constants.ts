import type { ApplicationStatus, Currency, InterviewType, WorkType } from '@/features/applications/types'

type Option<T extends string> = { value: T; label: string }

export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  wishlist: {
    label: 'İlgileniyorum',
    badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    dotClass: 'bg-gray-400',
  },
  applied: {
    label: 'Başvuruldu',
    badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    dotClass: 'bg-blue-500',
  },
  interviewing: {
    label: 'Mülakat sürecinde',
    badgeClass: 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    dotClass: 'bg-amber-500',
  },
  offer: {
    label: 'Teklif alındı',
    badgeClass: 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300',
    dotClass: 'bg-green-500',
  },
  rejected: {
    label: 'Olumsuz',
    badgeClass: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    dotClass: 'bg-red-500',
  },
  withdrawn: {
    label: 'Geri çekildi',
    badgeClass: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    dotClass: 'bg-gray-300 dark:bg-gray-600',
  },
}

export const STATUS_OPTIONS = (Object.keys(STATUS_META) as ApplicationStatus[]).map(
  (value): Option<ApplicationStatus> => ({ value, label: STATUS_META[value].label }),
)

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  onsite: 'Ofisten',
  hybrid: 'Hibrit',
  remote: 'Uzaktan',
}

export const WORK_TYPE_OPTIONS = (Object.keys(WORK_TYPE_LABELS) as WorkType[]).map(
  (value): Option<WorkType> => ({ value, label: WORK_TYPE_LABELS[value] }),
)

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  hr: 'İK görüşmesi',
  technical: 'Teknik mülakat',
  case: 'Case çalışması',
  manager: 'Yönetici görüşmesi',
  final: 'Son görüşme',
  other: 'Diğer',
}

export const INTERVIEW_TYPE_OPTIONS = (Object.keys(INTERVIEW_TYPE_LABELS) as InterviewType[]).map(
  (value): Option<InterviewType> => ({ value, label: INTERVIEW_TYPE_LABELS[value] }),
)

export const CURRENCY_OPTIONS: Option<Currency>[] = [
  { value: 'TRY', label: '₺ TRY' },
  { value: 'USD', label: '$ USD' },
  { value: 'EUR', label: '€ EUR' },
]
