import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '@/features/auth/api/authService'
import { AuthContext, type AuthStatus } from '@/features/auth/context/AuthContext'
import type { AuthUser, SignUpInput } from '@/features/auth/types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const queryClient = useQueryClient()
  // Render'ı tetiklemesi gerekmeyen değişken değerler için useRef kullanılır
  const currentUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Uygulama açıldığında mevcut oturumu kontrol et
    let ignore = false
    authService.getCurrentUser().then((currentUser) => {
      if (ignore) return
      currentUserIdRef.current = currentUser?.id ?? null
      setUser(currentUser)
      setStatus(currentUser ? 'authenticated' : 'unauthenticated')
    })

    // Giriş, çıkış ve token yenileme gibi değişiklikleri dinle
    const unsubscribe = authService.onAuthStateChange((nextUser) => {
      const nextUserId = nextUser?.id ?? null
      // Kullanıcı değiştiyse önceki kullanıcının önbellekteki verilerini temizle
      if (currentUserIdRef.current !== nextUserId) {
        queryClient.clear()
        currentUserIdRef.current = nextUserId
      }
      setUser(nextUser)
      setStatus(nextUser ? 'authenticated' : 'unauthenticated')
    })

    // StrictMode geliştirme ortamında effect'leri iki kez çalıştırır.
    // Temizlik fonksiyonu doğru yazıldıysa bu hiçbir soruna yol açmaz.
    return () => {
      ignore = true
      unsubscribe()
    }
  }, [queryClient])

  const signIn = useCallback(
    (email: string, password: string) => authService.signIn(email, password),
    [],
  )
  const signUp = useCallback((input: SignUpInput) => authService.signUp(input), [])
  const signOut = useCallback(() => authService.signOut(), [])

  // Context değeri her render'da yeni bir nesne olursa, bu context'i kullanan
  // tüm bileşenler gereksiz yere yeniden render olur. useMemo bunu önler.
  const value = useMemo(
    () => ({ user, status, signIn, signUp, signOut }),
    [user, status, signIn, signUp, signOut],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
