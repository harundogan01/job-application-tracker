import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { buttonVariants } from '@/components/ui/button-variants'

/**
 * Route'larda yakalanmayan bir hata olursa (ör. bir bileşen render sırasında
 * hata fırlatırsa) tüm uygulama beyaz ekrana düşmek yerine bu sayfa gösterilir.
 */
export default function RouteErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Bilinmeyen bir hata'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold">Bir şeyler ters gitti</h1>
      <p className="mt-2 max-w-md text-sm text-gray-500">{message}</p>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className={buttonVariants({ variant: 'secondary' })}
        >
          Sayfayı yenile
        </button>
        <Link to="/" className={buttonVariants()}>
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  )
}
