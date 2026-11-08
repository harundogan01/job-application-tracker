import { env } from '@/lib/env'
import { localAuthService } from '@/features/auth/api/localAuthService'
import { supabaseAuthService } from '@/features/auth/api/supabaseAuthService'
import type { AuthService } from '@/features/auth/types'

/**
 * Uygulamanın geri kalanı sadece bu nesneyi kullanır.
 * Hangi uygulamanın (local / Supabase) çalışacağı .env'e göre seçilir;
 * bileşenler bu farkı hiç bilmez.
 */
export const authService: AuthService = env.isSupabaseEnabled
  ? supabaseAuthService
  : localAuthService
