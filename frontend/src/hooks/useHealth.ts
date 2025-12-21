import { useEffect, useState } from 'react'
import { healthCheck } from '../lib/api-client'

export function useHealth() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    let mounted = true
    healthCheck()
      .then((res) => {
        if (!mounted) return
        setStatus(res.status === 'ok' ? 'ok' : 'error')
        setMessage(res.status)
      })
      .catch((err) => {
        if (!mounted) return
        setStatus('error')
        setMessage(err.message)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { status, message }
}
