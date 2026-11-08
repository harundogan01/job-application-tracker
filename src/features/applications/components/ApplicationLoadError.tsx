import { Link } from 'react-router'
import { SearchX } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { EmptyState } from '@/components/ui/EmptyState'
import { NotFoundError, getErrorMessage } from '@/lib/errors'

/** Detay ve düzenleme sayfalarında kayıt bulunamadığında ya da hata olduğunda */
export function ApplicationLoadError({ error }: { error: Error }) {
  const isNotFound = error instanceof NotFoundError

  return (
    <EmptyState
      icon={SearchX}
      title={isNotFound ? 'Başvuru bulunamadı' : 'Başvuru yüklenemedi'}
      description={
        isNotFound
          ? 'Bu başvuru silinmiş ya da hiç var olmamış olabilir.'
          : getErrorMessage(error)
      }
      action={
        <Link to="/applications" className={buttonVariants({ variant: 'secondary' })}>
          Başvurulara dön
        </Link>
      }
    />
  )
}
