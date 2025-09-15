import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
export default function AuthDebug() {
  const [info, setInfo] = useState<string>('Loading…')

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error) setInfo(`Error: ${error.message}`)
      else if (!data.user) setInfo('No user session')
      else setInfo(`Signed in as: ${data.user.email}`)
    })
  }, [])

  return <pre>{info}</pre>
}
