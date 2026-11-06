import { Outlet } from 'react-router'
import { Menu, Briefcase } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { useUiStore } from '@/stores/uiStore'

export default function AppLayout() {
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        {/* Mobil üst bar: menü butonu sadece küçük ekranlarda görünür */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-white/80 px-4 backdrop-blur lg:hidden dark:bg-gray-950/80">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-ml-1 cursor-pointer rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="size-5" aria-hidden />
            <span className="sr-only">Menüyü aç</span>
          </button>
          <span className="flex items-center gap-2 font-semibold">
            <Briefcase className="size-5 text-indigo-600" aria-hidden />
            Başvuru Takip
          </span>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
