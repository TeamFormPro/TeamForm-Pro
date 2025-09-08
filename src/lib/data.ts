import { supabase } from './supabase'

export async function requireUserId() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!user) throw new Error('Please sign in first.')
  return user.id
}

export type PresetRow = {
  id: string
  name: string
  options_json: any
  created_at: string
}

export async function listPresets(): Promise<PresetRow[]> {
  const { data, error } = await supabase
    .from('presets')
    .select('id, name, options_json, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createPreset(name: string, options_json: any): Promise<PresetRow> {
  const user_id = await requireUserId()
  const { data, error } = await supabase
    .from('presets')
    .insert({ user_id, name, options_json })
    .select('id, name, options_json, created_at')
    .single()
  if (error) throw error
  return data as PresetRow
}

export async function updatePreset(id: string, name: string, options_json: any): Promise<PresetRow> {
  const { data, error } = await supabase
    .from('presets')
    .update({ name, options_json })
    .eq('id', id)
    .select('id, name, options_json, created_at')
    .single()
  if (error) throw error
  return data as PresetRow
}

export async function deletePreset(id: string) {
  const { error } = await supabase
    .from('presets')
    .delete()
    .eq('id', id)
  if (error) throw error
}
