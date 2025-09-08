import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthDebug() {
  const [info, setInfo] = useState<string>('Loading...')

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) {
        setInfo(`Error: ${error.message}`)
      } else if (data.user) {
        setInfo(`Signed in as: ${data.user.email}`)
      } else {
        setInfo('Not signed in')
      }
    })
  }, [])

  return (
    <div style={{ padding: 10, background: '#eee', borderRadius: 6, marginBottom: 10 }}>
      {info}
    </div>
  )
}
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AuthDebug() {
  const [info, setInfo] = useState<string>('Loading...')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setInfo(`Signed in as: ${data.user.email}`)
      } else {
        setInfo('Not signed in')
      }
    })
  }, [])

  return <div style={{ padding: 10, background: '#eee', borderRadius: 6 }}>
    {info}
  </div>
}
