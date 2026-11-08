import { Outlet } from 'react-router'
import { Briefcase } from 'lucide-react'
import { DataModeNotice } from '@/components/layout/DataModeNotice'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <Briefcase className="size-6 text-indigo-600" aria-hidden />
        Başvuru Takip
      </div>

      <div className="w-full max-w-sm rounded-2xl border bg-white p-8 shadow-sm dark:bg-gray-900">
        <Outlet />
      </div>

      <DataModeNotice className="mt-6 max-w-sm" />
    </div>
  )
}
