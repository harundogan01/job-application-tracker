import { describe, expect, it } from 'vitest'
import { applicationFormSchema, emptyApplicationForm } from '@/features/applications/schemas'

const valid = { ...emptyApplicationForm(), company: 'Nova', position: 'Frontend Developer' }

function errorPaths(values: unknown) {
  const result = applicationFormSchema.safeParse(values)
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join('.'))
}

describe('applicationFormSchema', () => {
  it('geçerli bir formu kabul eder', () => {
    expect(errorPaths(valid)).toEqual([])
  })

  it('şirket ve pozisyonu zorunlu tutar', () => {
    expect(errorPaths({ ...valid, company: '  ', position: '' })).toEqual(['company', 'position'])
  })

  it('"İlgileniyorum" dışındaki durumlarda başvuru tarihi ister', () => {
    expect(errorPaths({ ...valid, status: 'applied', appliedAt: '' })).toEqual(['appliedAt'])
    expect(errorPaths({ ...valid, status: 'wishlist', appliedAt: '' })).toEqual([])
  })

  it('maaş üst sınırının alt sınırdan küçük olmasına izin vermez', () => {
    expect(errorPaths({ ...valid, salaryMin: 100, salaryMax: 50 })).toEqual(['salaryMax'])
  })

  it('geçersiz ilan adresini reddeder', () => {
    expect(errorPaths({ ...valid, jobUrl: 'ilan-linki' })).toEqual(['jobUrl'])
    expect(errorPaths({ ...valid, jobUrl: 'https://example.com/ilan' })).toEqual([])
  })

  it('tarihi boş mülakatı reddeder', () => {
    const interviews = [{ id: '1', type: 'hr', scheduledAt: '', notes: '' }]
    expect(errorPaths({ ...valid, interviews })).toEqual(['interviews.0.scheduledAt'])
  })
})
