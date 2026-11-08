import { Navigate, Outlet, useLocation, type Location } from 'react-router'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/features/auth/useAuth'

/**
 * Giriş ve kayıt sayfalarını sarmalar. Kullanıcı zaten giriş yapmışsa
 * (ya da az önce giriş yaptıysa) onu gelmek istediği sayfaya gönderir.
 * Bu sayede LoginPage'in kendisi yönlendirme yapmak zorunda kalmaz.
 */
export function RedirectIfAuthenticated() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <Spinner className="min-h-screen" />
  }

  if (status === 'authenticated') {
    const from = (location.state as { from?: Location } | null)?.from
    const target = from ? `${from.pathname}${from.search}` : '/'
    return <Navigate to={target} replace />
  }

  return <Outlet />
}
