import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { useFarms } from '../hooks/useFarms'
import { useLots } from '../hooks/useLots'
import { useReproductionEvents } from '../hooks/useReproductionEvents'

const EVENT_TYPES = [
  { value: 'insemination', label: 'Insémination' },
  { value: 'saillie', label: 'Saillie' },
  { value: 'gestation_check', label: 'Contrôle gestation' },
  { value: 'mise_bas', label: 'Mise bas' },
] as const

export default function ReproductionPage() {
  const farms = useFarms()
  const [selectedFarm, setSelectedFarm] = useState<string>('all')
  const lots = useLots(selectedFarm === 'all' ? undefined : selectedFarm)
  const [selectedLot, setSelectedLot] = useState<string>('')
  const { data, loading, error, create, creating } = useReproductionEvents(selectedLot || undefined)

  const [form, setForm] = useState({
    date: '',
    event_type: 'insemination' as (typeof EVENT_TYPES)[number]['value'],
    gestation_days: '',
    born_alive: 0,
    born_dead: 0,
    notes: '',
  })
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const isLoading = loading || farms.loading || lots.loading
  const hasError = error || farms.error || lots.error

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reproduction</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reproduction</CardTitle>
          <CardDescription className="text-red-600">{hasError}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Reproduction</CardTitle>
          <CardDescription>Inséminations, saillies, contrôles gestation, mises bas.</CardDescription>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-neutral-700" htmlFor="farm-filter-repro">
              Filtrer par ferme
            </label>
            <select
              id="farm-filter-repro"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
              value={selectedFarm}
              onChange={(e) => {
                setSelectedFarm(e.target.value)
                setSelectedLot('')
              }}
            >
              <option value="all">Toutes les fermes</option>
              {farms.data.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>

            <label className="text-sm font-medium text-neutral-700" htmlFor="lot-filter-repro">
              Lot
            </label>
            <select
              id="lot-filter-repro"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
              value={selectedLot}
              onChange={(e) => setSelectedLot(e.target.value)}
            >
              <option value="">Tous les lots</option>
              {lots.data.map((lot) => (
                <option key={lot.id} value={lot.id}>
                  {lot.code}
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
              setMessage(null)
              if (!selectedLot) {
                setMessage({ type: 'error', text: 'Sélectionnez un lot' })
                return
              }
              const payload = {
                lot: selectedLot,
                ...form,
                born_alive: Number(form.born_alive),
                born_dead: Number(form.born_dead),
                gestation_days: form.gestation_days ? Number(form.gestation_days) : null,
              }
              const res = await create(payload)
              if (res.success) {
                setMessage({ type: 'success', text: 'Événement ajouté' })
                setForm((prev) => ({ ...prev, born_alive: 0, born_dead: 0, notes: '' }))
              } else {
                setMessage({ type: 'error', text: res.error })
              }
            }}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Date
                <Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Type
                <select
                  value={form.event_type}
                  onChange={(e) => setForm((p) => ({ ...p, event_type: e.target.value as typeof form.event_type }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  {EVENT_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Gestation (jours)
                <Input
                  type="number"
                  min={0}
                  value={form.gestation_days}
                  onChange={(e) => setForm((p) => ({ ...p, gestation_days: e.target.value }))}
                  placeholder="(optionnel)"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Nés vivants
                <Input type="number" min={0} value={form.born_alive} onChange={(e) => setForm((p) => ({ ...p, born_alive: Number(e.target.value) }))} />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Nés morts
                <Input type="number" min={0} value={form.born_dead} onChange={(e) => setForm((p) => ({ ...p, born_dead: Number(e.target.value) }))} />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800 md:col-span-3">
                Notes
                <Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Détails de l'intervention" />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={creating || !selectedLot}>
                {creating ? 'Ajout...' : 'Ajouter un événement'}
              </Button>
              {message && (
                <p className={message.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                  {message.text}
                </p>
              )}
            </div>
          </form>

          {data.length === 0 && <p className="text-sm text-neutral-600">Aucun événement.</p>}

          <div className="space-y-2">
            {data.map((event) => (
              <div key={event.id} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-neutral-900">{event.date}</div>
                  <div className="text-xs text-neutral-600">Lot: {selectedLot || event.lot}</div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-neutral-800 md:grid-cols-4">
                  <span>Type: {EVENT_TYPES.find((t) => t.value === event.event_type)?.label ?? event.event_type}</span>
                  <span>Gestation: {event.gestation_days ?? '—'} j</span>
                  <span>Nés vivants: {event.born_alive}</span>
                  <span>Nés morts: {event.born_dead}</span>
                </div>
                {event.notes && <p className="mt-2 text-sm text-neutral-700">{event.notes}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
