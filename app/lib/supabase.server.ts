import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './types/supabase'

export function getSupabaseServer() {
  return createServerComponentClient<Database>({ cookies })
}

export type ISupabaseServer = ReturnType<typeof getSupabaseServer>
