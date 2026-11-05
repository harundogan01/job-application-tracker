import { delay } from '@/lib/delay'
import { readJson, removeKey, writeJson } from '@/lib/storage'
import { AuthError, type AuthService, type AuthUser } from '@/features/auth/types'

/**
 * Supabase olmadan çalışabilmek için tarayıcıda taklit edilen auth.
 * ⚠️ Sadece geliştirme ve öğrenme amaçlı: veriler localStorage'da durur,
 * gerçek bir güvenlik sağlamaz.
 */
const USERS_KEY = 'jat-local-users'
const SESSION_KEY = 'jat-local-session'

type StoredUser = AuthUser & { passwordHash: string }

const listeners = new Set<(user: AuthUser | null) => void>()

function notify(user: AuthUser | null) {
  listeners.forEach((listener) => listener(user))
}

async function hash(text: string) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

function getUsers() {
  return readJson<StoredUser[]>(USERS_KEY, [])
}

function toAuthUser({ id, email, fullName }: StoredUser): AuthUser {
  return { id, email, fullName }
}

/** Diğer yerel servislerin (ör. başvurular) oturumdaki kullanıcıyı bilmesi için */
export function getLocalSessionUserId() {
  return readJson<string | null>(SESSION_KEY, null)
}

export const localAuthService: AuthService = {
  async getCurrentUser() {
    const userId = getLocalSessionUserId()
    const user = getUsers().find((u) => u.id === userId)
    return user ? toAuthUser(user) : null
  },

  async signIn(email, password) {
    await delay()
    const user = getUsers().find((u) => u.email === email.toLowerCase())
    if (!user || user.passwordHash !== (await hash(password))) {
      throw new AuthError('E-posta veya şifre hatalı.')
    }
    writeJson(SESSION_KEY, user.id)
    notify(toAuthUser(user))
  },

  async signUp({ fullName, email, password }) {
    await delay()
    const users = getUsers()
    const normalizedEmail = email.toLowerCase()
    if (users.some((u) => u.email === normalizedEmail)) {
      throw new AuthError('Bu e-posta adresiyle kayıtlı bir hesap zaten var.')
    }
    const user: StoredUser = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      fullName,
      passwordHash: await hash(password),
    }
    writeJson(USERS_KEY, [...users, user])
    writeJson(SESSION_KEY, user.id)
    notify(toAuthUser(user))
    return { needsEmailConfirmation: false }
  },

  async signOut() {
    removeKey(SESSION_KEY)
    notify(null)
  },

  onAuthStateChange(callback) {
    listeners.add(callback)
    return () => listeners.delete(callback)
  },
}
