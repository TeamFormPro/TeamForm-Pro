import { useState } from 'react'
import QuickGenerateModal from './QuickGenerateModal'
import type { GroupOptions } from '../types'
import TeamMaker from './TeamMaker'
import PresetManager from './PresetManager'
import AuthDebug from './AuthDebug'

export default function Dashboard() {
  const [open, setOpen] = useState(false)
  const onGenerate = (_: { options: GroupOptions }) => setOpen(false)

  return (
    <div className="container">
      <header className="top">
        <h1>TeamForm Pro</h1>
        <button onClick={()=>setOpen(true)} className="primary">Quick Generate</button>
      </header>

      <div className="card"><PresetManager /></div>
      <div style={{height:12}} />
      <div className="card"><TeamMaker /></div>
<div className="card">
  <AuthDebug />
  <PresetManager />
</div>

      <QuickGenerateModal open={open} onClose={()=>setOpen(false)} onGenerate={onGenerate} />
    </div>
  )
}
