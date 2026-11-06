import { use } from 'react'
import { AuthContext } from '@/features/auth/context/AuthContext'

/**
 * Oturum bilgisine erişmek için custom hook.
 * Vue'daki composable'ların (useXxx) karşılığı.
 *
 * React 19'daki use() API'si useContext gibi çalışır.
 */
export function useAuth() {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth, <AuthProvider> içinde kullanılmalı.')
  }
  return context
}
