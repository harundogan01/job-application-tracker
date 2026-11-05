import { Outlet } from 'react-router'
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}