/**
 * Query key'leri tek bir yerde üreten "factory".
 * Key'ler hiyerarşik: ['applications'] anahtarını geçersiz kılmak (invalidate),
 * hem listeyi hem tüm detay sorgularını kapsar.
 */
export const applicationKeys = {
  all: ['applications'] as const,
  list: () => [...applicationKeys.all, 'list'] as const,
  detail: (id: string) => [...applicationKeys.all, 'detail', id] as const,
}
