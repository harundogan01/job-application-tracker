import type { Application } from '@/features/applications/types'
import { describe, expect, it } from 'vitest'
import { findActiveDuplicate } from './findActiveDuplicate'
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

describe('findActiveDuplicate', () => {
  it('aynı şirket ve pozisyonda aktif kayıt varsa onu döndürür', () => {
    const existing = makeApplication({ company: 'Nova Yazılım', position: 'Frontend Developer', status: 'applied' })

    const result = findActiveDuplicate([existing], {
      company: 'Nova Yazılım',
      position: 'Frontend Developer',
      status: 'applied'
    })

    expect(result).toBe(existing)
  })

  it('Önceki kayıt rejected ya da withdrawn ise undefined döner', () => {
    const existing = makeApplication({ company: 'Nova Yazılım', position: 'Frontend Developer', status: 'rejected' })

    const result = findActiveDuplicate([existing], {
      company: 'Nova Yazılım',
      position: 'Frontend Developer',
      status: 'applied'
    })

    expect(result).toBeUndefined()
  })

  it('Aday kayıt rejected ise undefined döner.', () => {
    const existing = makeApplication({ company: 'Nova Yazılım', position: 'Frontend Developer', status: 'applied' })

    const result = findActiveDuplicate([existing], {
      company: 'Nova Yazılım', position: 'Frontend Developer', status: 'rejected'
    })

    expect(result).toBeUndefined()
  })

  it('Büyük/küçük harf ve baştaki/sondaki boşluklardan etkilenmez', () => {
    const existing = makeApplication({ company: 'Nova Yazılım', position: 'Frontend Developer', status: 'applied' })

    const result = findActiveDuplicate([existing], {
      company: ' nova yazılım ',
      position: 'frontend developer',
      status: 'applied'
    })

    expect(result).toBe(existing)
  })

  it('Türkçe İ harfi i harfine eşittir', () => {
    const existing = makeApplication({ company: 'İzmir Yazılım', position: 'Frontend Developer', status: 'applied' })

    const result = findActiveDuplicate([existing], {
      company: 'izmir yazılım',
      position: 'Frontend Developer',
      status: 'applied'
    })

    expect(result).toBe(existing)
  })

  it('excludeId ile verilen kaydı kendisiyle karşılaştırmaz', () => {
    const existing = makeApplication({ company: 'Nova Yazılım', position: 'Frontend Developer', status: 'applied' })

    const result = findActiveDuplicate([existing], {
      company: 'Nova Yazılım',
      position: 'Frontend Developer',
      status: 'applied'
    },
      existing.id)

    expect(result).toBeUndefined()
  })

  it('Eğer position farklıysa eşleşme olmaz', () => {
    const existing = makeApplication({ company: 'Nova Yazılım', position: 'Frontend Developer', status: 'applied' })

    const result = findActiveDuplicate([existing], {
      company: 'Nova Yazılım', position: 'Backend Developer', status: 'applied'
    })

    expect(result).toBeUndefined()
  })
})