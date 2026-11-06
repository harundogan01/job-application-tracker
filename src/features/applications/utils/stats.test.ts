import { describe, expect, it } from 'vitest'
import { getApplicationStats, getUpcomingInterviews } from '@/features/applications/utils/stats'
import type { Application } from '@/features/applications/types'

const base = {
  position: 'Dev', location: '', workType: 'remote', appliedAt: '2026-01-01', jobUrl: '', source: '',
  salaryMin: null, salaryMax: null, currency: 'TRY', notes: '', createdAt: '', updatedAt: '',
} as const

const applications: Application[] = [
  { ...base, id: '1', company: 'A', status: 'wishlist', interviews: [] },
  { ...base, id: '2', company: 'B', status: 'applied', interviews: [] },
  {
    ...base, id: '3', company: 'C', status: 'interviewing',
    interviews: [
      { id: 'i1', type: 'hr', scheduledAt: '2026-05-01T10:00', notes: '' },
      { id: 'i2', type: 'technical', scheduledAt: '2026-06-01T10:00', notes: '' },
    ],
  },
  {
    ...base, id: '4', company: 'D', status: 'rejected',
    interviews: [{ id: 'i3', type: 'final', scheduledAt: '2026-05-15T09:00', notes: '' }],
  },
]

describe('getApplicationStats', () => {
  it('durum sayılarını ve geri dönüş oranını hesaplar', () => {
    const stats = getApplicationStats(applications)
    expect(stats.total).toBe(4)
    expect(stats.byStatus.applied).toBe(1)
    expect(stats.active).toBe(2)
    // Başvurulan 3 (wishlist hariç), geri dönüş alınan 2 → %67
    expect(stats.responseRate).toBe(67)
  })

  it('boş listede sıfıra bölmez', () => {
    expect(getApplicationStats([]).responseRate).toBe(0)
  })
})

describe('getUpcomingInterviews', () => {
  it('sadece gelecekteki mülakatları en yakından başlayarak döndürür', () => {
    const result = getUpcomingInterviews(applications, new Date('2026-05-10T00:00'))
    expect(result.map((i) => i.id)).toEqual(['i3', 'i2'])
    expect(result[0].company).toBe('D')
  })
})
