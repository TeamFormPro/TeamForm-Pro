import { useMemo, useState } from 'react'
import type { GroupOptions, Lock, Student } from '../types'
import { generateTeams } from '../lib/algorithm'

const SAMPLE: Student[] = [
  { id: '1', name: 'Alex', gender:'M', skill:4 },
  { id: '2', name: 'Brooke', gender:'F', skill:3 },
  { id: '3', name: 'Chris', gender:'M', skill:2 },
  { id: '4', name: 'Devon', gender:'F', skill:5 },
  { id: '5', name: 'Erin', gender:'F', skill:3 },
  { id: '6', name: 'Flynn', gender:'M', skill:1 },
  { id: '7', name: 'Gabe', gender:'M', skill:4 },
  { id: '8', name: 'Harper', gender:'F', skill:2 }
]

const DEFAULT_OPTIONS: GroupOptions = {
  mode: 'teams',
  numTeams: 2,
  teamSize: 4,
  balanceGender: true,
  balanceSkill: true,
  avoidRepeats: true,
  respectExclusions: true
}

export default function TeamMaker() {
  const [students] = useState<Student[]>(SAMPLE)
  const [present, setPresent] = useState<Set<string>>(new Set(students.map(s=>s.id)))
  const [manualCaptains, setManualCaptains] = useState<Set<string>>(new Set())
  const [locks, setLocks] = useState<Record<string, number>>({})
  const [labels, setLabels] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)
  const options = DEFAULT_OPTIONS

  const presentStudents = useMemo(() => students.filter(s => present.has(s.id)), [students, present])

  const makeTeams = () => {
    if (presentStudents.length < 2) return alert('Mark at least two students present.')
    const history: string[][] = []

    const count = options.mode === 'size'
      ? Math.ceil(presentStudents.length / Math.max(2, options.teamSize || 2))
      : Math.max(1, options.numTeams || 1)

    let captains: string[] | undefined = []
    const manual = Array.from(manualCaptains)
    if (manual.length) captains = manual

    const algStudents = presentStudents.map(s => ({ name: s.name, gender: s.gender, skill: s.skill as number|undefined, exclude_with: s.exclude_with || [] }))
    const lockArr: Lock[] = Object.entries(locks).filter(([_,ti])=>Number.isFinite(ti as any)).map(([id,ti])=>({ studentName: (presentStudents.find(p=>p.id===id)?.name||''), teamIndex: Number(ti) }))
    const res = generateTeams(algStudents, { ...options, numTeams: count, captains, locks: lockArr }, history)
    setResult(res)

    const useLabels: string[] = labels.length === res.teams.length ? labels.slice() : Array.from({length: res.teams.length}, (_,i)=>`Team ${i+1}`)
    setLabels(useLabels)
    const nextColors = colors.slice(0, res.teams.length)
    while (nextColors.length < res.teams.length) nextColors.push('#cccccc')
    setColors(nextColors)
  }

  // Drag & Drop handlers
  const onDragStart = (ev: React.DragEvent, fromTeam: number, name: string) => {
    ev.dataTransfer.setData('text/plain', JSON.stringify({ fromTeam, name }))
  }
  const onDragOverTeam = (ev: React.DragEvent) => { ev.preventDefault() }
  const onDropToTeam = (ev: React.DragEvent, toTeam: number) => {
    ev.preventDefault()
    if (!result) return
    const data = ev.dataTransfer.getData('text/plain')
    if (!data) return
    const { fromTeam, name } = JSON.parse(data)
    if (fromTeam === toTeam) return
    const next = { ...result, teams: result.teams.map((t:any[])=>t.slice()) }
    const idx = next.teams[fromTeam].findIndex((s:any)=>s.name===name)
    if (idx >= 0) {
      const [moved] = next.teams[fromTeam].splice(idx,1)
      next.teams[toTeam].push(moved)
      setResult(next)
    }
  }

  return (
    <div>
      <h2>Team Maker (demo)</h2>

      <div className="card">
        <strong>Attendance</strong>
        <div className="row" style={{marginTop:6, flexWrap:'wrap'}}>
          {students.map(s => (
            <label key={s.id} style={{border:'1px solid #eee', borderRadius:8, padding:'4px 8px'}}>
              <input
                type="checkbox"
                checked={present.has(s.id)}
                onChange={e=>{
                  setPresent(prev => {
                    const next = new Set(prev)
                    if (e.target.checked) next.add(s.id); else next.delete(s.id)
                    return next
                  })
                }}
              />
              <span style={{marginLeft:6}}>{s.name}</span>
            </label>
          ))}
        </div>
        <p className="muted">Only checked students are grouped.</p>
      </div>

      <div className="card" style={{marginTop:10}}>
        <strong>Manual Captains & Locks</strong>
        <div className="row" style={{marginTop:6, flexWrap:'wrap'}}>
          {students.filter(s=>present.has(s.id)).map(s => (
            <div key={s.id} className="card" style={{padding:'6px 8px'}}>
              <label>
                <input type="checkbox" checked={manualCaptains.has(s.name)} onChange={e=>{
                  setManualCaptains(prev=>{ const next = new Set(prev); if (e.target.checked) next.add(s.name); else next.delete(s.name); return next })
                }} /> Captain
              </label>
              <div className="row" style={{marginTop:4}}>
                <span className="muted">Lock to team:</span>
                <input type="number" min={1} style={{width:70}} value={(locks[s.id]??'')} onChange={e=>{
                  const v = e.target.value; setLocks(prev=>({ ...prev, [s.id]: v? Number(v)-1 : undefined as any }))
                }} placeholder="#"/>
              </div>
              <div className="muted" style={{marginTop:4}}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="row" style={{marginTop:10}}>
        <button className="primary" onClick={makeTeams}>Make Teams</button>
        <button onClick={()=>setResult(null)}>Clear</button>
      </div>

      {result && (
        <div style={{marginTop:10}}>
          <div className="teams">
            {result.teams.map((team: any[], idx: number) => (
              <div className="team" key={idx} onDragOver={onDragOverTeam} onDrop={(e)=>onDropToTeam(e, idx)}>
                <div className="row" style={{alignItems:'center'}}>
                  <input value={labels[idx] || `Team ${idx+1}`} onChange={e=>{
                    const next = labels.slice(); next[idx] = e.target.value; setLabels(next)
                  }} style={{fontWeight:700, fontSize:'1.1rem', border:'1px solid #ddd', borderRadius:8, padding:'4px 8px', flex:1}}/>
                  <input type="color" value={colors[idx] || '#cccccc'} onChange={e=>{
                    const next = colors.slice(); next[idx] = e.target.value; setColors(next)
                  }}/>
                </div>
                <div style={{ marginTop:6, background: colors[idx] || '#cccccc', color:'#fff', padding:'6px 8px', borderRadius:8 }}>
                  {labels[idx] || `Team ${idx+1}`}
                </div>
                <ul>
                  {team.map((s:any, i:number) => (
                    <li
                      key={i}
                      draggable
                      onDragStart={(e)=>onDragStart(e, idx, s.name)}
                      style={{cursor:'grab'}}
                    >
                      {i+1}. {s.name} {s.gender?`(${s.gender})`:''} {Number.isFinite(s.skill)?`Skill ${s.skill}`:''}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
