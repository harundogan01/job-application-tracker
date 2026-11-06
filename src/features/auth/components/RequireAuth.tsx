import { Navigate, Outlet, useLocation } from 'react-router'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/features/auth/useAuth'

/**
 * Korumalı route'lar için layout route'u.
 * Giriş yapılmamışsa /login'e yönlendirir ve gidilmek istenen adresi
 * state içinde saklar; girişten sonra kullanıcı oraya geri döner.
 * Vue Router'daki beforeEach guard'ının bileşen tabanlı karşılığı.
 */
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <Spinner className="min-h-screen" label="Oturum kontrol ediliyor…" />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
