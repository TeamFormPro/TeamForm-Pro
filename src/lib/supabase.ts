import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, anon, {
  auth: {
    flowType: 'pkce',            // ✅ prefer PKCE (query ?code=..., not #access_token=...)
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true     // handles code exchange on load
  }
})
