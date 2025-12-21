import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { useFarms } from '../hooks/useFarms'
import { useLots } from '../hooks/useLots'
import { useLotRecords } from '../hooks/useLotRecords'

export default function AlimentationPage() {
  const farms = useFarms()
  const [selectedFarm, setSelectedFarm] = useState<string>('all')
  const lots = useLots(selectedFarm === 'all' ? undefined : selectedFarm)
  const [selectedLot, setSelectedLot] = useState<string>('')
  const { data, loading, error, create, creating } = useLotRecords(selectedLot || undefined)

  const [form, setForm] = useState({
    date: '',
    mortality: 0,
    feed_intake_kg: 0,
    milk_production_l: 0,
    eggs_count: 0,
    avg_weight_kg: 0,
    notes: '',
  })
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  if (loading || farms.loading || lots.loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alimentation</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error || farms.error || lots.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alimentation</CardTitle>
          <CardDescription className="text-red-600">{error || farms.error || lots.error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Alimentation</CardTitle>
          <CardDescription>Enregistrements journaliers : conso, mortalité, production.</CardDescription>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-neutral-700" htmlFor="farm-filter-feed">
              Filtrer par ferme
            </label>
            <select
              id="farm-filter-feed"
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

            <label className="text-sm font-medium text-neutral-700" htmlFor="lot-filter-feed">
              Lot
            </label>
            <select
              id="lot-filter-feed"
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
                mortality: Number(form.mortality),
                feed_intake_kg: Number(form.feed_intake_kg),
                milk_production_l: Number(form.milk_production_l),
                eggs_count: Number(form.eggs_count),
                avg_weight_kg: Number(form.avg_weight_kg),
              }
              const res = await create(payload)
              if (res.success) {
                setMessage({ type: 'success', text: 'Enregistrement ajouté' })
                setForm((prev) => ({ ...prev, mortality: 0, feed_intake_kg: 0, milk_production_l: 0, eggs_count: 0, avg_weight_kg: 0, notes: '' }))
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
                Mortalité
                <Input type="number" min={0} value={form.mortality} onChange={(e) => setForm((p) => ({ ...p, mortality: Number(e.target.value) }))} />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Conso aliment (kg)
                <Input type="number" step={0.01} min={0} value={form.feed_intake_kg} onChange={(e) => setForm((p) => ({ ...p, feed_intake_kg: Number(e.target.value) }))} />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Lait (L)
                <Input type="number" step={0.01} min={0} value={form.milk_production_l} onChange={(e) => setForm((p) => ({ ...p, milk_production_l: Number(e.target.value) }))} />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Œufs
                <Input type="number" min={0} value={form.eggs_count} onChange={(e) => setForm((p) => ({ ...p, eggs_count: Number(e.target.value) }))} />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Poids moyen (kg)
                <Input type="number" step={0.001} min={0} value={form.avg_weight_kg} onChange={(e) => setForm((p) => ({ ...p, avg_weight_kg: Number(e.target.value) }))} />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800 md:col-span-3">
                Notes
                <Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Ration, observation, etc." />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={creating || !selectedLot}>
                {creating ? 'Ajout...' : 'Ajouter un enregistrement'}
              </Button>
              {message && (
                <p className={message.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                  {message.text}
                </p>
              )}
            </div>
          </form>

          {data.length === 0 && <p className="text-sm text-neutral-600">Aucun enregistrement.</p>}

          <div className="space-y-2">
            {data.map((record) => (
              <div
                key={record.id}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-neutral-900">{record.date}</div>
                  <div className="text-xs text-neutral-600">Lot: {selectedLot || record.lot}</div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-neutral-800 md:grid-cols-4">
                  <span>Mortalité: {record.mortality}</span>
                  <span>Conso: {record.feed_intake_kg} kg</span>
                  <span>Lait: {record.milk_production_l} L</span>
                  <span>Œufs: {record.eggs_count}</span>
                  <span>Poids moyen: {record.avg_weight_kg} kg</span>
                </div>
                {record.notes && <p className="mt-2 text-sm text-neutral-700">{record.notes}</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
