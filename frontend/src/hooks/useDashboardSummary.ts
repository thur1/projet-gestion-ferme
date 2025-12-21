import { useEffect, useState } from 'react'
import { fetchDashboardSummary, listFarms, type DashboardSummary, type Farm } from '../lib/api-client'

type DashboardSummaryResult = {
  data: DashboardSummary | null
  farms: Farm[]
  loading: boolean
  error: string
  selectedFarm: string | null
}

export function useDashboardSummary(selectedFarmId?: string): DashboardSummaryResult {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [selected, setSelected] = useState<string | null>(null)

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

        const farmId = selectedFarmId || farmsRes[0].id
        setSelected(farmId)
        const summary = await fetchDashboardSummary(farmId)
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
  }, [selectedFarmId])

  return { data, farms, loading, error, selectedFarm: selected }
}
