import AuthPanel from './components/AuthPanel'
import Dashboard from './components/Dashboard'
export default function App() {
  return (
    <div className="container">
      <AuthPanel />
      <div style={{height:12}}/>
      <div className="card">
        <p className="muted">Demo build: Presets and Team Maker run in the browser. Wire Supabase tables using the provided schema to persist rosters, students, presets, and history.</p>
      </div>
      <div style={{height:12}}/>
      <Dashboard />
    </div>
  )
}
