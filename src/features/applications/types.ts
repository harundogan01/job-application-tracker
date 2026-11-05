export const APPLICATION_STATUSES = [
  'wishlist',
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'withdrawn',
] as const

export const WORK_TYPES = ['onsite', 'hybrid', 'remote'] as const

export const INTERVIEW_TYPES = ['hr', 'technical', 'case', 'manager', 'final', 'other'] as const

export const CURRENCIES = ['TRY', 'USD', 'EUR'] as const

// "as const" dizilerden union tipler türetiyoruz:
// ApplicationStatus = 'wishlist' | 'applied' | ...
// Böylece değerleri tek bir yerde tutuyoruz; hem Zod şemasında hem
// select seçeneklerinde aynı diziyi kullanabiliyoruz.
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]
export type WorkType = (typeof WORK_TYPES)[number]
export type InterviewType = (typeof INTERVIEW_TYPES)[number]
export type Currency = (typeof CURRENCIES)[number]

export type Interview = {
  id: string
  type: InterviewType
  /** <input type="datetime-local"> formatı: "2026-11-12T14:30" */
  scheduledAt: string
  notes: string
}

export type Application = {
  id: string
  company: string
  position: string
  location: string
  workType: WorkType
  status: ApplicationStatus
  /** "2026-11-05" ya da henüz başvurulmadıysa null */
  appliedAt: string | null
  jobUrl: string
  /** İlanı nereden bulduğun: LinkedIn, Kariyer.net, referans... */
  source: string
  salaryMin: number | null
  salaryMax: number | null
  currency: Currency
  notes: string
  interviews: Interview[]
  createdAt: string
  updatedAt: string
}

/** Oluşturma ve güncelleme için gönderilen veri: sunucunun ürettiği alanlar hariç */
export type ApplicationInput = Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
