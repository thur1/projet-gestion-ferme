import { useEffect, useState } from 'react'
import { listStockMovements, createStockMovement, type StockMovement, type CreateStockMovementPayload } from '../lib/api-client'

export function useStockMovements(farmId?: string, stockItemId?: string) {
  const [data, setData] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let mounted = true
    const params = {
      ...(farmId ? { farm_id: farmId } : {}),
      ...(stockItemId ? { stock_item_id: stockItemId } : {}),
    }
    listStockMovements(Object.keys(params).length ? params : undefined)
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
  }, [farmId, stockItemId])

  const create = async (payload: CreateStockMovementPayload) => {
    setCreating(true)
    try {
      const created = await createStockMovement(payload)
      setData((prev) => [created, ...prev])
      return { success: true as const, movement: created }
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