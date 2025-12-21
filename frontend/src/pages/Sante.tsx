import { useEffect, useMemo, useState } from 'react'
import { useHealthEvents } from '../hooks/useHealthEvents'
import { useLots } from '../hooks/useLots'
import { useUnits } from '../hooks/useUnits'
import { useFarms } from '../hooks/useFarms'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { type CreateHealthEventPayload } from '../lib/api-client'

export default function SantePage() {
  const lots = useLots()
  const units = useUnits()
  const farms = useFarms()
  const [selectedFarm, setSelectedFarm] = useState<string>('all')
  const [lotFilter, setLotFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { data, loading, error, createEvent, creating } = useHealthEvents({
    lot_id: lotFilter === 'all' ? undefined : lotFilter,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  })
  const [form, setForm] = useState<CreateHealthEventPayload>({
    notes: '',
    product: '',
    event_type: 'vaccination',
    date: new Date().toISOString().slice(0, 10),
    lot: '',
  })
  const [submitMessage, setSubmitMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const isLoading = loading || lots.loading || units.loading || farms.loading
  const hasError = error || lots.error || units.error || farms.error

  const unitById = useMemo(() => {
    const map = new Map<string, { farm: string }>()
    units.data.forEach((u) => map.set(u.id, { farm: u.farm }))
    return map
  }, [units.data])

  const lotById = useMemo(() => {
    const map = new Map<string, { unit: string }>()
    lots.data.forEach((l) => map.set(l.id, { unit: l.unit }))
    return map
  }, [lots.data])

  const availableLots = useMemo(() => {
    if (selectedFarm === 'all') return lots.data
    return lots.data.filter((lot) => {
      const unitId = lot.unit
      const farmId = unitById.get(unitId)?.farm
      return farmId === selectedFarm
    })
  }, [lots.data, selectedFarm, unitById])

  useEffect(() => {
    if (availableLots.length === 0) {
      setForm((prev) => ({ ...prev, lot: '' }))
      setLotFilter('all')
      return
    }
    if (!form.lot || !availableLots.some((l) => l.id === form.lot)) {
      setForm((prev) => ({ ...prev, lot: availableLots[0].id }))
    }
    if (lotFilter !== 'all' && !availableLots.some((l) => l.id === lotFilter)) {
      setLotFilter('all')
    }
  }, [availableLots, form.lot, lotFilter])

  const farmName = (id: string) => farms.data.find((f) => f.id === id)?.name || id
  const eventFarmName = (lotId: string) => {
    const unitId = lotById.get(lotId)?.unit
    if (!unitId) return lotId
    const farmId = unitById.get(unitId)?.farm
    return farmId ? farmName(farmId) : unitId
  }

  const filteredEvents = useMemo(() => {
    return data.filter((ev) => {
      const unitId = lotById.get(ev.lot)?.unit
      const farmId = unitId ? unitById.get(unitId)?.farm : undefined
      const matchesFarm = selectedFarm === 'all' ? true : farmId === selectedFarm
      const matchesLot = lotFilter === 'all' ? true : ev.lot === lotFilter
      const matchesType = typeFilter === 'all' ? true : ev.event_type === typeFilter
      const matchesFrom = dateFrom ? ev.date >= dateFrom : true
      const matchesTo = dateTo ? ev.date <= dateTo : true
      return matchesFarm && matchesLot && matchesType && matchesFrom && matchesTo
    })
  }, [data, selectedFarm, lotFilter, lotById, unitById, typeFilter, dateFrom, dateTo])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Santé</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Santé</CardTitle>
          <CardDescription className="text-red-600">{hasError}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Santé</CardTitle>
          <CardDescription>Alertes sanitaires, vaccinations et traitements.</CardDescription>
          <div className="mt-3 flex items-center gap-3">
            <label className="text-sm font-medium text-neutral-700" htmlFor="farm-filter-health">
              Filtrer par ferme
            </label>
            <select
              id="farm-filter-health"
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
            <label className="text-sm font-medium text-neutral-700" htmlFor="type-filter-health">
              Type
            </label>
            <select
              id="type-filter-health"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tous</option>
              <option value="vaccination">Vaccination</option>
              <option value="treatment">Traitement</option>
              <option value="disease">Maladie</option>
            </select>
            <label className="text-sm font-medium text-neutral-700" htmlFor="date-from">
              Du
            </label>
            <input
              id="date-from"
              type="date"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <label className="text-sm font-medium text-neutral-700" htmlFor="date-to">
              Au
            </label>
            <input
              id="date-to"
              type="date"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <label className="text-sm font-medium text-neutral-700" htmlFor="lot-filter-health">
              Filtrer par lot
            </label>
            <select
              id="lot-filter-health"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
              value={lotFilter}
              onChange={(e) => setLotFilter(e.target.value)}
            >
              <option value="all">Tous</option>
              {availableLots.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.code || `Lot ${lot.id}`}
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
              if (!form.lot) {
                setSubmitMessage({ type: 'error', text: 'Veuillez sélectionner un lot' })
                return
              }
              const result = await createEvent(form)
              if (result.success) {
                setSubmitMessage({ type: 'success', text: 'Événement ajouté' })
                setForm((prev) => ({ ...prev, notes: '', product: '' }))
              } else {
                setSubmitMessage({ type: 'error', text: result.error })
              }
            }}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Notes
                <input
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                  placeholder="Vaccination annuelle"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Produit / traitement
                <input
                  value={form.product}
                  onChange={(e) => setForm((prev) => ({ ...prev, product: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                  placeholder="Antibiotique, vaccin..."
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Date
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Type
                <select
                  value={form.event_type}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, event_type: e.target.value as CreateHealthEventPayload['event_type'] }))
                  }
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="vaccination">Vaccination</option>
                  <option value="treatment">Traitement</option>
                  <option value="disease">Maladie</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Lot
                <select
                  value={form.lot}
                  onChange={(e) => setForm((prev) => ({ ...prev, lot: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  {availableLots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.code || `Lot ${lot.id}`}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={creating || availableLots.length === 0}
                className="inline-flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-400"
              >
                {creating ? 'Ajout...' : 'Ajouter un événement'}
              </button>
              {availableLots.length === 0 && (
                <p className="text-sm text-neutral-600">Aucun lot disponible pour cette ferme.</p>
              )}
              {submitMessage && (
                <p className={submitMessage.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                  {submitMessage.text}
                </p>
              )}
            </div>
          </form>

          {filteredEvents.length === 0 && <p className="text-sm text-neutral-600">Aucun événement.</p>}
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="flex items-start justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{ev.product || ev.notes || 'Événement sanitaire'}</p>
                {ev.notes && <p className="text-xs text-neutral-600">{ev.notes}</p>}
                <p className="text-xs text-neutral-600">Lot {lotById.get(ev.lot)?.unit ? `#${ev.lot}` : ev.lot} · {new Date(ev.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">{ev.event_type}</Badge>
                <Badge>{eventFarmName(ev.lot)}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
