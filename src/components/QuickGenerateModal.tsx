import { useEffect, useRef, useState } from 'react'
import type { GroupOptions } from '../types'

type Props = {
  open: boolean
  onClose: () => void
  onGenerate: (opts: { mode: 'teams' | 'size', numTeams?: number, teamSize?: number, options: GroupOptions }) => void
}

export default function QuickGenerateModal({ open, onClose, onGenerate }: Props) {
  const [mode, setMode] = useState<'teams'|'size'>('size')
  const [numTeams, setNumTeams] = useState(4)
  const [teamSize, setTeamSize] = useState(5)

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [balanceGender, setBalanceGender] = useState(true)
  const [balanceSkill, setBalanceSkill] = useState(true)
  const [avoidRepeats, setAvoidRepeats] = useState(true)
  const [respectExclusions, setRespectExclusions] = useState(true)
  const [autoCaptains, setAutoCaptains] = useState(false)
  const [stationMode, setStationMode] = useState(false)

  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div style={backdrop} onClick={(e)=>{
      if (e.target === e.currentTarget) onClose()
    }}>
      <div ref={dialogRef} style={modal}>
        <h2 style={{marginTop: 0}}>Quick Generate</h2>

        <div style={{display:'grid', gap:'10px'}}>
          <label style={row}>
            <input type="radio" checked={mode==='teams'} onChange={()=>setMode('teams')} />
            <span style={{flex:1}}>Number of teams</span>
            <input type="number" min={1} value={numTeams} onChange={e=>setNumTeams(Number(e.target.value||'0'))} style={numInput} />
          </label>

          <label style={row}>
            <input type="radio" checked={mode==='size'} onChange={()=>setMode('size')} />
            <span style={{flex:1}}>Team size</span>
            <input type="number" min={2} value={teamSize} onChange={e=>setTeamSize(Number(e.target.value||'0'))} style={numInput} />
          </label>
        </div>

        <button style={advToggler} onClick={()=>setShowAdvanced(s=>!s)} aria-expanded={showAdvanced}>
          {showAdvanced ? 'Hide' : 'Show'} advanced options
        </button>

        {showAdvanced && (
          <div style={advanced}>
            <label style={chk}><input type="checkbox" checked={balanceGender} onChange={e=>setBalanceGender(e.target.checked)} /> Balance by gender</label>
            <label style={chk}><input type="checkbox" checked={balanceSkill} onChange={e=>setBalanceSkill(e.target.checked)} /> Balance by skill</label>
            <label style={chk}><input type="checkbox" checked={avoidRepeats} onChange={e=>setAvoidRepeats(e.target.checked)} /> Avoid repeats (use history)</label>
            <label style={chk}><input type="checkbox" checked={respectExclusions} onChange={e=>setRespectExclusions(e.target.checked)} /> Respect exclusions</label>
            <label style={chk}><input type="checkbox" checked={autoCaptains} onChange={e=>setAutoCaptains(e.target.checked)} /> Auto-assign captains</label>
            <label style={chk}><input type="checkbox" checked={stationMode} onChange={e=>setStationMode(e.target.checked)} /> Station labels instead of "Team 1"</label>
            <p className="muted" style={{marginTop:'.25rem'}}>Advanced settings are remembered for next time.</p>
          </div>
        )}

        <div style={{display:'flex', gap:'10px', justifyContent:'flex-end', marginTop:'16px'}}>
          <button onClick={onClose} style={btnSecondary}>Cancel</button>
          <button
            onClick={()=>{
              const options: GroupOptions = {
                mode: mode,
                numTeams: mode==='teams' ? Math.max(1, numTeams) : undefined,
                teamSize: mode==='size' ? Math.max(2, teamSize) : undefined,
                balanceGender, balanceSkill, avoidRepeats, respectExclusions,
                captains: autoCaptains ? [] : undefined,
                customLabels: stationMode ? Array.from({length: (mode==='teams' ? Math.max(1,numTeams) : Math.max(1, Math.ceil(24/Math.max(2,teamSize))))}, (_,i)=>`Station ${i+1}`) : undefined
              }
              onGenerate({ mode, numTeams, teamSize, options })
            }}
            style={btnPrimary}
          >Generate</button>
        </div>
      </div>
    </div>
  )
}

const backdrop: React.CSSProperties = {
  position:'fixed', inset:0, background:'rgba(0,0,0,.35)',
  display:'grid', placeItems:'center', zIndex: 50
}
const modal: React.CSSProperties = {
  width: 520, maxWidth: '90vw', background:'#fff', borderRadius:12,
  padding:'18px', boxShadow:'0 10px 30px rgba(0,0,0,.2)', border:'1px solid #e8e8ef'
}
const row: React.CSSProperties = { display:'flex', gap:'10px', alignItems:'center' }
const numInput: React.CSSProperties = { width: 90, padding:'.45rem .6rem', borderRadius:10, border:'1px solid #ddd' }
const advToggler: React.CSSProperties = { marginTop:12, border:'1px solid #ddd', padding:'.5rem .8rem', borderRadius:10, cursor:'pointer', background:'#fafbff' }
const advanced: React.CSSProperties = { marginTop:10, border:'1px solid #eee', borderRadius:10, padding:'10px', background:'#fcfcfe' }
const chk: React.CSSProperties = { display:'flex', gap:8, alignItems:'center', marginBottom:6 }
const btnSecondary: React.CSSProperties = { border:'1px solid #ddd', padding:'.55rem .9rem', borderRadius:10, background:'#fff', cursor:'pointer' }
const btnPrimary: React.CSSProperties = { border:'1px solid #2c62f0', padding:'.55rem .9rem', borderRadius:10, background:'#2c62f0', color:'#fff', cursor:'pointer' }
