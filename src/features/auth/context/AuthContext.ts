import { createContext } from 'react'
import type { AuthUser, SignUpInput, SignUpResult } from '@/features/auth/types'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export type AuthContextValue = {
  user: AuthUser | null
  status: AuthStatus
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: SignUpInput) => Promise<SignUpResult>
  signOut: () => Promise<void>
}

/**
 * Context, bir değeri bileşen ağacının derinliklerine prop geçmeden ulaştırır.
 * Vue'daki provide/inject'in karşılığı.
 */
export const AuthContext = createContext<AuthContextValue | null>(null)
