import type { User } from '@supabase/supabase-js'
import { requireSupabase } from '@/lib/supabase'
import { AuthError, type AuthService, type AuthUser } from '@/features/auth/types'

function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email ?? '',
    fullName: (user.user_metadata?.full_name as string | undefined) ?? '',
  }
}

/** Supabase'in İngilizce hata mesajlarını kullanıcıya gösterilecek Türkçe mesajlara çevirir */
function toAuthError(error: { message: string; code?: string }) {
  switch (error.code) {
    case 'invalid_credentials':
      return new AuthError('E-posta veya şifre hatalı.')
    case 'email_not_confirmed':
      return new AuthError('Giriş yapmadan önce e-posta adresini doğrulaman gerekiyor.')
    case 'user_already_exists':
    case 'email_exists':
      return new AuthError('Bu e-posta adresiyle kayıtlı bir hesap zaten var.')
    case 'weak_password':
      return new AuthError('Şifre yeterince güçlü değil.')
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return new AuthError('Çok fazla deneme yapıldı. Lütfen biraz bekleyip tekrar dene.')
    default:
      return new AuthError(error.message)
  }
}

export const supabaseAuthService: AuthService = {
  async getCurrentUser() {
    const { data } = await requireSupabase().auth.getSession()
    return data.session ? toAuthUser(data.session.user) : null
  },

  async signIn(email, password) {
    const { error } = await requireSupabase().auth.signInWithPassword({ email, password })
    if (error) throw toAuthError(error)
  },

  async signUp({ fullName, email, password }) {
    const { data, error } = await requireSupabase().auth.signUp({
      email,
      password,
      options: {
        // Ek kullanıcı bilgileri user_metadata içinde saklanır
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) throw toAuthError(error)
    return { needsEmailConfirmation: !data.session }
  },

  async signOut() {
    const { error } = await requireSupabase().auth.signOut()
    if (error) throw toAuthError(error)
  },

  onAuthStateChange(callback) {
    const { data } = requireSupabase().auth.onAuthStateChange((_event, session) => {
      callback(session ? toAuthUser(session.user) : null)
    })
    return () => data.subscription.unsubscribe()
  },
}
