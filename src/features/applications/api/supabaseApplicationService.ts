import { requireSupabase } from '@/lib/supabase'
import { NotFoundError } from '@/lib/errors'
import type { ApplicationService } from '@/features/applications/api/types'
import type { Application, ApplicationInput } from '@/features/applications/types'

/**
 * Veritabanındaki satırın şekli. Postgres'te isimlendirme snake_case,
 * JavaScript'te camelCase olduğu için iki yönlü dönüşüm yapıyoruz.
 * Tablo tanımı: supabase/migrations/0001_create_applications.sql
 */
type ApplicationRow = {
  id: string
  user_id: string
  company: string
  position: string
  location: string
  work_type: Application['workType']
  status: Application['status']
  applied_at: string | null
  job_url: string
  source: string
  salary_min: number | null
  salary_max: number | null
  currency: Application['currency']
  notes: string
  interviews: Application['interviews']
  created_at: string
  updated_at: string
}

type ApplicationRowInput = Partial<
  Omit<ApplicationRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

const TABLE = 'applications'

function fromRow(row: ApplicationRow): Application {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    location: row.location,
    workType: row.work_type,
    status: row.status,
    appliedAt: row.applied_at,
    jobUrl: row.job_url,
    source: row.source,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    currency: row.currency,
    notes: row.notes,
    interviews: row.interviews ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toRow(input: Partial<ApplicationInput>): ApplicationRowInput {
  const row: ApplicationRowInput = {
    company: input.company,
    position: input.position,
    location: input.location,
    work_type: input.workType,
    status: input.status,
    applied_at: input.appliedAt,
    job_url: input.jobUrl,
    source: input.source,
    salary_min: input.salaryMin,
    salary_max: input.salaryMax,
    currency: input.currency,
    notes: input.notes,
    interviews: input.interviews,
  }
  // Kısmi güncellemelerde gönderilmeyen alanları (undefined) çıkar
  return Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined),
  ) as ApplicationRowInput
}

/** Postgres "invalid input syntax for type uuid" hatası: geçersiz id = bulunamadı */
const INVALID_UUID = '22P02'

export const supabaseApplicationService: ApplicationService = {
  async list() {
    const { data, error } = await requireSupabase()
      .from(TABLE)
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) throw error
    return (data as ApplicationRow[]).map(fromRow)
  },

  async get(id) {
    // RLS (Row Level Security) sayesinde başka bir kullanıcının kaydı
    // sorgulansa bile sonuç boş döner; ayrıca user_id filtresi gerekmiyor.
    const { data, error } = await requireSupabase()
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error?.code === INVALID_UUID || (!error && !data)) {
      throw new NotFoundError('Başvuru bulunamadı.')
    }
    if (error) throw error
    return fromRow(data as ApplicationRow)
  },

  async create(input) {
    // user_id gönderilmiyor: veritabanında varsayılan değeri auth.uid()
    const { data, error } = await requireSupabase()
      .from(TABLE)
      .insert(toRow(input))
      .select()
      .single()
    if (error) throw error
    return fromRow(data as ApplicationRow)
  },

  async update(id, input) {
    const { data, error } = await requireSupabase()
      .from(TABLE)
      .update(toRow(input))
      .eq('id', id)
      .select()
      .maybeSingle()
    if (error) throw error
    if (!data) throw new NotFoundError('Başvuru bulunamadı.')
    return fromRow(data as ApplicationRow)
  },

  async remove(id) {
    const { error } = await requireSupabase().from(TABLE).delete().eq('id', id)
    if (error) throw error
  },

  async seed(items) {
    const { error } = await requireSupabase().from(TABLE).insert(items.map(toRow))
    if (error) throw error
  },
}
