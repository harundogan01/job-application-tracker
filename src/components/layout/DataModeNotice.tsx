import { Database, HardDrive } from 'lucide-react'
import { env } from '@/lib/env'
import { cn } from '@/lib/utils'

/** Uygulamanın hangi veri kaynağıyla çalıştığını gösterir */
export function DataModeNotice({ className }: { className?: string }) {
  if (env.isSupabaseEnabled) {
    return (
      <p className={cn('flex items-center gap-1.5 text-xs text-gray-500', className)}>
        <Database className="size-3.5" aria-hidden /> Supabase'e bağlı
      </p>
    )
  }

  return (
    <p className={cn('flex items-start gap-1.5 text-xs text-gray-500', className)}>
      <HardDrive className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      <span>
        Yerel mod: veriler bu tarayıcıda saklanıyor. Supabase'e bağlanmak için README'ye bak.
      </span>
    </p>
  )
}
