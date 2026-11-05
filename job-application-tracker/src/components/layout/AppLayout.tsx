import { NavLink, Outlet } from 'react-router'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <nav className="w-56 border-r p-4 flex flex-col gap-2">
        <NavLink
          to="/applications"
          className={({ isActive }) =>
            isActive ? 'font-semibold text-blue-600' : 'text-gray-600'
          }
        >
          Texts
        </NavLink>
        {'Hi, how are you?'}

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </nav>
    </div>
  )
}