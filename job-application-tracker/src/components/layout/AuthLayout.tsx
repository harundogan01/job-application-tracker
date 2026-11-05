import { NavLink, Outlet } from 'react-router'
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <nav className="w-56 border-r p-4 flex flex-col gap-2">
        <NavLink
          to="/auth"
          className={({ isActive }) => 
            isActive ? 'font-semibold text-blue-600' : 'text-gray-600'
          }
        >
          Texts
          {'Hi, how are you? Here is Auth Layout'}

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </NavLink>
      </nav>
    </div>
  )
}