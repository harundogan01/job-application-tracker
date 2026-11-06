import type { ApplicationInput } from '@/features/applications/types'

/** Bugünden n gün önce/sonraki tarihi "YYYY-MM-DD" olarak verir */
function daysFromToday(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function dateTimeFromToday(days: number, time: string) {
  return `${daysFromToday(days)}T${time}`
}

/** Boş hesapta uygulamayı denemek için örnek başvurular (şirketler hayalî) */
export function createSampleApplications(): ApplicationInput[] {
  return [
    {
      company: 'Nova Yazılım',
      position: 'Senior Frontend Developer',
      location: 'İstanbul',
      workType: 'hybrid',
      status: 'interviewing',
      appliedAt: daysFromToday(-12),
      jobUrl: 'https://example.com/ilan/nova-frontend',
      source: 'LinkedIn',
      salaryMin: 120000,
      salaryMax: 150000,
      currency: 'TRY',
      notes: 'React + TypeScript ağırlıklı bir ekip. Vue deneyimi artı olarak görülüyor.',
      interviews: [
        { id: crypto.randomUUID(), type: 'hr', scheduledAt: dateTimeFromToday(-5, '10:00'), notes: 'Maaş beklentisi ve takvim konuşuldu.' },
        { id: crypto.randomUUID(), type: 'technical', scheduledAt: dateTimeFromToday(3, '14:30'), notes: 'Canlı kodlama: React hook\'ları ve state yönetimi.' },
      ],
    },
    {
      company: 'Kuzey Fintek',
      position: 'Frontend Engineer',
      location: 'İstanbul',
      workType: 'remote',
      status: 'applied',
      appliedAt: daysFromToday(-4),
      jobUrl: '',
      source: 'Kariyer sayfası',
      salaryMin: null,
      salaryMax: null,
      currency: 'USD',
      notes: '',
      interviews: [],
    },
    {
      company: 'Pusula Teknoloji',
      position: 'React Developer',
      location: 'Ankara',
      workType: 'onsite',
      status: 'offer',
      appliedAt: daysFromToday(-30),
      jobUrl: '',
      source: 'Referans',
      salaryMin: 110000,
      salaryMax: null,
      currency: 'TRY',
      notes: 'Teklif geldi, cevap için bir hafta süre verildi.',
      interviews: [
        { id: crypto.randomUUID(), type: 'technical', scheduledAt: dateTimeFromToday(-20, '11:00'), notes: '' },
        { id: crypto.randomUUID(), type: 'final', scheduledAt: dateTimeFromToday(-10, '16:00'), notes: 'CTO ile görüşme.' },
      ],
    },
    {
      company: 'Mavi Lojistik',
      position: 'Frontend Developer (Vue/React)',
      location: 'İzmir',
      workType: 'hybrid',
      status: 'rejected',
      appliedAt: daysFromToday(-40),
      jobUrl: '',
      source: 'Kariyer.net',
      salaryMin: null,
      salaryMax: null,
      currency: 'TRY',
      notes: 'Daha kıdemli bir aday tercih edildi.',
      interviews: [],
    },
    {
      company: 'Atlas Oyun Stüdyosu',
      position: 'UI Engineer',
      location: 'İstanbul',
      workType: 'remote',
      status: 'wishlist',
      appliedAt: null,
      jobUrl: '',
      source: 'Twitter',
      salaryMin: null,
      salaryMax: null,
      currency: 'EUR',
      notes: 'Portfolyo hazırlandıktan sonra başvurulacak.',
      interviews: [],
    },
  ]
}
