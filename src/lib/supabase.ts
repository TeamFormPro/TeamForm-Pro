import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const SUPABASE_ENV_OK = Boolean(url && anon)

export const supabase = SUPABASE_ENV_OK
  ? createClient(url!, anon!, {
      auth: { flowType: 'pkce', autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    })
  : null as any
