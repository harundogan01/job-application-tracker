import { describe, expect, it } from 'vitest'
import { filterApplications } from '@/features/applications/utils/filterApplications'
import type { Application } from '@/features/applications/types'

function makeApplication(overrides: Partial<Application>): Application {
  return {
    id: crypto.randomUUID(),
    company: 'Şirket',
    position: 'Frontend Developer',
    location: 'İstanbul',
    workType: 'remote',
    status: 'applied',
    appliedAt: '2026-01-01',
    jobUrl: '',
    source: '',
    salaryMin: null,
    salaryMax: null,
    currency: 'TRY',
    notes: '',
    interviews: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const applications = [
  makeApplication({ company: 'Zeta', status: 'offer', appliedAt: '2026-03-01', updatedAt: '2026-03-05' }),
  makeApplication({ company: 'Alfa', position: 'React Developer', appliedAt: null, updatedAt: '2026-03-10' }),
  makeApplication({ company: 'İzmir Yazılım', location: 'İzmir', appliedAt: '2026-02-01', updatedAt: '2026-02-02' }),
]

describe('filterApplications', () => {
  it('varsayılan olarak son güncellenene göre sıralar', () => {
    const result = filterApplications(applications, { query: '', status: '', sort: 'updated' })
    expect(result.map((a) => a.company)).toEqual(['Alfa', 'Zeta', 'İzmir Yazılım'])
  })

  it('duruma göre filtreler', () => {
    const result = filterApplications(applications, { query: '', status: 'offer', sort: 'updated' })
    expect(result.map((a) => a.company)).toEqual(['Zeta'])
  })

  it('şirket, pozisyon ve konumda büyük/küçük harf duyarsız arar (Türkçe karakterler dahil)', () => {
    expect(filterApplications(applications, { query: 'react', status: '', sort: 'updated' })).toHaveLength(1)
    expect(filterApplications(applications, { query: 'izmir', status: '', sort: 'updated' })).toHaveLength(1)
  })

  it('başvuru tarihine göre sıralarken tarihi olmayanları sona koyar', () => {
    const result = filterApplications(applications, { query: '', status: '', sort: 'applied' })
    expect(result.map((a) => a.company)).toEqual(['Zeta', 'İzmir Yazılım', 'Alfa'])
  })

  it('orijinal diziyi değiştirmez', () => {
    const copy = [...applications]
    filterApplications(applications, { query: '', status: '', sort: 'company' })
    expect(applications).toEqual(copy)
  })
})
