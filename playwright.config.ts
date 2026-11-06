import { defineConfig, devices } from '@playwright/test'

const PORT = 4321
const isCI = Boolean(process.env.CI)

/**
 * Uçtan uca (E2E) testlerin ayarları. Ayrıntılar: docs/TESTLER.md
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  // CI'da yanlışlıkla bırakılmış test.only varsa hata ver
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    // Başarısız bir test tekrar denendiğinde adım adım kayıt al (npx playwright show-trace)
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Tarayıcı farklı bir yerde kuruluysa yolu ortam değişkeniyle verilebilir
        launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined },
      },
    },
  ],
  // Testlerden önce geliştirme sunucusunu başlatır, testler bitince kapatır
  webServer: {
    command: `pnpm dev --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    // .env.local'da Supabase bilgileri olsa bile testler her zaman yerel modda
    // çalışsın; gerçek veritabanına test verisi yazılmasın.
    env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_PUBLISHABLE_KEY: '' },
  },
})
