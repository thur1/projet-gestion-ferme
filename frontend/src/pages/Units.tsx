import { useEffect, useMemo, useRef, useState } from 'react'
import { useUnits } from '../hooks/useUnits'
import { useFarms } from '../hooks/useFarms'
import { useSpecies } from '../hooks/useSpecies'
import { useBreedingTypes } from '../hooks/useBreedingTypes'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function UnitsPage() {
  const { data, loading, error, create, creating } = useUnits()
  const farms = useFarms()
  const breedingTypes = useBreedingTypes()
  const [selectedBreedingType, setSelectedBreedingType] = useState<string>('')
  const species = useSpecies(selectedBreedingType || undefined)
  const [selectedFarm, setSelectedFarm] = useState<string>('all')
  const [form, setForm] = useState({ farm: '', breeding_type: '', species: '', name: '', capacity: 0 })
  const [submitMessage, setSubmitMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [farmForm, setFarmForm] = useState({ name: '', location: '', enterprise: '' })
  const [farmMessage, setFarmMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [enterpriseForm, setEnterpriseForm] = useState({ name: '' })
  const [enterpriseMessage, setEnterpriseMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const breedingDropdownRef = useRef<HTMLDivElement | null>(null)
  const breedingSelectRef = useRef<HTMLSelectElement | null>(null)
  const [breedingDropdownOpen, setBreedingDropdownOpen] = useState(false)

  const isLoading = loading || farms.loading || species.loading
  const hasError = error || farms.error || species.error || breedingTypes.error

  const farmName = (id: string) => farms.data.find((f) => f.id === id)?.name || id
  const speciesLabel = (id: string) => {
    const found = species.data.find((s) => s.id === id)
    if (!found) return id
    return found.name || found.code || id
  }
  const breedingLabel = (id: string) => breedingTypes.data.find((bt) => bt.id === id)?.name || 'Sélectionner'

  const handleBreedingChange = (value: string) => {
    setSelectedBreedingType(value)
    setForm((prev) => ({ ...prev, breeding_type: value, species: '' }))
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

  const filteredUnits = useMemo(() => {
    if (selectedFarm === 'all') return data
    return data.filter((unit) => unit.farm === selectedFarm)
  }, [data, selectedFarm])

  const handleCreateFarm = async () => {
    setFarmMessage(null)
    if (!farmForm.name.trim()) {
      setFarmMessage({ type: 'error', text: 'Nom de la ferme requis' })
      return
    }
    if (!farms.enterprises.length && !farmForm.enterprise) {
      setFarmMessage({ type: 'error', text: 'Créez d’abord une entreprise' })
      return
    }
    const targetEnterprise = farmForm.enterprise || farms.enterprises[0]?.id
    if (!targetEnterprise) {
      setFarmMessage({ type: 'error', text: 'Aucune entreprise disponible' })
      return
    }
    const result = await farms.create({ name: farmForm.name.trim(), location: farmForm.location.trim(), enterprise: targetEnterprise })
    if (result.success) {
      setFarmMessage({ type: 'success', text: 'Ferme créée' })
      setFarmForm({ name: '', location: '', enterprise: '' })
      setForm((prev) => ({ ...prev, farm: result.farm.id }))
      setSelectedFarm(result.farm.id)
    } else {
      setFarmMessage({ type: 'error', text: result.error })
    }
  }

  const handleCreateEnterprise = async () => {
    setEnterpriseMessage(null)
    if (!enterpriseForm.name.trim()) {
      setEnterpriseMessage({ type: 'error', text: 'Nom requis' })
      return
    }
    const result = await farms.createEnterprise({ name: enterpriseForm.name.trim() })
    if (result.success) {
      setEnterpriseMessage({ type: 'success', text: 'Entreprise créée' })
      setEnterpriseForm({ name: '' })
    } else {
      setEnterpriseMessage({ type: 'error', text: result.error })
    }
  }

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
          <CardDescription>Liste des unités par ferme/type d’Élevages.</CardDescription>
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex flex-wrap items-center gap-3">
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
            {farms.enterprises.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={farmForm.name}
                  onChange={(e) => setFarmForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom de la ferme"
                  className="w-40"
                />
                <Input
                  value={farmForm.location}
                  onChange={(e) => setFarmForm((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Localisation (opt.)"
                  className="w-40"
                />
                <select
                  className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
                  value={farmForm.enterprise || ''}
                  onChange={(e) => setFarmForm((prev) => ({ ...prev, enterprise: e.target.value }))}
                >
                  <option value="">Entreprise pour la prochaine ferme</option>
                  {farms.enterprises.map((ent) => (
                    <option key={ent.id} value={ent.id}>
                      {ent.name}
                    </option>
                  ))}
                </select>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCreateFarm}
                  disabled={farms.creating || !farmForm.name.trim()}
                >
                  {farms.creating ? 'Création...' : 'Créer une ferme'}
                </Button>
                {farmMessage && (
                  <p className={farmMessage.type === 'error' ? 'text-xs text-red-600' : 'text-xs text-green-700'}>
                    {farmMessage.text}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {farms.enterprises.length === 0 && (
            <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-900">
                Aucune entreprise disponible pour créer une ferme.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium text-neutral-800">
                  Nom de l’entreprise
                  <Input
                    value={enterpriseForm.name}
                    onChange={(e) => setEnterpriseForm({ name: e.target.value })}
                    placeholder="Ex: Coopérative AgriTrack"
                  />
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" onClick={handleCreateEnterprise} disabled={farms.creatingEnterprise}>
                  {farms.creatingEnterprise ? 'Création...' : 'Créer une entreprise'}
                </Button>
                {enterpriseMessage && (
                  <p
                    className={
                      enterpriseMessage.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'
                    }
                  >
                    {enterpriseMessage.text}
                  </p>
                )}
              </div>
            </div>
          )}

          {farms.data.length === 0 && (
            <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-900">
                Aucune ferme disponible. Créez une ferme pour ajouter des unités.
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <label className="grid gap-1 text-sm font-medium text-neutral-800">
                  Nom de la ferme
                  <Input
                    value={farmForm.name}
                    onChange={(e) => setFarmForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ferme principale"
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium text-neutral-800">
                  Localisation (optionnel)
                  <Input
                    value={farmForm.location}
                    onChange={(e) => setFarmForm((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Ville, région"
                  />
                </label>
                <label className="grid gap-1 text-sm font-medium text-neutral-800">
                  Entreprise
                  <select
                    value={farmForm.enterprise}
                    onChange={(e) => setFarmForm((prev) => ({ ...prev, enterprise: e.target.value }))}
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                  >
                    <option value="">Sélectionner</option>
                    {farms.enterprises.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {ent.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" onClick={handleCreateFarm} disabled={farms.creating}>
                  {farms.creating ? 'Création...' : 'Créer une ferme'}
                </Button>
                {farmMessage && (
                  <p className={farmMessage.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                    {farmMessage.text}
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
              if (!form.farm || !form.breeding_type || !form.species || !form.name) {
                setSubmitMessage({ type: 'error', text: "Ferme, type d’élevage, espèce et nom sont requis" })
                return
              }
              const result = await create({
                farm: form.farm,
                breeding_type: form.breeding_type,
                species: form.species,
                name: form.name,
                capacity: Number(form.capacity) || 0,
                conditions: {},
              })
              if (result.success) {
                setSubmitMessage({ type: 'success', text: 'Unité créée' })
                setForm((prev) => ({ ...prev, name: '', capacity: 0, species: '' }))
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
                Type d’Élevages
                <div className="relative" ref={breedingDropdownRef}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                    onClick={() => setBreedingDropdownOpen((v) => !v)}
                  >
                    <span className={form.breeding_type ? 'text-neutral-900' : 'text-neutral-500'}>
                      {breedingLabel(form.breeding_type)}
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
                    value={form.breeding_type}
                    ref={breedingSelectRef}
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
                Espèce / catégorie
                <select
                  value={form.species}
                  onChange={(e) => setForm((prev) => ({ ...prev, species: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                  disabled={!form.breeding_type}
                >
                  <option value="">Sélectionner</option>
                  {species.data.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name}
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
              <Button
                type="submit"
                disabled={
                  creating || farms.data.length === 0 || breedingTypes.data.length === 0 || !form.breeding_type || species.data.length === 0
                }
              >
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
                  <Badge>{speciesLabel(unit.species || '')}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
