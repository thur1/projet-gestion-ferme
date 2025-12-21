import { useMemo, useState } from 'react'
import { useLots } from '../hooks/useLots'
import { useUnits } from '../hooks/useUnits'
import { useFarms } from '../hooks/useFarms'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { type CreateLotPayload } from '../lib/api-client'

export default function LotsPage() {
  const units = useUnits()
  const farms = useFarms()
  const [selectedFarm, setSelectedFarm] = useState<string>('all')
  const { data, loading, error, create, creating } = useLots(selectedFarm === 'all' ? undefined : selectedFarm)
  const [form, setForm] = useState<CreateLotPayload>({
    unit: '',
    species: '',
    code: '',
    entry_date: '',
    initial_count: 0,
    status: 'active',
    destination: '',
  })
  const [submitMessage, setSubmitMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const isLoading = loading || units.loading || farms.loading
  const hasError = error || units.error || farms.error

  const unitById = useMemo(() => {
    const map = new Map<string, { farm: string }>()
    units.data.forEach((u) => map.set(u.id, { farm: u.farm }))
    return map
  }, [units.data])

  const filteredLots = useMemo(() => {
    if (selectedFarm === 'all') return data
    return data.filter((lot) => unitById.get(lot.unit)?.farm === selectedFarm)
  }, [data, selectedFarm, unitById])

  const farmName = (id: string) => farms.data.find((f) => f.id === id)?.name || id
  const unitFarmName = (unitId: string) => {
    const farmId = unitById.get(unitId)?.farm
    return farmId ? farmName(farmId) : unitId
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lots</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lots</CardTitle>
          <CardDescription className="text-red-600">{hasError}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lots</CardTitle>
          <CardDescription>Liste des lots par unité/espèce.</CardDescription>
          <div className="mt-3 flex items-center gap-3">
            <label className="text-sm font-medium text-neutral-700" htmlFor="farm-filter-lots">
              Filtrer par ferme
            </label>
            <select
              id="farm-filter-lots"
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
              if (!form.unit || !form.species || !form.code || !form.entry_date) {
                setSubmitMessage({ type: 'error', text: 'Unité, espèce, code et date sont requis' })
                return
              }
              const result = await create({
                ...form,
                initial_count: Number(form.initial_count) || 0,
              })
              if (result.success) {
                setSubmitMessage({ type: 'success', text: 'Lot créé' })
                setForm((prev) => ({ ...prev, code: '', initial_count: 0, destination: '' }))
              } else {
                setSubmitMessage({ type: 'error', text: result.error })
              }
            }}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Unité
                <select
                  value={form.unit}
                  onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="">Sélectionner</option>
                  {units.data.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.id}
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
                  {units.data.map((u) => (
                    <option key={`${u.id}-sp`} value={u.species}>
                      {u.species}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Code
                <Input
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="LOT-2025-01"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Date d'entrée
                <Input
                  type="date"
                  value={form.entry_date}
                  onChange={(e) => setForm((prev) => ({ ...prev, entry_date: e.target.value }))}
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Effectif initial
                <Input
                  type="number"
                  value={form.initial_count}
                  onChange={(e) => setForm((prev) => ({ ...prev, initial_count: Number(e.target.value) }))}
                  min={0}
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Statut
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value as CreateLotPayload['status'] }))
                  }
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="active">Actif</option>
                  <option value="closed">Clos</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Destination (optionnel)
                <Input
                  value={form.destination}
                  onChange={(e) => setForm((prev) => ({ ...prev, destination: e.target.value }))}
                  placeholder="Vente"
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={creating || units.data.length === 0}>
                {creating ? 'Création...' : 'Créer un lot'}
              </Button>
              {submitMessage && (
                <p className={submitMessage.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                  {submitMessage.text}
                </p>
              )}
            </div>
          </form>

          <div className="grid gap-3">
          {filteredLots.length === 0 && <p className="text-sm text-neutral-600">Aucun lot.</p>}
          {filteredLots.map((lot) => (
            <div
              key={lot.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-900">{lot.code}</p>
                <p className="text-xs text-neutral-600">Effectif initial: {lot.initial_count}</p>
                <p className="text-xs text-neutral-600">Entrée: {new Date(lot.entry_date).toLocaleDateString()}</p>
              </div>
              <Badge variant={lot.status === 'active' ? 'info' : 'warning'}>{lot.status}</Badge>
              <Badge variant="info">Unit #{lot.unit}</Badge>
              <Badge>{unitFarmName(lot.unit)}</Badge>
            </div>
          ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
