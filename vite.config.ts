import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // jsdom: Node içinde sahte bir tarayıcı (document, window, localStorage...).
    // React bileşenlerini test edebilmek için gerekli.
    environment: 'jsdom',
    // Her test dosyasından önce çalışır (bkz. src/test/setup.ts)
    setupFiles: ['./src/test/setup.ts'],
    // e2e klasöründeki testler Vitest ile değil Playwright ile çalışır
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
})
