import AuthPanel from './components/AuthPanel'
import Dashboard from './components/Dashboard'
export default function App() {
  return (
    <div className="container" style={{padding:20}}>
      <h1>TeamForm Pro</h1>
      <div style={{height:12}} />
      <AuthPanel />
      <div style={{height:12}} />
      <Dashboard />
    </div>
  )
}
