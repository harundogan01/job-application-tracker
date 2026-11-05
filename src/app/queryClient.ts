import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Veri 30 saniye boyunca "taze" sayılır; bu sürede aynı sorgu için
      // tekrar istek atılmaz, önbellekteki veri kullanılır.
      staleTime: 30_000,
      retry: 1,
    },
  },
})
