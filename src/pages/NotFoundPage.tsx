import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button-variants'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Sayfa bulunamadı</h1>
      <p className="mt-2 text-gray-500">Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <Link to="/" className={buttonVariants({ className: 'mt-6' })}>
        Ana sayfaya dön
      </Link>
    </div>
  )
}
