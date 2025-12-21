import { useEffect, useState } from 'react'
import { listSpecies, type Species } from '../lib/api-client'

export function useSpecies() {
  const [data, setData] = useState<Species[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let mounted = true

    listSpecies()
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

  return { data, loading, error }
}
