import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { AuthContext, type AuthStatus } from '@/features/auth/context/AuthContext'
import { createAuthValue } from '@/test/render'

/** Login sayfası yerine, yönlendirmenin taşıdığı "from" bilgisini gösteren sahte sayfa */
function FakeLoginPage() {
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string; search: string } } | null)?.from
  return <p>Login sayfası (geri dönülecek: {from ? from.pathname + from.search : 'yok'})</p>
}

function renderAt(path: string, status: AuthStatus) {
  // Bu testte router'ı kendimiz kuruyoruz, çünkü korumalı ve açık route'ların
  // birlikte nasıl çalıştığını görmek istiyoruz.
  const router = createMemoryRouter(
    [
      {
        Component: RequireAuth,
        children: [{ path: '/applications', element: <p>Gizli sayfa</p> }],
      },
      { path: '/login', Component: FakeLoginPage },
    ],
    { initialEntries: [path] },
  )

  render(
    <AuthContext value={createAuthValue({ status, user: null })}>
      <RouterProvider router={router} />
    </AuthContext>,
  )
}

describe('RequireAuth', () => {
  it('giriş yapılmışsa sayfayı gösterir', () => {
    renderAt('/applications', 'authenticated')
    expect(screen.getByText('Gizli sayfa')).toBeInTheDocument()
  })

  it('giriş yapılmamışsa login\'e yönlendirir ve gidilmek istenen adresi saklar', () => {
    renderAt('/applications?status=offer', 'unauthenticated')

    // queryBy... bulamazsa hata fırlatmaz, null döner: "olmadığını" kontrol etmek için
    expect(screen.queryByText('Gizli sayfa')).not.toBeInTheDocument()
    expect(
      screen.getByText('Login sayfası (geri dönülecek: /applications?status=offer)'),
    ).toBeInTheDocument()
  })

  it('oturum kontrol edilirken yükleniyor göstergesi gösterir', () => {
    renderAt('/applications', 'loading')
    expect(screen.getByRole('status')).toHaveTextContent('Oturum kontrol ediliyor…')
  })
})
