import { useCallback, useEffect, useState } from 'react'
import { createHealthEvent, listHealthEvents, type CreateHealthEventPayload, type HealthEvent } from '../lib/api-client'

export function useHealthEvents(filters?: { lot_id?: string; date_from?: string; date_to?: string }) {
  const [data, setData] = useState<HealthEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let mounted = true
    listHealthEvents(filters)
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
  }, [filters])

  const createEvent = useCallback(async (payload: CreateHealthEventPayload) => {
    setCreating(true)

    try {
      const created = await createHealthEvent(payload)
      setData((prev) => [created, ...prev])
      return { success: true as const, event: created }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création'
      return { success: false as const, error: message }
    } finally {
      setCreating(false)
    }
  }, [])

  return { data, loading, error, createEvent, creating }
}
