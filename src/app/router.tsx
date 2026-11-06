import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { Spinner } from '@/components/ui/Spinner'
import AppLayout from '@/components/layout/AppLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import { RedirectIfAuthenticated } from '@/features/auth/components/RedirectIfAuthenticated'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import NotFoundPage from '@/pages/NotFoundPage'
import RouteErrorPage from '@/pages/RouteErrorPage'

/**
 * Sayfaları "lazy" yüklemek için yardımcı. Her sayfa ayrı bir JS dosyasına
 * (chunk) bölünür ve sadece o sayfaya gidildiğinde indirilir.
 * `pnpm build` çıktısında her sayfanın ayrı dosya olduğunu görebilirsin.
 */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
    // Kök route: Component vermezsek sadece <Outlet /> render eder.
    // Hata sayfası ve ilk yükleme göstergesi tüm alt route'lar için geçerli.
    ErrorBoundary: RouteErrorPage,
    HydrateFallback: () => <Spinner className="min-h-screen" />,
    children: [
      {
        // Korumalı alan: giriş yapılmadan erişilemez
        Component: RequireAuth,
        children: [
          {
            Component: AppLayout,
            children: [
              { index: true, lazy: page(() => import('@/features/dashboard/pages/DashboardPage')) },
              {
                path: 'applications',
                children: [
                  { index: true, lazy: page(() => import('@/features/applications/pages/ListPage')) },
                  { path: 'new', lazy: page(() => import('@/features/applications/pages/NewPage')) },
                  { path: ':id', lazy: page(() => import('@/features/applications/pages/DetailsPage')) },
                  { path: ':id/edit', lazy: page(() => import('@/features/applications/pages/EditPage')) },
                ],
              },
            ],
          },
        ],
      },
      {
        // Sadece giriş yapmamış kullanıcılar için
        Component: RedirectIfAuthenticated,
        children: [
          {
            Component: AuthLayout,
            children: [
              { path: 'login', lazy: page(() => import('@/features/auth/pages/LoginPage')) },
              { path: 'register', lazy: page(() => import('@/features/auth/pages/RegisterPage')) },
            ],
          },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
