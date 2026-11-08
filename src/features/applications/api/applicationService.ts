import { env } from '@/lib/env'
import { localApplicationService } from '@/features/applications/api/localApplicationService'
import { supabaseApplicationService } from '@/features/applications/api/supabaseApplicationService'
import type { ApplicationService } from '@/features/applications/api/types'

export const applicationService: ApplicationService = env.isSupabaseEnabled
  ? supabaseApplicationService
  : localApplicationService
