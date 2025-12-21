import { useEffect, useState } from 'react'
import {
  listReproductionEvents,
  createReproductionEvent,
  type ReproductionEvent,
  type CreateReproductionEventPayload,
} from '../lib/api-client'

export function useReproductionEvents(lotId?: string) {
  const [data, setData] = useState<ReproductionEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let mounted = true
    const params = lotId ? { lot_id: lotId } : undefined

    listReproductionEvents(params)
      .then((res) => {
        if (!mounted) return
        setData(res)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [lotId])

  const create = async (payload: CreateReproductionEventPayload) => {
    setCreating(true)
    try {
      const created = await createReproductionEvent(payload)
      setData((prev) => [created, ...prev])
      return { success: true as const, event: created }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création'
      setError(message)
      return { success: false as const, error: message }
    } finally {
      setCreating(false)
    }
  }

  return { data, loading, error, create, creating }
}
