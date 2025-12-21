import { useEffect, useState } from 'react'
import { listUnits, createUnit, type Unit, type CreateUnitPayload } from '../lib/api-client'

export function useUnits() {
  const [data, setData] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let mounted = true

    listUnits()
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
  }, [])

  const create = async (payload: CreateUnitPayload) => {
    setCreating(true)
    try {
      const created = await createUnit(payload)
      setData((prev) => [created, ...prev])
      return { success: true as const, unit: created }
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
