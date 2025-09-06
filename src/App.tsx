import AuthPanel from './components/AuthPanel'
import Dashboard from './components/Dashboard'

export default function App() {
  return (
    <div className="container">
      <AuthPanel />
      <div style={{height:12}}/>
      <div className="card">
        <p className="muted">
          Presets and Team Maker run locally. Supabase auth & data save once your env and tables are set.
        </p>
      </div>
      <div style={{height:12}}/>
      <Dashboard />
    </div>
  )
}
import { useEffect } from 'react'

useEffect(() => {
  if (window.location.hash && window.location.hash.includes('access_token')) {
    // Clean up old implicit flow fragments
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}, [])
