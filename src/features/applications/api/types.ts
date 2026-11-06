import type { Application, ApplicationInput } from '@/features/applications/types'

/**
 * Başvuru verisine erişimin sözleşmesi. Bileşenler ve hook'lar sadece bu
 * arayüzü bilir; verinin localStorage'dan mı Supabase'den mi geldiğini bilmez.
 * Yeni bir backend eklemek isteseydin sadece bu arayüzü uygulaman yeterdi.
 */
export type ApplicationService = {
  list: () => Promise<Application[]>
  get: (id: string) => Promise<Application>
  create: (input: ApplicationInput) => Promise<Application>
  update: (id: string, input: Partial<ApplicationInput>) => Promise<Application>
  remove: (id: string) => Promise<void>
  /** Hesaba birkaç örnek başvuru ekler (boş ekranda deneme yapmak için) */
  seed: (items: ApplicationInput[]) => Promise<void>
}
