/**
 * Yerel modda ağ gecikmesini taklit eder. Böylece loading durumlarını
 * Supabase'e bağlanmadan da görebilirsin.
 */
export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
