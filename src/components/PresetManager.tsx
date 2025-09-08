import { useEffect, useState } from 'react'
import type { GroupOptions } from '../types'
import { listPresets, createPreset, updatePreset, deletePreset, type PresetRow } from '../lib/data'
import { supabase } from '../lib/supabase'

const DEFAULT_OPTIONS: GroupOptions = {
  mode: 'teams',
  numTeams: 4,
  teamSize: 6,
  balanceGender: true,
  balanceSkill: true,
  avoidRepeats: true,
  respectExclusions: true,
  customLabels: [],
  customColors: []
}

export default function PresetManager() {
  const [opts, setOpts] = useState<GroupOptions>(DEFAULT_OPTIONS)
  const [presets, setPresets] = useState<PresetRow[]>([])
  const [selectedId, setSelectedId] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setPresets([]); return }
      const rows = await listPresets()
      setPresets(rows)
    }
    load()
    const sub = supabase.auth.onAuthStateChange(() => load())
    return () => { sub.data.subscription.unsubscribe() }
  }, [])

  const kTeams = opts.mode === 'teams'
    ? Math.max(1, opts.numTeams || 1)
    : Math.max(1, Math.ceil((opts.teamSize || 2))) // rough preview for labels/colors count

  const ensureColors = (k: number) => {
    const base = opts.customColors || []
    const next = base.slice(0, k)
    while (next.length < k) next.push('#cccccc')
    return next
  }

  async function onSaveNew() {
    const name = prompt('Preset name?')
    if (!name) return
    await createPreset(name, opts)
    const rows = await listPresets()
    setPresets(rows)
    alert('Preset saved.')
  }

  async function onUpdateExisting() {
    if (!selectedId) return alert('Choose a preset to update.')
    const row = presets.find(p => p.id === selectedId)
    if (!row) return
    await updatePreset(row.id, row.name, opts)
    const rows = await listPresets()
    setPresets(rows)
    alert('Preset updated.')
  }

  async function onDelete() {
    if (!selectedId) return alert('Choose a preset to delete.')
    if (!confirm('Delete this preset?')) return
    await deletePreset(selectedId)
    setSelectedId('')
    const rows = await listPresets()
    setPresets(rows)
  }

  function applyPreset(row: PresetRow) {
    setSelectedId(row.id)
    setOpts(row.options_json as GroupOptions)
  }

  function autoStations() {
    const labels = Array.from({ length: kTeams }, (_, i) => `Station ${i + 1}`)
    setOpts({ ...opts, customLabels: labels })
  }

  const colors = ensureColors(kTeams)

  return (
    <div>
      <h2>Presets</h2>

      {/* Preset picker */}
      <div className="card" style={{ marginBottom: 10 }}>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            <option value="">— Select a saved preset —</option>
            {presets.map(p => (
              <option key={p.id} value={p.id}>
                {new Date(p.created_at).toLocaleDateString()} — {p.name}
              </option>
            ))}
          </select>
          <button onClick={async () => {
            const row = presets.find(p => p.id === selectedId)
            if (!row) return alert('Pick a preset to load.')
            applyPreset(row)
          }}>
            Load
          </button>
          <button onClick={onSaveNew} className="primary">Save New</button>
          <button onClick={onUpdateExisting}>Update Selected</button>
          <button onClick={onDelete}>Delete Selected</button>
        </div>
        <p className="muted" style={{ marginTop: 6 }}>
          Sign in to save/load your presets. Each teacher only sees their own.
        </p>
      </div>

      {/* Options editor (same as before, with labels/colors) */}
      <div className="row">
        <label><input type="radio" checked={opts.mode === 'teams'} onChange={() => setOpts({ ...opts, mode: 'teams' })} /> By # of teams</label>
        <label><input type="radio" checked={opts.mode === 'size'} onChange={() => setOpts({ ...opts, mode: 'size' })} /> By team size</label>
      </div>
      <div className="row">
        <label># Teams <input type="number" value={opts.numTeams || 4} onChange={e => setOpts({ ...opts, numTeams: Number(e.target.value) })} /></label>
        <label>Team Size <input type="number" value={opts.teamSize || 6} onChange={e => setOpts({ ...opts, teamSize: Number(e.target.value) })} /></label>
      </div>
      <div className="row">
        <label><input type="checkbox" checked={opts.balanceGender} onChange={e => setOpts({ ...opts, balanceGender: e.target.checked })} /> Balance gender</label>
        <label><input type="checkbox" checked={opts.balanceSkill} onChange={e => setOpts({ ...opts, balanceSkill: e.target.checked })} /> Balance skill</label>
        <label><input type="checkbox" checked={opts.avoidRepeats} onChange={e => setOpts({ ...opts, avoidRepeats: e.target.checked })} /> Avoid repeats</label>
        <label><input type="checkbox" checked={opts.respectExclusions} onChange={e => setOpts({ ...opts, respectExclusions: e.target.checked })} /> Respect exclusions</label>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Custom Labels</strong>
        <p className="muted">One label per line.</p>
        <textarea
          rows={6}
          style={{ width: '100%' }}
          value={(opts.customLabels || []).join('\n')}
          onChange={e => setOpts({
            ...opts,
            customLabels: e.target.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
          })}
        />
        <div className="row" style={{ marginTop: 6 }}>
          <button onClick={autoStations}>Auto Station Labels</button>
          <button onClick={() => setOpts({ ...opts, customLabels: [] })}>Clear Labels</button>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Team Colors</strong>
        <p className="muted">Pick a color for each team header.</p>
        <div className="row" style={{ flexWrap: 'wrap' }}>
          {colors.map((c, i) => (
            <label key={i} className="row" style={{ gap: 6, border: '1px solid #eee', borderRadius: 8, padding: '6px 8px' }}>
              <span style={{ minWidth: 70 }}>Team {i + 1}</span>
              <input type="color" value={c} onChange={e => {
                const next = colors.slice(); next[i] = e.target.value
                setOpts({ ...opts, customColors: next })
              }} />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
