import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { ThemeSync } from '@/components/ThemeSync'
import { queryClient } from '@/app/queryClient'
import { AuthProvider } from '@/features/auth/context/AuthProvider'
import { useUiStore } from '@/stores/uiStore'

/**
 * Tüm global provider'lar tek yerde. Sıra önemli:
 * AuthProvider, çıkış yapıldığında önbelleği temizleyebilmek için
 * QueryClientProvider'ın içinde olmalı.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const theme = useUiStore((state) => state.theme)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeSync />
        {children}
        <Toaster position="top-right" richColors closeButton theme={theme} />
      </AuthProvider>
      {/* Sadece geliştirme ortamında görünür, production build'e girmez */}
      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}
