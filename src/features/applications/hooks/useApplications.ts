import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NotFoundError } from '@/lib/errors'
import { applicationService } from '@/features/applications/api/applicationService'
import { createSampleApplications } from '@/features/applications/api/sampleData'
import { applicationKeys } from '@/features/applications/hooks/queryKeys'
import type { Application, ApplicationInput, ApplicationStatus } from '@/features/applications/types'

/*
 * TanStack Query, "sunucu verisi" için bir önbellek yöneticisi.
 * useQuery veriyi çeker, önbelleğe alır, loading/error durumlarını verir.
 * useMutation veriyi değiştirir; başarılı olunca ilgili sorguları güncelleriz.
 *
 * Vue'da bunu genelde Pinia store'unda elle yazarsın (loading, error, fetch...).
 * Burada bu işi kütüphane yapıyor; bileşenler sadece hook'u çağırıyor.
 */

export function useApplications() {
  return useQuery({
    queryKey: applicationKeys.list(),
    queryFn: applicationService.list,
  })
}

export function useApplication(id: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: applicationKeys.detail(id),
    queryFn: () => applicationService.get(id),
    // Listeden detaya geçerken veri zaten önbellekte varsa onu hemen göster;
    // arka planda yine de güncel hali çekilir. Sayfa anında açılmış olur.
    initialData: () =>
      queryClient
        .getQueryData<Application[]>(applicationKeys.list())
        ?.find((application) => application.id === id),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(applicationKeys.list())?.dataUpdatedAt,
    // Kayıt yoksa tekrar denemenin anlamı yok
    retry: (failureCount, error) => !(error instanceof NotFoundError) && failureCount < 1,
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ApplicationInput) => applicationService.create(input),
    onSuccess: (created) => {
      queryClient.setQueryData(applicationKeys.detail(created.id), created)
      return queryClient.invalidateQueries({ queryKey: applicationKeys.list() })
    },
  })
}

export function useUpdateApplication(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ApplicationInput) => applicationService.update(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(applicationKeys.detail(id), updated)
      return queryClient.invalidateQueries({ queryKey: applicationKeys.list() })
    },
  })
}

/**
 * Durum değişikliği için "optimistic update": sunucunun cevabını beklemeden
 * arayüzü hemen güncelle, hata olursa eski haline geri döndür.
 * Küçük ve sık yapılan işlemlerde uygulamayı çok daha hızlı hissettirir.
 */
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationService.update(id, { status }),

    onMutate: async ({ id, status }) => {
      // Devam eden sorgular bizim iyimser güncellememizin üzerine yazmasın
      await queryClient.cancelQueries({ queryKey: applicationKeys.all })

      const previousDetail = queryClient.getQueryData<Application>(applicationKeys.detail(id))
      const previousList = queryClient.getQueryData<Application[]>(applicationKeys.list())

      queryClient.setQueryData<Application>(applicationKeys.detail(id), (old) =>
        old ? { ...old, status } : old,
      )
      queryClient.setQueryData<Application[]>(applicationKeys.list(), (old) =>
        old?.map((a) => (a.id === id ? { ...a, status } : a)),
      )

      // Bu değer onError'a "context" olarak geçer
      return { previousDetail, previousList }
    },

    onError: (_error, { id }, context) => {
      queryClient.setQueryData(applicationKeys.detail(id), context?.previousDetail)
      queryClient.setQueryData(applicationKeys.list(), context?.previousList)
    },

    // Başarılı da olsa hatalı da olsa sonunda sunucudaki gerçek veriyle eşitle
    onSettled: () => queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
  })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => applicationService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: applicationKeys.detail(id) })
      queryClient.setQueryData<Application[]>(applicationKeys.list(), (old) =>
        old?.filter((a) => a.id !== id),
      )
    },
  })
}

export function useSeedApplications() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => applicationService.seed(createSampleApplications()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationKeys.all }),
  })
}
