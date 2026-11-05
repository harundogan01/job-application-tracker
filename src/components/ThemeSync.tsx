import { useEffect } from 'react'
import { useUiStore } from '@/stores/uiStore'

/**
 * Seçili temayı <html> etiketine "dark" class'ı olarak uygular.
 * Ekranda hiçbir şey göstermez (null döner).
 *
 * Burada useEffect kullanmak doğru, çünkü React'in yönetmediği bir şeyi
 * (document.documentElement ve sistem tema ayarını) senkronize ediyoruz.
 */
export function ThemeSync() {
  // Store'dan sadece ihtiyaç duyulan alanı seçiyoruz: theme değişmedikçe
  // bu bileşen yeniden render olmaz.
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && media.matches)
      document.documentElement.classList.toggle('dark', isDark)
    }

    apply()
    // "Sistem" seçiliyken işletim sistemi teması değişirse anında uygula
    media.addEventListener('change', apply)
    // Temizlik fonksiyonu: effect tekrar çalışmadan ya da bileşen kaldırılmadan önce çağrılır
    return () => media.removeEventListener('change', apply)
  }, [theme])

  return null
}
