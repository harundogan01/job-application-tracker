/**
 * Entegrasyon testi: sayfa, gerçek hook'ları ve TanStack Query'yi kullanır.
 * Sadece en dıştaki veri kaynağını (servis) sahte bir uygulamayla değiştiriyoruz.
 */
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ListPage from '@/features/applications/pages/ListPage'
import { applicationService } from '@/features/applications/api/applicationService'
import type { Application } from '@/features/applications/types'
import { useUiStore } from '@/stores/uiStore'
import { renderWithProviders } from '@/test/render'

// vi.mock, modülü test boyunca sahte bir versiyonla değiştirir.
// Bu çağrı dosyanın en üstüne "taşınır" (hoisting), yani import'lardan önce çalışır.
vi.mock('@/features/applications/api/applicationService', () => ({
  applicationService: {
    list: vi.fn(),
    seed: vi.fn(),
  },
}))

function makeApplication(overrides: Partial<Application>): Application {
  return {
    id: crypto.randomUUID(),
    company: 'Şirket',
    position: 'Frontend Developer',
    location: 'İstanbul',
    workType: 'hybrid',
    status: 'applied',
    appliedAt: '2026-10-01',
    jobUrl: '',
    source: '',
    salaryMin: null,
    salaryMax: null,
    currency: 'TRY',
    notes: '',
    interviews: [],
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('ListPage', () => {
  beforeEach(() => {
    vi.mocked(applicationService.list).mockReset()
    // Zustand store'u testler arasında paylaşılır; her test varsayılan görünümle başlasın
    useUiStore.setState({ viewMode: 'table' })
  })

  it('başvuruları listeler', async () => {
    vi.mocked(applicationService.list).mockResolvedValue([
      makeApplication({ company: 'Nova Yazılım' }),
      makeApplication({ company: 'Pusula Teknoloji', status: 'offer' }),
    ])

    renderWithProviders(<ListPage />, { initialPath: '/applications' })

    // Önce yükleniyor göstergesi, sonra veri
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Nova Yazılım' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^\/applications\//),
    )
    expect(screen.getByText('Toplam 2 başvuru')).toBeInTheDocument()
  })

  it('arama yapınca listeyi filtreler ve aramayı URL\'e yazar', async () => {
    vi.mocked(applicationService.list).mockResolvedValue([
      makeApplication({ company: 'Nova Yazılım' }),
      makeApplication({ company: 'Pusula Teknoloji' }),
    ])

    const { user, router } = renderWithProviders(<ListPage />, { initialPath: '/applications' })

    await user.type(await screen.findByLabelText('Başvurularda ara'), 'pusula')

    expect(await screen.findByRole('link', { name: 'Pusula Teknoloji' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Nova Yazılım' })).not.toBeInTheDocument()
    expect(router.state.location.search).toBe('?q=pusula')
  })

  it('URL\'deki filtreyi sayfa açılırken uygular', async () => {
    vi.mocked(applicationService.list).mockResolvedValue([
      makeApplication({ company: 'Nova Yazılım', status: 'applied' }),
      makeApplication({ company: 'Pusula Teknoloji', status: 'offer' }),
    ])

    renderWithProviders(<ListPage />, { initialPath: '/applications?status=offer' })

    expect(await screen.findByRole('link', { name: 'Pusula Teknoloji' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Nova Yazılım' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Duruma göre filtrele')).toHaveValue('offer')
  })

  it('hiç başvuru yoksa boş durum ekranını gösterir', async () => {
    vi.mocked(applicationService.list).mockResolvedValue([])

    renderWithProviders(<ListPage />, { initialPath: '/applications' })

    expect(await screen.findByText('Henüz başvuru yok')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Örnek veri ekle/ })).toBeInTheDocument()
  })

  it('hata olursa mesaj ve tekrar dene butonu gösterir', async () => {
    vi.mocked(applicationService.list).mockRejectedValue(new Error('Sunucuya ulaşılamadı'))

    renderWithProviders(<ListPage />, { initialPath: '/applications' })

    expect(await screen.findByText('Sunucuya ulaşılamadı')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tekrar dene' })).toBeInTheDocument()
  })
})
