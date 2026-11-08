# Başvuru Takip

İş başvurularını, mülakat süreçlerini ve notlarını takip etmek için bir React uygulaması.
Vue.js geçmişinden React'e geçiş sürecinde öğrenme projesi olarak hazırlandı. Kodun
içindeki yorumlar React'e özgü kavramları ve Vue'daki karşılıklarını açıklıyor.

## Özellikler

- **Kayıt ve giriş:** Korumalı sayfalar, girişten sonra gidilmek istenen sayfaya geri dönme
- **Başvurular:** Listeleme, ekleme, düzenleme, silme
- **Çok adımlı form:** Adım bazında doğrulama, dinamik mülakat alanları, kaydedilmemiş değişiklik uyarısı
- **Arama ve filtreler:** URL'de tutulur; sayfa yenilense de kaybolmaz, link paylaşılabilir
- **Hızlı durum değişikliği:** Sunucu cevabı beklenmeden anında güncellenir (optimistic update)
- **Dashboard:** İstatistikler, durum dağılımı, yaklaşan mülakatlar
- **Diğer:** Açık/koyu tema, mobil uyumlu arayüz, tablo/kart görünümü
- **İki veri kaynağı:** Supabase ya da kurulum gerektirmeyen yerel mod (localStorage)

## Teknolojiler

| İhtiyaç | Kullanılan | Vue'daki karşılığı |
|---|---|---|
| Arayüz | React 19 + TypeScript | Vue 3 |
| Derleme | Vite | Vite |
| Yönlendirme | React Router | Vue Router |
| Sunucu verisi | TanStack Query | (genelde Pinia'da elle yazılır) |
| Global state | Zustand | Pinia |
| Formlar | React Hook Form | VeeValidate |
| Doğrulama | Zod | Zod / Yup |
| Stil | Tailwind CSS v4 | |
| Backend | Supabase (Auth + Postgres) | |
| Testler | Vitest, React Testing Library, Playwright | Vitest, Vue Test Utils |

## Kurulum

Gereksinimler: Node.js 22+ ve pnpm.

```bash
pnpm install
```

```bash
pnpm dev
```

Uygulama http://localhost:5173 adresinde açılır. Hiçbir ayar yapmadan **yerel modda**
çalışır: kullanıcılar ve başvurular tarayıcının localStorage'ında tutulur. Kayıt olup
"Örnek veri ekle" butonuyla hemen deneyebilirsin.

> Yerel mod sadece geliştirme ve öğrenme içindir; gerçek bir güvenlik sağlamaz.

### Supabase'e bağlanmak

1. [supabase.com](https://supabase.com) üzerinde ücretsiz bir proje oluştur.
2. Panelde **SQL Editor**'ü aç, `supabase/migrations/0001_create_applications.sql` dosyasının içeriğini yapıştır ve **Run** ile çalıştır. Bu dosya tabloyu ve güvenlik kurallarını (RLS) oluşturur.
3. **Project Settings → API Keys** sayfasından proje URL'ini ve **publishable** anahtarı kopyala.
4. `.env.example` dosyasını `.env.local` adıyla kopyala ve değerleri doldur:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
5. **Authentication → URL Configuration** sayfasında **Site URL** alanına `http://localhost:5173` yaz. Kayıt doğrulama e-postasındaki link buraya yönlenir.
6. Geliştirme sunucusunu yeniden başlat. Kenar çubuğunun altında "Supabase'e bağlı" yazısını görmelisin.

Supabase'de e-posta doğrulaması varsayılan olarak açıktır. Kayıttan sonra uygulama
"E-postanı kontrol et" ekranı gösterir. Geliştirme sırasında bununla uğraşmak
istemezsen **Authentication → Sign In / Providers → Email** altından
"Confirm email" seçeneğini kapatabilirsin.

`.env.local` dosyası `.gitignore`'da, repoya girmez. Publishable anahtar tarayıcıda
herkese görünür, bu normaldir. Verilerin güvenliğini veritabanındaki RLS kuralları sağlar.

## Komutlar

| Komut | Açıklama |
|---|---|
| `pnpm dev` | Geliştirme sunucusu |
| `pnpm build` | Tip kontrolü + production build |
| `pnpm preview` | Build çıktısını yerelde çalıştırır |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript tip kontrolü |
| `pnpm test` | Birim ve bileşen testleri |
| `pnpm test:watch` | Testleri izleme modunda çalıştırır |
| `pnpm test:e2e` | Uçtan uca testler (ilk seferde: `pnpm exec playwright install chromium`) |

Testlerin nasıl yazıldığını anlatan rehber: **[docs/TESTLER.md](docs/TESTLER.md)**

## Proje yapısı

```
src/
├── app/                    # Uygulamanın iskeleti
│   ├── router.tsx          #   Tüm route'lar (lazy yüklenen sayfalar, korumalı alanlar)
│   ├── AppProviders.tsx    #   Global provider'lar (Query, Auth, tema, bildirimler)
│   └── queryClient.ts      #   TanStack Query ayarları
├── components/
│   ├── layout/             # AppLayout, AuthLayout, Sidebar, tema seçici
│   └── ui/                 # Tekrar kullanılabilir bileşenler: Button, Input, FormField, Card...
├── features/               # Özellik bazlı klasörler: her özellik kendi içinde bütün
│   ├── auth/
│   │   ├── api/            #   authService + local ve Supabase uygulamaları
│   │   ├── context/        #   AuthContext ve AuthProvider
│   │   ├── components/     #   RequireAuth, RedirectIfAuthenticated (route guard'ları)
│   │   ├── pages/          #   LoginPage, RegisterPage
│   │   ├── schemas.ts      #   Zod doğrulama şemaları
│   │   └── useAuth.ts      #   Oturum bilgisine erişim hook'u
│   ├── applications/
│   │   ├── api/            #   applicationService + local ve Supabase uygulamaları
│   │   ├── hooks/          #   TanStack Query hook'ları, URL filtreleri
│   │   ├── components/     #   Form, tablo, kartlar, rozetler...
│   │   ├── pages/          #   List, Details, New, Edit
│   │   ├── utils/          #   Saf fonksiyonlar: filtreleme, istatistikler
│   │   ├── schemas.ts      #   Form şeması ve dönüşümler
│   │   ├── constants.ts    #   Durum etiketleri, renkler, seçenekler
│   │   └── types.ts        #   Tipler
│   └── dashboard/
├── lib/                    # Genel yardımcılar: biçimlendirme, env, Supabase istemcisi
├── stores/uiStore.ts       # Zustand: tema ve görünüm tercihleri
├── pages/                  # Özelliğe ait olmayan sayfalar: 404, hata sayfası
└── test/                   # Test kurulumu ve yardımcıları
e2e/                        # Playwright testleri
supabase/migrations/        # Veritabanı şeması ve RLS kuralları
```

## Mimari: state nerede duruyor?

React'te "her şeyi tek bir store'a koymak" yerine, state türüne göre farklı araçlar kullanılır:

| State türü | Örnek | Nerede? |
|---|---|---|
| **Sunucu verisi** | Başvurular | TanStack Query (`features/applications/hooks/useApplications.ts`) |
| **Oturum** | Giriş yapan kullanıcı | React Context (`features/auth/context/AuthProvider.tsx`) |
| **Arayüz tercihleri** | Tema, liste görünümü | Zustand (`stores/uiStore.ts`) |
| **URL state'i** | Arama, filtre, sıralama | `useSearchParams` (`features/applications/hooks/useApplicationFilters.ts`) |
| **Form state'i** | Form alanları, hatalar | React Hook Form (`features/applications/components/ApplicationForm.tsx`) |
| **Yerel state** | Silme penceresi açık mı? | `useState` (bileşenin içinde) |
| **Türetilmiş veri** | İstatistikler, filtrelenmiş liste | State değil; render sırasında hesaplanır (`useMemo`) |

### Servis katmanı

Bileşenler veriye doğrudan Supabase ile değil, bir **servis arayüzü** üzerinden erişir:

```
Bileşen → useApplications() → applicationService → localApplicationService
                                                 ↘ supabaseApplicationService
```

Hangi uygulamanın kullanılacağı `.env`'e göre seçilir (`features/applications/api/applicationService.ts`).
Bileşenler ve hook'lar bu farkı hiç bilmez. Yarın başka bir backend'e geçmek istersen
sadece yeni bir servis yazman yeterli.

## Kodu okumaya nereden başlamalı?

1. `src/main.tsx` ve `src/app/AppProviders.tsx`: uygulama nasıl ayağa kalkıyor
2. `src/app/router.tsx`: sayfalar ve korumalı alanlar
3. `src/features/auth/`: Context, custom hook, route guard'ları ve ilk formlar
4. `src/features/applications/hooks/useApplications.ts`: TanStack Query ve optimistic update
5. `src/features/applications/components/ApplicationForm.tsx`: çok adımlı form, `useFieldArray`, `useBlocker`
6. `src/features/applications/pages/ListPage.tsx`: URL'deki filtreler, `useMemo`, `useDeferredValue`

## Kendin dene: React alıştırmaları

Kolaydan zora doğru. Her birini ayrı bir `feature/...` branch'inde yapmanı öneririm.

1. **Yeni alan ekle:** Başvurulara "İletişim kişisi" alanı ekle. Tip, Zod şeması, form, detay sayfası ve Supabase tablosu (yeni bir migration dosyası) adımlarından geçmen gerekecek.
2. **Şifremi unuttum:** Supabase'in `resetPasswordForEmail` fonksiyonuyla şifre sıfırlama sayfası ekle (route + form + servis metodu).
3. **Profil sayfası:** Kullanıcının adını güncelleyebileceği bir `/profile` sayfası ekle.
4. **Kanban görünümü:** Başvuruları durum sütunlarında göster. Sürükle-bırak için `@dnd-kit/core` kütüphanesini kullanabilirsin; bırakılınca `useUpdateApplicationStatus` çağrılmalı.
5. **Performans:** React DevTools Profiler ile liste sayfasında arama yaparken hangi bileşenlerin yeniden render olduğunu incele. Ardından [React Compiler](https://react.dev/learn/react-compiler)'ı açıp farkı karşılaştır.
6. **Bundle boyutu:** `pnpm build` çıktısında ana JS dosyası büyük, çünkü Supabase istemcisi yerel modda da yükleniyor. Supabase modülünü sadece gerektiğinde `import()` ile yükleyerek küçült.
7. **Mülakatları ayrı tabloya taşı:** Şu an mülakatlar `jsonb` sütununda duruyor. Ayrı bir `interviews` tablosu oluştur ve servis katmanını buna göre güncelle. Bileşenlerde değişiklik gerekmemeli.
