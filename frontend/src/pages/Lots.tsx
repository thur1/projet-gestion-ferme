import { useEffect, useMemo, useRef, useState } from 'react'
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
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'closed'>('all')
  const { data, loading, error, create, creating } = useLots(selectedFarm === 'all' ? undefined : selectedFarm)
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
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
  const [showSpeciesForm, setShowSpeciesForm] = useState(false)
  const entryDateRef = useRef<HTMLInputElement | null>(null)
  const typeSelectRef = useRef<HTMLSelectElement | null>(null)
  const breedingDropdownRef = useRef<HTMLDivElement | null>(null)
  const [breedingDropdownOpen, setBreedingDropdownOpen] = useState(false)

  const isLoading = loading || units.loading || farms.loading || species.loading || breedingTypes.loading
  const hasError = error || units.error || farms.error || species.error || breedingTypes.error

  const unitById = useMemo(() => {
    const map = new Map<string, { farm: string }>()
    units.data.forEach((u) => map.set(u.id, { farm: u.farm }))
    return map
  }, [units.data])

  const filteredLots = useMemo(() => {
    let lots = data
    if (selectedFarm !== 'all') {
      lots = lots.filter((lot) => unitById.get(lot.unit)?.farm === selectedFarm)
    }
    if (selectedStatus !== 'all') {
      lots = lots.filter((lot) => lot.status === selectedStatus)
    }
    return lots
  }, [data, selectedFarm, selectedStatus, unitById])

  const speciesLabel = (id: string) => {
    const found = species.data.find((s) => s.id === id || s.code === id)
    if (!found) return id
    return found.name || found.code || id
  }

  const availableSpecies = useMemo(() => {
    return species.data
  }, [species.data])

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

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      entry_date: prev.entry_date || today,
      code: prev.code || generateLotCode(today),
    }))
  }, [today])

  const handleCreateSpecies = async () => {
    setSpeciesMessage(null)
    if (!speciesForm.code.trim() || !speciesForm.name.trim()) {
      setSpeciesMessage({ type: 'error', text: 'Code et nom requis' })
      return
    }
    let breedingTypeId = form.unit ? units.data.find((u) => u.id === form.unit)?.breeding_type : selectedBreedingType
    if (!breedingTypeId) {
      breedingTypeId = breedingTypes.data[0]?.id
    }
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

  const ensureDropdownSpace = () => {
    const el = typeSelectRef.current
    if (!el || typeof window === 'undefined' || !window.scrollTo) return
    const rect = el.getBoundingClientRect()
    const targetTop = 120 // place the select around 120px from top
    const targetBottom = window.innerHeight - 380 // keep ample room below for the native menu
    let delta = 0
    if (rect.top < targetTop) {
      delta = rect.top - targetTop
    } else if (rect.top > targetBottom) {
      delta = rect.top - targetBottom
    }
    if (delta !== 0) {
      window.scrollTo({ top: window.scrollY + delta, behavior: 'auto' })
    }
  }

  useEffect(() => {
    if (!breedingDropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (breedingDropdownRef.current && !breedingDropdownRef.current.contains(e.target as Node)) {
        setBreedingDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [breedingDropdownOpen])

  const breedingLabel = (id: string) => breedingTypes.data.find((bt) => bt.id === id)?.name || 'Sélectionner'

  const handleBreedingChange = (value: string) => {
    setSelectedBreedingType(value)
    setForm((prev) => ({ ...prev, unit: '', species: '' }))
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
            <label className="text-sm font-medium text-neutral-700" htmlFor="status-filter-lots">
              Statut
            </label>
            <select
              id="status-filter-lots"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | 'active' | 'closed')}
            >
              <option value="all">Tous</option>
              <option value="active">Actif</option>
              <option value="closed">Clos</option>
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
          {species.data.length > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm">
              <p className="text-neutral-700">Ajouter une espèce pour ce type d’élevage.</p>
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowSpeciesForm((v) => !v)}>
                {showSpeciesForm ? 'Masquer' : 'Ajouter une espèce'}
              </Button>
            </div>
          )}
          {showSpeciesForm && (
            <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
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
                <Button type="button" onClick={handleCreateSpecies} disabled={species.creating || !selectedBreedingType && !form.unit}>
                  {species.creating ? 'Création...' : 'Créer une espèce'}
                </Button>
                {speciesMessage && (
                  <p className={speciesMessage.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                    {speciesMessage.text}
                  </p>
                )}
                {!selectedBreedingType && !form.unit && (
                  <p className="text-xs text-amber-700">Sélectionnez un type d’élevage ou une unité avant d’ajouter.</p>
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
                setSubmitMessage({ type: 'error', text: "Unité, type/espèce, code et date sont requis" })
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
                entryDateRef.current?.focus()
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
                    setForm((prev) => ({ ...prev, unit: value, species: '' }))
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
                {form.unit && (
                  <p className="text-xs text-neutral-600">Type/espèce de l’unité : {speciesLabel(units.data.find((u) => u.id === form.unit)?.species || '')}</p>
                )}
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Type d’élevage
                <div className="relative" ref={breedingDropdownRef}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                    onClick={() => {
                      ensureDropdownSpace()
                      setBreedingDropdownOpen((v) => !v)
                    }}
                    onFocus={ensureDropdownSpace}
                  >
                    <span className={selectedBreedingType ? 'text-neutral-900' : 'text-neutral-500'}>
                      {breedingLabel(selectedBreedingType)}
                    </span>
                    <span aria-hidden="true">▾</span>
                  </button>
                  {breedingDropdownOpen && (
                    <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-neutral-200 bg-white shadow-lg">
                      <button
                        type="button"
                        className="flex w-full items-center justify-start px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100"
                        onClick={() => {
                          handleBreedingChange('')
                          setBreedingDropdownOpen(false)
                        }}
                      >
                        Sélectionner
                      </button>
                      {breedingTypes.data.map((bt) => (
                        <button
                          key={bt.id}
                          type="button"
                          className="flex w-full items-center justify-start px-3 py-2 text-left text-sm text-neutral-900 hover:bg-neutral-100"
                          onClick={() => {
                            handleBreedingChange(bt.id)
                            setBreedingDropdownOpen(false)
                          }}
                        >
                          {bt.name}
                        </button>
                      ))}
                    </div>
                  )}
                  <select
                    value={selectedBreedingType}
                    ref={typeSelectRef}
                    onChange={(e) => handleBreedingChange(e.target.value)}
                    className="sr-only"
                  >
                    <option value="">Sélectionner</option>
                    {breedingTypes.data.map((bt) => (
                      <option key={bt.id} value={bt.id}>
                        {bt.name}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Espèce
                <select
                  value={form.species}
                  onChange={(e) => setForm((prev) => ({ ...prev, species: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                  disabled={!selectedBreedingType}
                >
                  <option value="">Sélectionner</option>
                  {availableSpecies.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name}
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
                  ref={entryDateRef}
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
