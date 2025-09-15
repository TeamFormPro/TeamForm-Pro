import { useMemo } from 'react'
import AuthPanel from './components/AuthPanel'
import Dashboard from './components/Dashboard'
import AuthDebug from './components/AuthDebug'

export default function App() {
    const showDebug = useMemo(() => {
    const onLocalhost = window.location.hostname === 'localhost'
    const wantsDebug = new URLSearchParams(window.location.search).get('debug') === '1'
    return onLocalhost || wantsDebug
  }, [])

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1>TeamForm Pro</h1>

      {/* Auth controls at the top */}
      <div style={{ height: 12 }} />
      <AuthPanel />

      {/* Main dashboard (presets, team maker, etc.) */}
      <div style={{ height: 12 }} />
      <Dashboard />

      {/* Optional debug panel */}
      {showDebug && (
        <>
          <div style={{ height: 20 }} />
          <div className="card">
            <h3>Auth Debug</h3>
            <AuthDebug />
          </div>
        </>
      )}
    </div>
  )
}
