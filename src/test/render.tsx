import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router'
import { AuthContext, type AuthContextValue } from '@/features/auth/context/AuthContext'
import type { AuthUser } from '@/features/auth/types'

export const testUser: AuthUser = {
  id: 'user-1',
  email: 'harun@example.com',
  fullName: 'Harun Doğan',
}

/**
 * Gerçek AuthProvider yerine, testin istediği değerleri veren sahte bir
 * context değeri. Her fonksiyon vi.fn() ile değiştirilebilir.
 */
export function createAuthValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    user: testUser,
    status: 'authenticated',
    signIn: async () => {},
    signUp: async () => ({ needsEmailConfirmation: false }),
    signOut: async () => {},
    ...overrides,
  }
}

type RenderOptions = {
  /** Uygulamanın başlayacağı adres, ör. '/applications?status=offer' */
  initialPath?: string
  /** Ek route'lar: yönlendirmelerin nereye gittiğini kontrol etmek için */
  routes?: RouteObject[]
  auth?: Partial<AuthContextValue>
}

/**
 * Bir bileşeni uygulamadaki gibi provider'larla sararak render eder:
 * TanStack Query + sahte auth + bellekte çalışan bir router.
 *
 * Kullanım:
 *   const { user } = renderWithProviders(<LoginPage />, { initialPath: '/login' })
 *   await user.click(screen.getByRole('button', { name: 'Giriş yap' }))
 */
export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const { initialPath = '/', routes = [], auth } = options

  const queryClient = new QueryClient({
    // Testlerde başarısız istekleri tekrar denemesin, yoksa testler yavaşlar
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  // Test edilen bileşen, başlangıç adresine karşılık gelen route'ta render edilir
  const path = initialPath.split('?')[0]
  const router = createMemoryRouter([{ path, element: ui }, ...routes], {
    initialEntries: [initialPath],
  })

  const authValue = createAuthValue(auth)

  const result = render(
    <QueryClientProvider client={queryClient}>
      <AuthContext value={authValue}>
        <RouterProvider router={router} />
      </AuthContext>
    </QueryClientProvider>,
  )

  return {
    ...result,
    router,
    queryClient,
    auth: authValue,
    // userEvent gerçek kullanıcı etkileşimlerini taklit eder (tıklama, yazma, tab...)
    user: userEvent.setup(),
  }
}
