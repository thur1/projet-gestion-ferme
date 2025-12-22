import { useEffect, useState } from 'react'
import { createSpecies, listSpecies, type Species } from '../lib/api-client'

export function useSpecies(breedingTypeId?: string) {
  const [data, setData] = useState<Species[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    let mounted = true

    listSpecies(breedingTypeId ? { breeding_type: breedingTypeId } : undefined)
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
  }, [breedingTypeId])

  const create = async (payload: { code: string; name: string; breeding_type: string }) => {
    setCreating(true)
    try {
      const species = await createSpecies(payload)
      setData((prev) => [species, ...prev])
      return { success: true as const, species }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de l’espèce'
      setError(message)
      return { success: false as const, error: message }
    } finally {
      setCreating(false)
    }
  }

  return { data, loading, error, create, creating }
}
