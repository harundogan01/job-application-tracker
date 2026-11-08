import { z } from 'zod'
import { todayIsoDate } from '@/lib/format'
import {
  APPLICATION_STATUSES,
  CURRENCIES,
  INTERVIEW_TYPES,
  WORK_TYPES,
  type Application,
  type ApplicationInput,
} from '@/features/applications/types'

const optionalText = (max: number) =>
  z.string().trim().max(max, `En fazla ${max} karakter olabilir.`)

const salary = z
  .number({ error: 'Geçerli bir sayı gir.' })
  .int('Tam sayı olmalı.')
  .nonnegative('Negatif olamaz.')
  .nullable()

export const interviewSchema = z.object({
  id: z.string(),
  type: z.enum(INTERVIEW_TYPES),
  scheduledAt: z.string().min(1, 'Tarih ve saat gerekli.'),
  notes: optionalText(500),
})

export const applicationFormSchema = z
  .object({
    company: z.string().trim().min(1, 'Şirket adı gerekli.').max(100, 'En fazla 100 karakter.'),
    position: z.string().trim().min(1, 'Pozisyon gerekli.').max(100, 'En fazla 100 karakter.'),
    location: optionalText(100),
    workType: z.enum(WORK_TYPES),
    jobUrl: z
      .string()
      .trim()
      .refine((value) => value === '' || /^https?:\/\/\S+\.\S+/.test(value), {
        message: 'http:// ya da https:// ile başlayan geçerli bir adres gir.',
      }),
    source: optionalText(50),
    status: z.enum(APPLICATION_STATUSES),
    /** Form içinde boş string, kaydederken null'a çevriliyor */
    appliedAt: z.string(),
    salaryMin: salary,
    salaryMax: salary,
    currency: z.enum(CURRENCIES),
    notes: optionalText(2000),
    interviews: z.array(interviewSchema),
  })
  // superRefine: birden fazla alana bakan ve birden fazla hata üretebilen kurallar
  .superRefine((values, ctx) => {
    if (values.status !== 'wishlist' && !values.appliedAt) {
      ctx.addIssue({
        code: 'custom',
        path: ['appliedAt'],
        message: 'Bu durum için başvuru tarihi gerekli.',
      })
    }
    if (values.appliedAt && values.appliedAt > todayIsoDate()) {
      ctx.addIssue({
        code: 'custom',
        path: ['appliedAt'],
        message: 'Başvuru tarihi gelecekte olamaz.',
      })
    }
    if (
      values.salaryMin != null &&
      values.salaryMax != null &&
      values.salaryMax < values.salaryMin
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['salaryMax'],
        message: 'Üst sınır alt sınırdan küçük olamaz.',
      })
    }
  })

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>
export type InterviewFormValues = z.infer<typeof interviewSchema>

export function emptyApplicationForm(): ApplicationFormValues {
  return {
    company: '',
    position: '',
    location: '',
    workType: 'hybrid',
    jobUrl: '',
    source: '',
    status: 'applied',
    appliedAt: todayIsoDate(),
    salaryMin: null,
    salaryMax: null,
    currency: 'TRY',
    notes: '',
    interviews: [],
  }
}

/** Kayıtlı bir başvuruyu düzenleme formunun başlangıç değerlerine çevirir */
export function toFormValues(application: Application): ApplicationFormValues {
  return {
    company: application.company,
    position: application.position,
    location: application.location,
    workType: application.workType,
    jobUrl: application.jobUrl,
    source: application.source,
    status: application.status,
    appliedAt: application.appliedAt ?? '',
    salaryMin: application.salaryMin,
    salaryMax: application.salaryMax,
    currency: application.currency,
    notes: application.notes,
    interviews: application.interviews,
  }
}

/** Form değerlerini servise gönderilecek veriye çevirir */
export function toApplicationInput(values: ApplicationFormValues): ApplicationInput {
  return {
    ...values,
    appliedAt: values.appliedAt || null,
    // Mülakatları tarihe göre sıralı kaydet
    interviews: [...values.interviews].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
  }
}
