import { useEffect, useState } from 'react'
import { createEnterprise, createFarm, listEnterprises, listFarms, type Farm, type Enterprise } from '../lib/api-client'

export function useFarms() {
  const [data, setData] = useState<Farm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [creating, setCreating] = useState(false)
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [creatingEnterprise, setCreatingEnterprise] = useState(false)

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        const [farmsRes, enterprisesRes] = await Promise.all([listFarms(), listEnterprises()])
        if (!mounted) return
        setData(farmsRes)
        setEnterprises(enterprisesRes)
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [])

  const createEnterpriseAction = async (payload: { name: string }) => {
    setCreatingEnterprise(true)
    try {
      const enterprise = await createEnterprise({ name: payload.name })
      setEnterprises((prev) => [enterprise, ...prev])
      return { success: true as const, enterprise }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de l’entreprise'
      setError(message)
      return { success: false as const, error: message }
    } finally {
      setCreatingEnterprise(false)
    }
  }

  const create = async (payload: { name: string; location?: string; enterprise?: string }) => {
    setCreating(true)
    try {
      const enterpriseId = payload.enterprise || enterprises[0]?.id
      if (!enterpriseId) {
        throw new Error('Aucune entreprise disponible pour créer une ferme')
      }
      const farm = await createFarm({
        name: payload.name,
        location: payload.location ?? '',
        enterprise: enterpriseId,
      })
      setData((prev) => [farm, ...prev])
      return { success: true as const, farm }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création de la ferme'
      setError(message)
      return { success: false as const, error: message }
    } finally {
      setCreating(false)
    }
  }

  return {
    data,
    loading,
    error,
    create,
    creating,
    enterprises,
    createEnterprise: createEnterpriseAction,
    creatingEnterprise,
  }
}
