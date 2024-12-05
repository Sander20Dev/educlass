import { User } from '@supabase/supabase-js'
import { getUser } from '../db/server'
import { getSupabaseServer, ISupabaseServer } from '../supabase.server'
import { IUser } from '../types/db'

interface ISetupUser {
  supabase: ISupabaseServer
  rawUser: User | null
  user: IUser | null
}

export async function setupUser(): Promise<ISetupUser> {
  const supabase = getSupabaseServer()
  const {
    data: { user: rawUser },
  } = await supabase.auth.getUser()
  if (!rawUser) return { supabase, rawUser, user: null }

  const user = await getUser(rawUser.id)
  return { supabase, rawUser, user }
}
