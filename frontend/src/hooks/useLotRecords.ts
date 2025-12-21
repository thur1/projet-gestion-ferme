import { useEffect, useState } from 'react'
import { listLotRecords, createLotRecord, type LotDailyRecord, type CreateLotRecordPayload } from '../lib/api-client'

export function useLotRecords(lotId?: string) {
  const [data, setData] = useState<LotDailyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let mounted = true
    const params = lotId ? { lot_id: lotId } : undefined

    listLotRecords(params)
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

  const create = async (payload: CreateLotRecordPayload) => {
    setCreating(true)
    try {
      const created = await createLotRecord(payload)
      setData((prev) => [created, ...prev])
      return { success: true as const, record: created }
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
