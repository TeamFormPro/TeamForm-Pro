import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthPanel() {
  const [email, setEmail] = useState('')

  const signInWithEmail = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message); else alert('Magic link sent! Check your email.')
  }
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) alert(error.message)
  }
  const signOut = async () => { await supabase.auth.signOut() }

  const [userEmail, setUserEmail] = useState<string>('')
  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email || '')
    })
    supabase.auth.getSession().then(({data}) => setUserEmail(data.session?.user?.email || ''))
    return () => { sub.data.subscription.unsubscribe() }
  }, [])

  return (
    <div className="card">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div>
          <strong>Auth</strong>
          <div className="muted">{userEmail ? `Signed in as ${userEmail}` : 'Not signed in'}</div>
        </div>
        <div className="row">
          {!userEmail && (
            <>
              <input placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
              <button onClick={signInWithEmail}>Magic Link</button>
              <button className="primary" onClick={signInWithGoogle}>Sign in with Google</button>
            </>
          )}
          {userEmail && <button onClick={signOut}>Sign out</button>}
        </div>
      </div>
    </div>
  )
}
