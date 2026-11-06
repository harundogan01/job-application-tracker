import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { useSeedApplications } from '@/features/applications/hooks/useApplications'
import { getErrorMessage } from '@/lib/errors'

/** Boş hesaba örnek başvurular ekler */
export function SeedButton() {
  const seed = useSeedApplications()

  return (
    <Button
      variant="secondary"
      isLoading={seed.isPending}
      onClick={() =>
        seed.mutate(undefined, {
          onSuccess: () => toast.success('Örnek başvurular eklendi.'),
          onError: (error) => toast.error(getErrorMessage(error)),
        })
      }
    >
      <Sparkles className="size-4" aria-hidden /> Örnek veri ekle
    </Button>
  )
}
