import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type ViewMode = 'table' | 'cards'

type UiState = {
  theme: Theme
  /** Başvuru listesinin görünümü: tablo ya da kart */
  viewMode: ViewMode
  /** Mobilde yan menünün açık olup olmadığı (kalıcı değil) */
  isSidebarOpen: boolean
  setTheme: (theme: Theme) => void
  setViewMode: (mode: ViewMode) => void
  setSidebarOpen: (open: boolean) => void
}

/**
 * Sadece arayüz tercihleri burada.
 *
 * Bu projede state üç farklı yerde duruyor, her birinin görevi farklı:
 * - Sunucu verisi (başvurular)     → TanStack Query (features/applications/hooks)
 * - Oturum bilgisi                 → AuthProvider (React Context)
 * - Arayüz tercihleri              → Bu Zustand store'u
 * - Filtreler ve arama             → URL (useSearchParams), paylaşılabilir linkler için
 *
 * Pinia'daki defineStore'a çok benziyor: state ve action'lar aynı yerde.
 * persist middleware'i seçili alanları localStorage'a yazar.
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'system',
      viewMode: 'table',
      isSidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
    }),
    {
      name: 'jat-ui',
      // isSidebarOpen kalıcı olmasın: sayfa yenilenince menü kapalı başlasın
      partialize: (state) => ({ theme: state.theme, viewMode: state.viewMode }),
    },
  ),
)
