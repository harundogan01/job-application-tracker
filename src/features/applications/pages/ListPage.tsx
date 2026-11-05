import { useDeferredValue, useMemo } from 'react'
import { Link } from 'react-router'
import { Inbox, Plus, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/button-variants'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { ApplicationCards } from '@/features/applications/components/ApplicationCards'
import { ApplicationFiltersBar } from '@/features/applications/components/ApplicationFiltersBar'
import { ApplicationTable } from '@/features/applications/components/ApplicationTable'
import { SeedButton } from '@/features/applications/components/SeedButton'
import { useApplicationFilters } from '@/features/applications/hooks/useApplicationFilters'
import { useApplications } from '@/features/applications/hooks/useApplications'
import { filterApplications } from '@/features/applications/utils/filterApplications'
import { useUiStore } from '@/stores/uiStore'
import { getErrorMessage } from '@/lib/errors'

export default function ListPage() {
  const { data: applications, isPending, error, refetch } = useApplications()
  const { filters, setFilter, clearFilters, hasActiveFilters } = useApplicationFilters()
  const viewMode = useUiStore((state) => state.viewMode)

  // useDeferredValue: arama kutusu her tuşta anında güncellenir, filtreleme
  // ise React'in uygun bulduğu bir anda yapılır. Uzun listelerde yazmanın
  // takılmasını önler.
  const deferredFilters = useDeferredValue(filters)

  // Vue'daki computed'ın karşılığı. Aslında filtreleme bu kadar küçük bir
  // listede her render'da yapılsa da sorun olmazdı; useMemo pahalı
  // hesaplamaları sadece bağımlılıklar değişince tekrarlamak için kullanılır.
  const filtered = useMemo(
    () => filterApplications(applications ?? [], deferredFilters),
    [applications, deferredFilters],
  )

  const newButton = (
    <Link to="/applications/new" className={buttonVariants()}>
      <Plus className="size-4" aria-hidden /> Yeni başvuru
    </Link>
  )

  // Erken return'ler: her durum (yükleniyor, hata, boş) için ayrı ekran
  if (isPending) return <Spinner />

  if (error) {
    return (
      <EmptyState
        icon={SearchX}
        title="Başvurular yüklenemedi"
        description={getErrorMessage(error)}
        action={<Button onClick={() => refetch()}>Tekrar dene</Button>}
      />
    )
  }

  return (
    <>
      <PageHeader
        title="Başvurular"
        description={`Toplam ${applications.length} başvuru`}
        actions={newButton}
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Henüz başvuru yok"
          description="İlk başvurunu ekleyerek başla ya da uygulamayı denemek için örnek verileri yükle."
          action={
            <>
              {newButton}
              <SeedButton />
            </>
          }
        />
      ) : (
        <>
          <ApplicationFiltersBar filters={filters} onChange={setFilter} />

          {filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Sonuç bulunamadı"
              description="Arama ya da filtre kriterlerine uyan başvuru yok."
              action={
                hasActiveFilters && (
                  <Button variant="secondary" onClick={clearFilters}>
                    Filtreleri temizle
                  </Button>
                )
              }
            />
          ) : viewMode === 'cards' ? (
            <ApplicationCards applications={filtered} />
          ) : (
            <ApplicationTable applications={filtered} />
          )}
        </>
      )}
    </>
  )
}
