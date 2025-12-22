import { useEffect, useMemo, useState } from 'react'
import { useLots } from '../hooks/useLots'
import { useUnits } from '../hooks/useUnits'
import { useFarms } from '../hooks/useFarms'
import { useSpecies } from '../hooks/useSpecies'
import { useBreedingTypes } from '../hooks/useBreedingTypes'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { type CreateLotPayload } from '../lib/api-client'

export default function LotsPage() {
  const units = useUnits()
  const farms = useFarms()
  const [selectedBreedingType, setSelectedBreedingType] = useState<string>('')
  const species = useSpecies(selectedBreedingType || undefined)
  const breedingTypes = useBreedingTypes()
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
  const [codeTouched, setCodeTouched] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [speciesForm, setSpeciesForm] = useState({ code: '', name: '' })
  const [speciesMessage, setSpeciesMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const isLoading = loading || units.loading || farms.loading || species.loading || breedingTypes.loading
  const hasError = error || units.error || farms.error || species.error || breedingTypes.error

  const unitById = useMemo(() => {
    const map = new Map<string, { farm: string }>()
    units.data.forEach((u) => map.set(u.id, { farm: u.farm }))
    return map
  }, [units.data])

  const filteredLots = useMemo(() => {
    if (selectedFarm === 'all') return data
    return data.filter((lot) => unitById.get(lot.unit)?.farm === selectedFarm)
  }, [data, selectedFarm, unitById])

  const speciesLabel = (id: string) => {
    const found = species.data.find((s) => s.id === id || s.code === id)
    return found ? `${found.name} (${found.code})` : id
  }

  const availableSpecies = useMemo(() => {
    if (form.unit) {
      const selectedUnit = units.data.find((u) => u.id === form.unit)
      if (selectedUnit) {
        return species.data.filter((sp) => sp.id === selectedUnit.species)
      }
    }
    return species.data
  }, [form.unit, species.data, units.data])

  const generateLotCode = (entryDate?: string) => {
    const datePart = (entryDate || new Date().toISOString().slice(0, 10)).replace(/-/g, '')
    const seq = String(data.length + 1).padStart(3, '0')
    return `LOT-${datePart}-${seq}`
  }

  useEffect(() => {
    if (!form.code && !codeTouched) {
      setForm((prev) => ({ ...prev, code: generateLotCode(prev.entry_date) }))
    }
  }, [data.length, form.entry_date, codeTouched])

  const handleCreateSpecies = async () => {
    setSpeciesMessage(null)
    if (!speciesForm.code.trim() || !speciesForm.name.trim()) {
      setSpeciesMessage({ type: 'error', text: 'Code et nom requis' })
      return
    }
    const breedingTypeId = form.unit ? units.data.find((u) => u.id === form.unit)?.breeding_type : selectedBreedingType
    if (!breedingTypeId) {
      setSpeciesMessage({ type: 'error', text: 'Sélectionnez une unité ou un type d’élevage pour créer une espèce' })
      return
    }
    const result = await species.create({
      code: speciesForm.code.trim().toUpperCase(),
      name: speciesForm.name.trim(),
      breeding_type: breedingTypeId,
    })
    if (result.success) {
      setSpeciesMessage({ type: 'success', text: 'Espèce créée' })
      setSpeciesForm({ code: '', name: '' })
      setForm((prev) => ({ ...prev, species: result.species.id }))
    } else {
      setSpeciesMessage({ type: 'error', text: result.error })
    }
  }

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
          {species.data.length === 0 && (
            <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-900">Aucune espèce disponible. Créez-en une pour continuer.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-neutral-800">
                  Nom de l’espèce
                  <Input
                    value={speciesForm.name}
                    onChange={(e) => setSpeciesForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Poulet de chair, Bovin laitier..."
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium text-neutral-800">
                  Code (unique)
                  <Input
                    value={speciesForm.code}
                    onChange={(e) => setSpeciesForm((prev) => ({ ...prev, code: e.target.value }))}
                    placeholder="COW, PIG"
                  />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" onClick={handleCreateSpecies} disabled={species.creating}>
                  {species.creating ? 'Création...' : 'Créer une espèce'}
                </Button>
                {speciesMessage && (
                  <p className={speciesMessage.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                    {speciesMessage.text}
                  </p>
                )}
              </div>
            </div>
          )}

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
                setForm((prev) => ({
                  ...prev,
                  code: generateLotCode(form.entry_date),
                  initial_count: 0,
                  destination: '',
                }))
                setCodeTouched(false)
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
                  onChange={(e) => {
                    const value = e.target.value
                    const selectedUnit = units.data.find((u) => u.id === value)
                    setSelectedBreedingType(selectedUnit?.breeding_type || '')
                    setForm((prev) => ({ ...prev, unit: value, species: selectedUnit?.species || '' }))
                  }}
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
                Type d’élevage
                <select
                  value={selectedBreedingType}
                  onChange={(e) => {
                    const value = e.target.value
                    setSelectedBreedingType(value)
                    setForm((prev) => ({ ...prev, unit: '', species: '' }))
                  }}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="">Sélectionner</option>
                  {breedingTypes.data.map((bt) => (
                    <option key={bt.id} value={bt.id}>
                      {bt.name} ({bt.code})
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
                  disabled={!!form.unit || !selectedBreedingType}
                >
                  <option value="">Sélectionner</option>
                  {availableSpecies.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {`${sp.name} (${sp.code})`}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Code
                <Input
                  value={form.code}
                  onChange={(e) => {
                    setCodeTouched(true)
                    setForm((prev) => ({ ...prev, code: e.target.value }))
                  }}
                  placeholder="LOT-2025-01"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Date d'entrée
                <Input
                  type="date"
                  value={form.entry_date}
                  onChange={(e) => {
                    const value = e.target.value
                    setForm((prev) => ({ ...prev, entry_date: value, code: codeTouched ? prev.code : generateLotCode(value) }))
                  }}
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
              <Button type="submit" disabled={creating || units.data.length === 0 || species.data.length === 0}>
                {creating ? 'Création...' : 'Créer un lot'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const nextCode = generateLotCode(form.entry_date)
                  setForm((prev) => ({ ...prev, code: nextCode }))
                  setCodeTouched(false)
                }}
              >
                Proposer un code
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
              <Badge>{speciesLabel(lot.species)}</Badge>
              <Badge>{unitFarmName(lot.unit)}</Badge>
            </div>
          ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
