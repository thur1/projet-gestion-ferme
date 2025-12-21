import { useEffect, useState } from 'react'
import { fetchDashboardSummary, listFarms, type DashboardSummary, type Farm } from '../lib/api-client'

export function useDashboardSummary() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        const farmsRes = await listFarms()
        if (!mounted) return
        setFarms(farmsRes)

        if (farmsRes.length === 0) {
          setError('Aucune ferme accessible')
          return
        }

        const summary = await fetchDashboardSummary(farmsRes[0].id)
        if (!mounted) return
        setData(summary)
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
        mounted = false
    }
  }, [])

  return { data, farms, loading, error }
}
