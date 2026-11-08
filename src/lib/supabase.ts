import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Supabase istemcisi. Yerel modda null olur.
 * Uygulamanın geri kalanı bu dosyayı doğrudan değil, servis katmanı
 * (features/.../api klasörleri) üzerinden kullanır.
 */
export const supabase = env.isSupabaseEnabled
  ? createClient(env.supabaseUrl!, env.supabaseKey!)
  : null

export function requireSupabase() {
  if (!supabase) throw new Error('Supabase yapılandırılmamış.')
  return supabase
}
