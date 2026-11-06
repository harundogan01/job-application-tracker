import { expect, test } from '@playwright/test'
import { goToApplications, register, seedSampleData } from './helpers'

// beforeEach: bu dosyadaki her testten önce çalışır
test.beforeEach(async ({ page }) => {
  await register(page)
})

test('yeni başvuru çok adımlı formla eklenir', async ({ page }) => {
  await page.getByRole('link', { name: 'Yeni başvuru' }).first().click()

  // 1. adım: önce boş geçmeyi dene
  await page.getByRole('button', { name: 'İleri' }).click()
  await expect(page.getByText('Şirket adı gerekli.')).toBeVisible()

  await page.getByLabel('Şirket').fill('Deneme A.Ş.')
  await page.getByLabel('Pozisyon').fill('React Developer')
  await page.getByLabel('İlan bağlantısı').fill('https://example.com/ilan')
  await page.getByRole('button', { name: 'İleri' }).click()

  // 2. adım
  await page.getByLabel('Maaş (alt sınır)').fill('90000')
  await page.getByRole('button', { name: 'İleri' }).click()

  // 3. adım: mülakat ekle
  await page.getByRole('button', { name: 'Görüşme ekle' }).click()
  await page.getByLabel('Tarih ve saat').fill('2030-01-10T10:30')
  await page.getByRole('button', { name: 'Başvuruyu kaydet' }).click()

  await expect(page.getByRole('heading', { name: 'Deneme A.Ş.' })).toBeVisible()
  await expect(page.getByText('Deneme A.Ş. başvurusu eklendi.')).toBeVisible()
  await expect(page.getByText('Yaklaşıyor')).toBeVisible()
})

test('liste aranır ve filtreler URL\'de tutulur', async ({ page }) => {
  await seedSampleData(page)
  await goToApplications(page)

  await page.getByLabel('Başvurularda ara').fill('pusula')
  await expect(page).toHaveURL(/q=pusula/)
  await expect(page.getByRole('link', { name: 'Pusula Teknoloji', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Nova Yazılım', exact: true })).toBeHidden()

  // Sayfa yenilense de filtre korunur
  await page.reload()
  await expect(page.getByLabel('Başvurularda ara')).toHaveValue('pusula')

  await page.getByLabel('Duruma göre filtrele').selectOption('rejected')
  await expect(page.getByText('Sonuç bulunamadı')).toBeVisible()
  await page.getByRole('button', { name: 'Filtreleri temizle' }).click()
  await expect(page.getByRole('link', { name: 'Mavi Lojistik', exact: true })).toBeVisible()
})

test('durum detay sayfasından anında değiştirilir', async ({ page }) => {
  await seedSampleData(page)
  await goToApplications(page)
  await page.getByRole('link', { name: 'Kuzey Fintek', exact: true }).click()

  await page.getByLabel('Başvuru durumu').selectOption('interviewing')
  await expect(page.getByText('Durum "Mülakat sürecinde" olarak güncellendi.')).toBeVisible()

  // Listeye dönünce yeni durum görünmeli
  await goToApplications(page)
  const row = page.getByRole('row', { name: /Kuzey Fintek/ })
  await expect(row.getByText('Mülakat sürecinde')).toBeVisible()
})

test('düzenlemede kaydedilmemiş değişiklik uyarısı çıkar', async ({ page }) => {
  await seedSampleData(page)
  await goToApplications(page)
  await page.getByRole('link', { name: 'Nova Yazılım', exact: true }).click()
  await page.getByRole('link', { name: 'Düzenle' }).click()

  await page.getByLabel('Pozisyon').fill('Lead Frontend Developer')
  await page.getByRole('link', { name: 'Genel bakış' }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText('Değişiklikler kaydedilmedi')).toBeVisible()
  await dialog.getByRole('button', { name: 'Vazgeç' }).click()
  await expect(dialog).toBeHidden()

  // Son adıma geçip kaydet
  await page.getByRole('button', { name: 'İleri' }).click()
  await page.getByRole('button', { name: 'İleri' }).click()
  await page.getByRole('button', { name: 'Değişiklikleri kaydet' }).click()
  await expect(page.getByText('Değişiklikler kaydedildi.')).toBeVisible()
  await expect(page).toHaveURL(/\/applications\/[\w-]+$/)
  await expect(page.getByRole('heading', { name: 'Nova Yazılım' })).toBeVisible()
})

test('başvuru onaydan sonra silinir', async ({ page }) => {
  await seedSampleData(page)
  await goToApplications(page)
  await page.getByRole('link', { name: 'Atlas Oyun Stüdyosu', exact: true }).click()

  await page.getByRole('button', { name: 'Sil' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Sil' }).click()

  await expect(page).toHaveURL('/applications')
  await expect(page.getByText('Atlas Oyun Stüdyosu başvurusu silindi.')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Atlas Oyun Stüdyosu', exact: true })).toBeHidden()
})

test('olmayan başvuru ve sayfa için bilgilendirme gösterilir', async ({ page }) => {
  await page.goto('/applications/boyle-bir-kayit-yok')
  await expect(page.getByText('Başvuru bulunamadı')).toBeVisible()

  await page.goto('/olmayan-bir-sayfa')
  await expect(page.getByRole('heading', { name: 'Sayfa bulunamadı' })).toBeVisible()
})

test.describe('mobil görünüm', () => {
  // Bu gruptaki testler telefon boyutunda çalışır
  test.use({ viewport: { width: 390, height: 844 } })

  test('menü butonla açılır ve sayfa geçişinde kapanır', async ({ page }) => {
    const sidebarLink = page.getByRole('link', { name: 'Başvurular' })
    await expect(sidebarLink).not.toBeInViewport()

    await page.getByRole('button', { name: 'Menüyü aç' }).click()
    await expect(sidebarLink).toBeInViewport()

    await sidebarLink.click()
    await expect(page).toHaveURL('/applications')
    await expect(sidebarLink).not.toBeInViewport()
  })
})
