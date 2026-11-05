import { NavLink } from 'react-router'
import { Briefcase, LayoutDashboard, ListChecks, LogOut, Plus, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { DataModeNotice } from '@/components/layout/DataModeNotice'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useAuth } from '@/features/auth/useAuth'
import { useUiStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const navItems = [
  // "end": sadece adres tam olarak "/" iken aktif olsun. Olmazsa "/" her
  // adresin başında olduğu için bu link her sayfada aktif görünür.
  { to: '/', label: 'Genel bakış', icon: LayoutDashboard, end: true },
  { to: '/applications', label: 'Başvurular', icon: ListChecks, end: false },
]

export function Sidebar() {
  const { user, signOut } = useAuth()
  const isOpen = useUiStore((state) => state.isSidebarOpen)
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen)
  const close = () => setSidebarOpen(false)

  return (
    <>
      {/* Mobilde menü açıkken arkadaki karartma; tıklayınca menüyü kapatır */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={close} aria-hidden />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white transition-transform dark:bg-gray-900',
          'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <span className="flex items-center gap-2 font-semibold">
            <Briefcase className="size-5 text-indigo-600" aria-hidden />
            Başvuru Takip
          </span>
          <button
            type="button"
            onClick={close}
            className="cursor-pointer rounded-md p-1 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
          >
            <X className="size-5" aria-hidden />
            <span className="sr-only">Menüyü kapat</span>
          </button>
        </div>

        <div className="px-4">
          <NavLink
            to="/applications/new"
            onClick={close}
            className={buttonVariants({ className: 'w-full' })}
          >
            <Plus className="size-4" aria-hidden /> Yeni başvuru
          </NavLink>
        </div>

        <nav className="mt-6 flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={close}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                )
              }
            >
              <Icon className="size-4" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-4 border-t p-4">
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
              {(user?.fullName || user?.email || '?').charAt(0).toLocaleUpperCase('tr')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.fullName || 'Kullanıcı'}</p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut()}
              title="Çıkış yap"
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
              <LogOut className="size-4" aria-hidden />
              <span className="sr-only">Çıkış yap</span>
            </button>
          </div>
          <DataModeNotice />
        </div>
      </aside>
    </>
  )
}
