import { expect, test } from '@playwright/test'
import { register, testUser } from './helpers'

test.describe('Kimlik doğrulama', () => {
  test('giriş yapmadan korumalı sayfaya gidilince login\'e yönlendirir', async ({ page }) => {
    await page.goto('/applications')
    await expect(page).toHaveURL('/login')
    await expect(page.getByRole('heading', { name: 'Tekrar hoş geldin' })).toBeVisible()
  })

  test('kayıt formu hatalı bilgileri kabul etmez', async ({ page }) => {
    await page.goto('/register')
    await page.getByRole('button', { name: 'Kayıt ol' }).click()

    await expect(page.getByText('Ad soyad en az 2 karakter olmalı.')).toBeVisible()
    await expect(page.getByText('E-posta adresi gerekli.')).toBeVisible()
  })

  test('kayıt olan kullanıcı dashboard\'a yönlenir ve adıyla karşılanır', async ({ page }) => {
    await register(page)
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { name: 'Merhaba, Harun 👋' })).toBeVisible()
  })

  test('çıkış yapıp tekrar giriş yapınca gidilmek istenen sayfaya döner', async ({ page }) => {
    await register(page)
    await page.getByRole('button', { name: 'Çıkış yap' }).click()
    await expect(page).toHaveURL('/login')

    // Filtreli bir adrese gitmeye çalış: önce login'e yönlenmeli
    await page.goto('/applications?status=offer')
    await expect(page).toHaveURL('/login')

    await page.getByLabel('E-posta').fill(testUser.email)
    await page.getByLabel('Şifre').fill('yanlis-sifre1')
    await page.getByRole('button', { name: 'Giriş yap' }).click()
    await expect(page.getByRole('alert')).toHaveText('E-posta veya şifre hatalı.')

    await page.getByLabel('Şifre').fill(testUser.password)
    await page.getByRole('button', { name: 'Giriş yap' }).click()
    await expect(page).toHaveURL('/applications?status=offer')
  })
})
