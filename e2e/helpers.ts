import { expect, type Page } from '@playwright/test'

export const testUser = {
  fullName: 'Harun Doğan',
  email: 'harun@example.com',
  password: 'abc12345',
}

/**
 * Yeni bir kullanıcı kaydeder. Her test temiz bir tarayıcı profiliyle
 * (boş localStorage) başladığı için aynı e-posta tekrar kullanılabilir.
 */
export async function register(page: Page, user = testUser) {
  await page.goto('/register')
  await page.getByLabel('Ad soyad').fill(user.fullName)
  await page.getByLabel('E-posta').fill(user.email)
  await page.getByLabel('Şifre', { exact: true }).fill(user.password)
  await page.getByLabel('Şifre (tekrar)').fill(user.password)
  await page.getByRole('button', { name: 'Kayıt ol' }).click()
  await expect(page.getByRole('heading', { name: /Merhaba/ })).toBeVisible()
}

/** Örnek başvuruları yükler ve dashboard'un dolmasını bekler */
export async function seedSampleData(page: Page) {
  await page.getByRole('button', { name: 'Örnek veri ekle' }).click()
  await expect(page.getByText('Toplam başvuru')).toBeVisible()
}

/**
 * Yan menüden başvuru listesine gider ve sayfanın gerçekten değişmesini bekler.
 * Beklemezsek, bir sonraki adım hâlâ önceki sayfadaki elemanları bulabilir.
 */
export async function goToApplications(page: Page) {
  // Detay sayfasında "Başvurular" adında bir geri linki de var; yan menüyle sınırlıyoruz
  await page.getByRole('navigation').getByRole('link', { name: 'Başvurular' }).click()
  await expect(page).toHaveURL('/applications')
  await expect(page.getByRole('heading', { name: 'Başvurular' })).toBeVisible()
}
