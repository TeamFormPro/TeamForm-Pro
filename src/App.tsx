import { useMemo } from 'react'
import AuthDebug from './components/AuthDebug'

export default function App() {
  
  const showDebug = useMemo(() => {
    const onLocalhost = window.location.hostname === 'localhost'
    const wantsDebug = new URLSearchParams(window.location.search).get('debug') === '1'
    return onLocalhost || wantsDebug
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>TeamForm Pro</h1>
      {/* … your normal UI … */}

      {showDebug && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h2>Auth Debug Panel</h2>
          <AuthDebug />
        </div>
      )}
    </div>
  )
}
