/**
 * Ortam değişkenleri tek bir yerden okunur.
 * Vite sadece VITE_ ile başlayan değişkenleri tarayıcı koduna aktarır.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined

export const env = {
  supabaseUrl,
  supabaseKey,
  /** İki değer de doluysa Supabase kullanılır, değilse yerel (localStorage) mod. */
  isSupabaseEnabled: Boolean(supabaseUrl && supabaseKey),
}
