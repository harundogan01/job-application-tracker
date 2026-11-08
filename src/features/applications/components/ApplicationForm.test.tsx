import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ApplicationForm } from '@/features/applications/components/ApplicationForm'
import { emptyApplicationForm } from '@/features/applications/schemas'
import { renderWithProviders } from '@/test/render'

function renderForm(onSubmit = vi.fn().mockResolvedValue(undefined)) {
  const result = renderWithProviders(
    <ApplicationForm
      defaultValues={emptyApplicationForm()}
      submitLabel="Başvuruyu kaydet"
      onSubmit={onSubmit}
      onCancel={vi.fn()}
    />,
    // ApplicationForm, useBlocker kullandığı için bir data router içinde olmalı
    { initialPath: '/applications/new' },
  )
  return { ...result, onSubmit }
}

describe('ApplicationForm', () => {
  it('ilk adımdaki zorunlu alanlar dolmadan ilerlemez', async () => {
    const { user } = renderForm()

    await user.click(screen.getByRole('button', { name: /İleri/ }))

    expect(await screen.findByText('Şirket adı gerekli.')).toBeInTheDocument()
    expect(screen.getByText('Pozisyon gerekli.')).toBeInTheDocument()
    // Hâlâ ilk adımdayız: aktif adım göstergesi
    expect(screen.getByRole('button', { current: 'step' })).toHaveTextContent('İlan bilgileri')
  })

  it('adım adım doldurulup gönderildiğinde dönüştürülmüş veriyi iletir', async () => {
    const { user, onSubmit } = renderForm()

    // 1. adım
    await user.type(screen.getByLabelText(/Şirket/), 'Nova Yazılım')
    await user.type(screen.getByLabelText(/Pozisyon/), 'Frontend Developer')
    await user.click(screen.getByRole('button', { name: /İleri/ }))

    // 2. adım: durumu "İlgileniyorum" yapınca başvuru tarihi zorunlu olmaktan çıkar
    await user.selectOptions(await screen.findByLabelText('Durum'), 'wishlist')
    await user.clear(screen.getByLabelText(/Başvuru tarihi/))
    await user.type(screen.getByLabelText('Maaş (alt sınır)'), '100000')
    await user.click(screen.getByRole('button', { name: /İleri/ }))

    // 3. adım: bir mülakat ekle
    await user.click(await screen.findByRole('button', { name: 'Görüşme ekle' }))
    const interview = screen.getByRole('group', { name: '1. görüşme' })
    await user.selectOptions(within(interview).getByLabelText('Görüşme türü'), 'technical')
    await user.type(within(interview).getByLabelText(/Tarih ve saat/), '2027-01-10T10:30')

    await user.click(screen.getByRole('button', { name: 'Başvuruyu kaydet' }))

    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    // expect.objectContaining: sadece önemsediğimiz alanları kontrol eder
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        company: 'Nova Yazılım',
        status: 'wishlist',
        appliedAt: null, // boş string null'a çevrilmiş olmalı
        salaryMin: 100000, // string değil sayı olmalı
        salaryMax: null,
        interviews: [
          expect.objectContaining({ type: 'technical', scheduledAt: '2027-01-10T10:30' }),
        ],
      }),
    )
  })

  it('maaş üst sınırı alt sınırdan küçükse ikinci adımda durdurur', async () => {
    const { user } = renderForm()

    await user.type(screen.getByLabelText(/Şirket/), 'Nova')
    await user.type(screen.getByLabelText(/Pozisyon/), 'Developer')
    await user.click(screen.getByRole('button', { name: /İleri/ }))

    await user.type(await screen.findByLabelText('Maaş (alt sınır)'), '100000')
    await user.type(screen.getByLabelText('Maaş (üst sınır)'), '50000')
    await user.click(screen.getByRole('button', { name: /İleri/ }))

    expect(await screen.findByText('Üst sınır alt sınırdan küçük olamaz.')).toBeInTheDocument()
  })

  it('sunucu hatasını formda gösterir', async () => {
    const { user } = renderForm(vi.fn().mockRejectedValue(new Error('Bağlantı hatası')))

    await user.type(screen.getByLabelText(/Şirket/), 'Nova')
    await user.type(screen.getByLabelText(/Pozisyon/), 'Developer')
    await user.click(screen.getByRole('button', { name: /İleri/ }))
    await user.click(await screen.findByRole('button', { name: /İleri/ }))
    await user.click(await screen.findByRole('button', { name: 'Başvuruyu kaydet' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Bağlantı hatası')
  })
})
