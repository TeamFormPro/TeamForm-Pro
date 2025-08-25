import { useState } from 'react'
import type { GroupOptions } from '../types'

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

  const teamCountForLabels = () => {
    if (opts.mode === 'teams') return Math.max(1, opts.numTeams || 4)
    return Math.max(1, Math.ceil((opts.teamSize || 6)))
  }

  const autoStations = () => {
    const k = teamCountForLabels()
    const labels = Array.from({length: k}, (_,i)=>`Station ${i+1}`)
    setOpts({...opts, customLabels: labels})
  }

  const ensureColorCount = (k: number) => {
    const base = opts.customColors || []
    const next = base.slice(0, k)
    while (next.length < k) next.push('#cccccc')
    return next
  }

  const colorCount = teamCountForLabels()
  const colors = ensureColorCount(colorCount)

  return (
    <div>
      <h2>Global Presets (local demo)</h2>
      <div className="row">
        <label><input type="radio" checked={opts.mode==='teams'} onChange={()=>setOpts({...opts, mode:'teams'})}/> By # of teams</label>
        <label><input type="radio" checked={opts.mode==='size'} onChange={()=>setOpts({...opts, mode:'size'})}/> By team size</label>
      </div>
      <div className="row">
        <label># Teams <input type="number" value={opts.numTeams||4} onChange={e=>setOpts({...opts, numTeams: Number(e.target.value)})}/></label>
        <label>Team Size <input type="number" value={opts.teamSize||6} onChange={e=>setOpts({...opts, teamSize: Number(e.target.value)})}/></label>
      </div>
      <div className="row">
        <label><input type="checkbox" checked={opts.balanceGender} onChange={e=>setOpts({...opts, balanceGender: e.target.checked})}/> Balance gender</label>
        <label><input type="checkbox" checked={opts.balanceSkill} onChange={e=>setOpts({...opts, balanceSkill: e.target.checked})}/> Balance skill</label>
        <label><input type="checkbox" checked={opts.avoidRepeats} onChange={e=>setOpts({...opts, avoidRepeats: e.target.checked})}/> Avoid repeats</label>
        <label><input type="checkbox" checked={opts.respectExclusions} onChange={e=>setOpts({...opts, respectExclusions: e.target.checked})}/> Respect exclusions</label>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Custom Labels</strong>
        <p className="muted">One label per line. Used when the count matches the number of teams.</p>
        <textarea
          rows={6}
          style={{width:'100%'}}
          value={(opts.customLabels||[]).join('\n')}
          onChange={e=>setOpts({...opts, customLabels: e.target.value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean)})}
        />
        <div className="row" style={{marginTop:6}}>
          <button onClick={autoStations}>Auto Station Labels</button>
          <button onClick={()=> setOpts({...opts, customLabels: []})}>Clear Labels</button>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Team Colors</strong>
        <p className="muted">Pick a color for each team header.</p>
        <div className="row" style={{flexWrap:'wrap'}}>
          {colors.map((c, i) => (
            <label key={i} className="row" style={{gap:6, border:'1px solid #eee', borderRadius:8, padding:'6px 8px'}}>
              <span style={{minWidth:70}}>Team {i+1}</span>
              <input type="color" value={c} onChange={e=>{
                const next = colors.slice(); next[i] = e.target.value
                setOpts({...opts, customColors: next})
              }}/>
            </label>
          ))}
        </div>
      </div>
      <p className="muted">This demo PresetManager uses local state only. The Supabase-backed version is in the schema & comments.</p>
    </div>
  )
}
