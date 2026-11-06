# Test Rehberi

Bu projede üç tür test var. Hiç test yazmadıysan bu dosyayı baştan sona okuyup
ardından örnek test dosyalarını sırayla açman en iyi yol.

```
            ▲  Uçtan uca (E2E)       e2e/*.spec.ts           Az sayıda, yavaş, en gerçekçi
           ▲▲▲ Bileşen/entegrasyon   src/**/*.test.tsx       Orta
          ▲▲▲▲▲ Birim (unit)         src/**/*.test.ts        Çok sayıda, çok hızlı
```

| Tür | Neyi test eder? | Araç | Komut |
|---|---|---|---|
| **Birim** | Tek bir fonksiyonu, React olmadan | [Vitest](https://vitest.dev) | `pnpm test` |
| **Bileşen** | Bir bileşeni kullanıcı gözüyle: ekranda ne var, tıklayınca ne oluyor | Vitest + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) | `pnpm test` |
| **E2E** | Uygulamanın tamamını gerçek bir tarayıcıda | [Playwright](https://playwright.dev) | `pnpm test:e2e` |

## Komutlar

```bash
pnpm test             # Birim + bileşen testlerini bir kez çalıştırır
pnpm test:watch       # Dosya kaydettikçe ilgili testleri tekrar çalıştırır (geliştirirken bunu kullan)
pnpm test:e2e         # E2E testleri (geliştirme sunucusunu kendisi başlatır)
pnpm test:e2e:ui      # E2E testleri görsel arayüzle: her adımı izleyebilirsin
```

E2E testlerini ilk kez çalıştırmadan önce Playwright'ın tarayıcısını bir kez indir:

```bash
pnpm exec playwright install chromium
```

Sadece belirli bir dosyayı ya da testi çalıştırmak için:

```bash
pnpm test LoginPage                     # Adında "LoginPage" geçen test dosyaları
pnpm test:watch -t "şifreler eşleşmez"  # Adında bu metin geçen testler
pnpm exec playwright test e2e/auth.spec.ts
```

## Önerilen okuma sırası

1. `src/features/applications/utils/filterApplications.test.ts`: en basit hali, saf fonksiyon testi
2. `src/components/ui/FormField.test.tsx`: ilk bileşen testi
3. `src/features/auth/pages/LoginPage.test.tsx`: kullanıcı etkileşimi, sahte fonksiyonlar (`vi.fn`)
4. `src/features/applications/components/ApplicationForm.test.tsx`: çok adımlı form
5. `src/features/applications/pages/ListPage.test.tsx`: modül mock'lama (`vi.mock`), URL ile entegrasyon
6. `e2e/applications.spec.ts`: gerçek tarayıcıda uçtan uca akış

## Bir testin anatomisi

```ts
import { describe, expect, it } from 'vitest'

describe('toplama', () => {           // İlgili testleri gruplar
  it('iki sayıyı toplar', () => {     // Tek bir davranış: "ne yapmalı?"
    // 1. Hazırla (Arrange)
    const a = 2
    const b = 3

    // 2. Yap (Act)
    const sonuc = a + b

    // 3. Kontrol et (Assert)
    expect(sonuc).toBe(5)
  })
})
```

Test adlarını **davranışı anlatacak** şekilde yaz: "çalışıyor mu" değil,
"şifreler eşleşmezse hata gösterir". Test başarısız olduğunda adından neyin
bozulduğu anlaşılmalı.

## Bileşen testleri: React Testing Library

Temel fikir: **Kodun nasıl yazıldığını değil, kullanıcının ne gördüğünü test et.**
State'in adı, hangi hook'un kullanıldığı test edilmez. Ekranda hangi yazının
çıktığı, butona basınca ne olduğu test edilir. Böylece kodu yeniden düzenlediğinde
(refactor) davranış aynı kaldıkça testler bozulmaz.

```tsx
const { user } = renderWithProviders(<LoginPage />, { initialPath: '/login' })

await user.type(screen.getByLabelText('E-posta'), 'harun@example.com')
await user.click(screen.getByRole('button', { name: 'Giriş yap' }))

expect(await screen.findByText('Şifre gerekli.')).toBeInTheDocument()
```

### Eleman bulma: hangi sorguyu kullanmalı?

Öncelik sırası (yukarıdakiler daha iyi):

1. `getByRole('button', { name: 'Kaydet' })`: Erişilebilirlik ağacından bulur. Ekran okuyucunun gördüğü gibi.
2. `getByLabelText('E-posta')`: Form alanları için.
3. `getByText('Başvuru bulunamadı')`: Düz metinler için.
4. `getByTestId(...)`: Son çare. Bu projede hiç gerekmedi.

`getByRole` ile bulamıyorsan bu çoğu zaman bileşende bir **erişilebilirlik hatası**
olduğunu gösterir. Bu projede `ApplicationForm` testi, mülakat kutusundaki `<legend>`
etiketinin yanlış yerde olduğunu bu şekilde yakaladı.

### Sorgu türleri

| Sorgu | Bulamazsa | Ne zaman? |
|---|---|---|
| `getBy...` | Hata fırlatır | Eleman **şu an** ekranda olmalı |
| `queryBy...` | `null` döner | Elemanın **olmadığını** kontrol etmek için |
| `findBy...` | Bekler, sonra hata fırlatır | Eleman **birazdan** gelecek (API cevabı, doğrulama) |

### Kullanıcı etkileşimi

`userEvent` gerçek bir kullanıcı gibi davranır. Örneğin `user.type` her harf için
klavye olaylarını tek tek tetikler. Hepsi asenkron, `await` unutma:

```ts
await user.click(buton)
await user.type(input, 'metin')
await user.clear(input)
await user.selectOptions(select, 'offer')
```

### Sahte fonksiyonlar ve modüller

```ts
// Sahte fonksiyon: çağrıldı mı, hangi argümanlarla?
const signIn = vi.fn().mockResolvedValue(undefined)   // başarılı Promise döner
const signIn = vi.fn().mockRejectedValue(new Error()) // hatalı Promise döner
expect(signIn).toHaveBeenCalledWith('harun@example.com', 'abc12345')

// Sahte modül: gerçek servis yerine testin kontrol ettiği bir versiyon
vi.mock('@/features/applications/api/applicationService', () => ({
  applicationService: { list: vi.fn() },
}))
vi.mocked(applicationService.list).mockResolvedValue([...])
```

**Neyi mock'lamalı?** Sadece sınırları: ağ istekleri, veri servisleri, zaman.
Test ettiğin bileşenin kendi parçalarını mock'lama; yoksa gerçekte çalışmayan bir
şeyi test etmiş olursun.

### `renderWithProviders`

Sayfalar router, TanStack Query ve oturum bilgisine ihtiyaç duyar.
`src/test/render.tsx` bunların hepsini kurar:

```tsx
renderWithProviders(<ListPage />, {
  initialPath: '/applications?status=offer',          // Başlangıç adresi
  auth: { status: 'unauthenticated', user: null },    // Sahte oturum
})
```

## E2E testleri: Playwright

Playwright gerçek bir Chromium tarayıcısı açar, uygulamayı başlatır ve bir kullanıcı
gibi kullanır. Sorgular Testing Library'ye çok benzer:

```ts
test('kayıt olan kullanıcı dashboard\'a yönlenir', async ({ page }) => {
  await page.goto('/register')
  await page.getByLabel('Ad soyad').fill('Harun Doğan')
  // ...
  await page.getByRole('button', { name: 'Kayıt ol' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: /Merhaba/ })).toBeVisible()
})
```

- `expect(...)` kontrolleri **otomatik olarak bekler** (varsayılan 5 saniye). `sleep` yazmana gerek yok.
- Her test **temiz bir tarayıcı profiliyle** başlar (boş localStorage). Testler birbirinden bağımsız.
- E2E testleri her zaman **yerel modda** çalışır. `.env.local`'da Supabase bilgileri olsa bile gerçek veritabanına dokunmaz (bkz. `playwright.config.ts`).

### Faydalı araçlar

```bash
pnpm exec playwright codegen http://localhost:5173   # Tarayıcıda tıkladıkça test kodunu yazar
pnpm exec playwright show-report                     # Son çalıştırmanın HTML raporu
pnpm test:e2e:ui                                     # Adım adım izleme, zaman yolculuğu
```

### Sık yapılan hata: sayfa değişmeden devam etmek

```ts
// ❌ Linke tıkladıktan hemen sonra eski sayfadaki bir elemanı bulabilir
await page.getByRole('link', { name: 'Başvurular' }).click()
await page.getByRole('link', { name: 'Nova Yazılım' }).click()

// ✅ Önce yeni sayfanın açıldığından emin ol
await page.getByRole('link', { name: 'Başvurular' }).click()
await expect(page).toHaveURL('/applications')
await page.getByRole('link', { name: 'Nova Yazılım', exact: true }).click()
```

Bu projede `e2e/helpers.ts` içindeki `goToApplications` bu işi yapıyor.

## Kendin dene: alıştırmalar

Kolaydan zora doğru:

1. **`formatSalaryRange` için birim testi yaz** (`src/lib/format.ts`). Sadece alt sınır, sadece üst sınır ve ikisi de boşken ne döndüğünü kontrol et.
2. **`StatusBadge` için bileşen testi yaz.** Her durum için doğru Türkçe etiketi gösteriyor mu?
3. **`LoginPage` testine ekle:** Giriş yapılırken (`signIn` henüz bitmemişken) buton devre dışı olmalı. İpucu: hiç çözülmeyen bir Promise döndür: `vi.fn(() => new Promise(() => {}))`, sonra `toBeDisabled()`.
4. **`ApplicationForm` testine ekle:** Eklenen bir mülakat "Kaldır" butonuyla silinebilmeli.
5. **E2E testi yaz:** Tema "Koyu" seçilince `<html>` etiketine `dark` class'ı eklenmeli ve sayfa yenilense de korunmalı. İpucu: `expect(page.locator('html')).toHaveClass(/dark/)`.
6. **Bir hata yakala:** Bir bileşende bilerek küçük bir hata yap (ör. `ListPage`'de filtreyi ters çevir) ve hangi testlerin bozulduğuna bak. Testlerin seni nasıl koruduğunu görmenin en iyi yolu bu.
