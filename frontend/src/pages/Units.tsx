import { useMemo, useState } from 'react'
import { useUnits } from '../hooks/useUnits'
import { useFarms } from '../hooks/useFarms'
import { useSpecies } from '../hooks/useSpecies'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function UnitsPage() {
  const { data, loading, error, create, creating } = useUnits()
  const farms = useFarms()
  const species = useSpecies()
  const [selectedFarm, setSelectedFarm] = useState<string>('all')
  const [form, setForm] = useState({ farm: '', species: '', name: '', capacity: 0 })
  const [submitMessage, setSubmitMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const isLoading = loading || farms.loading || species.loading
  const hasError = error || farms.error || species.error

  const farmName = (id: string) => farms.data.find((f) => f.id === id)?.name || id
  const speciesLabel = (id: string) => {
    const found = species.data.find((s) => s.id === id)
    return found ? `${found.name} (${found.code})` : id
  }

  const filteredUnits = useMemo(() => {
    if (selectedFarm === 'all') return data
    return data.filter((unit) => unit.farm === selectedFarm)
  }, [data, selectedFarm])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unités</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unités</CardTitle>
          <CardDescription className="text-red-600">{hasError}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Unités</CardTitle>
          <CardDescription>Liste des unités par ferme/espèce.</CardDescription>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-neutral-700" htmlFor="farm-filter">
              Filtrer par ferme
            </label>
            <select
              id="farm-filter"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
            >
              <option value="all">Toutes les fermes</option>
              {farms.data.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <form
            className="grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
            onSubmit={async (e) => {
              e.preventDefault()
              setSubmitMessage(null)
              if (!form.farm || !form.species || !form.name) {
                setSubmitMessage({ type: 'error', text: 'Ferme, espèce et nom sont requis' })
                return
              }
              const result = await create({
                farm: form.farm,
                species: form.species,
                name: form.name,
                capacity: Number(form.capacity) || 0,
                conditions: {},
              })
              if (result.success) {
                setSubmitMessage({ type: 'success', text: 'Unité créée' })
                setForm((prev) => ({ ...prev, name: '', capacity: 0 }))
              } else {
                setSubmitMessage({ type: 'error', text: result.error })
              }
            }}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Ferme
                <select
                  value={form.farm}
                  onChange={(e) => setForm((prev) => ({ ...prev, farm: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="">Sélectionner</option>
                  {farms.data.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Espèce
                <select
                  value={form.species}
                  onChange={(e) => setForm((prev) => ({ ...prev, species: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="">Sélectionner</option>
                  {species.data.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name} ({sp.code})
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Nom
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Bâtiment pondeuses"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Capacité
                <Input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm((prev) => ({ ...prev, capacity: Number(e.target.value) }))}
                  min={0}
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={creating || farms.data.length === 0 || species.data.length === 0}>
                {creating ? 'Création...' : 'Créer une unité'}
              </Button>
              {submitMessage && (
                <p className={submitMessage.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                  {submitMessage.text}
                </p>
              )}
            </div>
          </form>

          <div className="grid gap-3">
            {filteredUnits.length === 0 && <p className="text-sm text-neutral-600">Aucune unité.</p>}
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm"
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{unit.name}</p>
                  <p className="text-xs text-neutral-600">Capacité: {unit.capacity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{farmName(unit.farm)}</Badge>
                  <Badge>{speciesLabel(unit.species)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
