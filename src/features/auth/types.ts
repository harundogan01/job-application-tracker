export type AuthUser = {
  id: string
  email: string
  fullName: string
}

export type SignUpInput = {
  fullName: string
  email: string
  password: string
}

export type SignUpResult = {
  /** Supabase'de e-posta doğrulaması açıksa kayıttan sonra oturum hemen açılmaz */
  needsEmailConfirmation: boolean
}

/** Tüm auth servislerinin uyması gereken sözleşme (interface) */
export type AuthService = {
  getCurrentUser: () => Promise<AuthUser | null>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (input: SignUpInput) => Promise<SignUpResult>
  signOut: () => Promise<void>
  /** Oturum değiştiğinde çağrılır. Aboneliği iptal eden bir fonksiyon döner. */
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => () => void
}

/** Kullanıcıya gösterilebilecek, Türkçe mesajlı hata */
export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}
