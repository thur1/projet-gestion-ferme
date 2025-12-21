import { useEffect, useState } from 'react'
import {
  listFinancialEntries,
  createFinancialEntry,
  type FinancialEntry,
  type CreateFinancialEntryPayload,
} from '../lib/api-client'

export function useFinancialEntries(farmId?: string, lotId?: string) {
  const [data, setData] = useState<FinancialEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let mounted = true
    const params = {
      ...(farmId ? { farm_id: farmId } : {}),
      ...(lotId ? { lot_id: lotId } : {}),
    }
    const cleanParams = Object.fromEntries(Object.entries(params).filter(([, v]) => v)) as { farm_id?: string; lot_id?: string }

    listFinancialEntries(Object.keys(cleanParams).length ? cleanParams : undefined)
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
  }, [farmId, lotId])

  const create = async (payload: CreateFinancialEntryPayload) => {
    setCreating(true)
    try {
      const created = await createFinancialEntry(payload)
      setData((prev) => [created, ...prev])
      return { success: true as const, entry: created }
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
