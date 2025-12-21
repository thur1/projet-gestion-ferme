import { useMemo, useState } from 'react'
import { useStockItems } from '../hooks/useStockItems'
import { useStockMovements } from '../hooks/useStockMovements'
import { useFarms } from '../hooks/useFarms'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useLots } from '../hooks/useLots'

export default function StockPage() {
  const farms = useFarms()
  const [selectedFarm, setSelectedFarm] = useState<string>('all')
  const lots = useLots(selectedFarm === 'all' ? undefined : selectedFarm)
  const { data, loading, error, createItem, creating } = useStockItems(selectedFarm === 'all' ? undefined : selectedFarm)
  const { data: movements, create: createMovement, creating: creatingMovement } = useStockMovements(
    selectedFarm === 'all' ? undefined : selectedFarm
  )
  const [form, setForm] = useState({
    farm: '',
    name: '',
    item_type: 'feed',
    quantity: 0,
    unit: 'kg',
    alert_threshold: 0,
  })
  const [submitMessage, setSubmitMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [movementForm, setMovementForm] = useState({
    stock_item: '',
    movement_type: 'out' as 'in' | 'out',
    quantity: 0,
    date: '',
    lot: '',
    reason: '',
  })
  const [movementMessage, setMovementMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const isLoading = loading || farms.loading
  const hasError = error || farms.error

  const filtered = useMemo(() => {
    if (selectedFarm === 'all') return data
    return data.filter((item) => item.farm === selectedFarm)
  }, [data, selectedFarm])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock</CardTitle>
          <CardDescription className="text-red-600">{hasError}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Stock</CardTitle>
          <CardDescription>Aliments, médicaments, matériel, alertes.</CardDescription>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-neutral-700" htmlFor="farm-filter-stock">
              Filtrer par ferme
            </label>
            <select
              id="farm-filter-stock"
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
              if (!form.farm) {
                setSubmitMessage({ type: 'error', text: 'Sélectionnez une ferme' })
                return
              }
              if (!form.name) {
                setSubmitMessage({ type: 'error', text: 'Nom requis' })
                return
              }
              const result = await createItem({
                ...form,
                quantity: Number(form.quantity),
                alert_threshold: Number(form.alert_threshold),
              })
              if (result.success) {
                setSubmitMessage({ type: 'success', text: 'Article ajouté' })
                setForm((prev) => ({ ...prev, name: '', quantity: 0, alert_threshold: 0 }))
              } else {
                setSubmitMessage({ type: 'error', text: result.error })
              }
            }}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
                Nom
                <Input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Maïs"
                  required
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Type
                <select
                  value={form.item_type}
                  onChange={(e) => setForm((prev) => ({ ...prev, item_type: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="feed">Aliment</option>
                  <option value="med">Médicament</option>
                  <option value="other">Autre</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Quantité
                <Input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => setForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  min={0}
                  step={0.01}
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Unité
                <Input
                  value={form.unit}
                  onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                  placeholder="kg"
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Seuil d'alerte
                <Input
                  type="number"
                  value={form.alert_threshold}
                  onChange={(e) => setForm((prev) => ({ ...prev, alert_threshold: Number(e.target.value) }))}
                  min={0}
                  step={0.01}
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={creating || farms.data.length === 0}>
                {creating ? 'Ajout...' : 'Ajouter un article'}
              </Button>
              {submitMessage && (
                <p className={submitMessage.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                  {submitMessage.text}
                </p>
              )}
            </div>
          </form>

          {filtered.length === 0 && <p className="text-sm text-neutral-600">Aucun article.</p>}
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
                <p className="text-xs text-neutral-600">{item.quantity} {item.unit}</p>
                <p className="text-xs text-neutral-600">Ferme: {farms.data.find((f) => f.id === item.farm)?.name ?? item.farm}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={item.quantity <= item.alert_threshold ? 'danger' : 'info'}>
                  {item.item_type}
                </Badge>
                {item.quantity <= item.alert_threshold && <Badge variant="warning">Seuil atteint</Badge>}
              </div>
            </div>
          ))}

          <form
            className="grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
            onSubmit={async (e) => {
              e.preventDefault()
              setMovementMessage(null)
              if (!movementForm.stock_item) {
                setMovementMessage({ type: 'error', text: 'Choisissez un article' })
                return
              }
              if (!movementForm.date) {
                setMovementMessage({ type: 'error', text: 'Date requise' })
                return
              }
              const result = await createMovement({
                ...movementForm,
                quantity: Number(movementForm.quantity),
                lot: movementForm.lot || undefined,
              })
              if (result.success) {
                setMovementMessage({ type: 'success', text: 'Mouvement enregistré' })
                setMovementForm((prev) => ({ ...prev, quantity: 0, reason: '' }))
              } else {
                setMovementMessage({ type: 'error', text: result.error })
              }
            }}
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Article
                <select
                  value={movementForm.stock_item}
                  onChange={(e) => setMovementForm((prev) => ({ ...prev, stock_item: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="">Sélectionner</option>
                  {filtered.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Type
                <select
                  value={movementForm.movement_type}
                  onChange={(e) => setMovementForm((prev) => ({ ...prev, movement_type: e.target.value as 'in' | 'out' }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="out">Sortie</option>
                  <option value="in">Entrée</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Quantité
                <Input
                  type="number"
                  value={movementForm.quantity}
                  onChange={(e) => setMovementForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  min={0}
                  step={0.01}
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Date
                <Input
                  type="date"
                  value={movementForm.date}
                  onChange={(e) => setMovementForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Lot (optionnel)
                <select
                  value={movementForm.lot}
                  onChange={(e) => setMovementForm((prev) => ({ ...prev, lot: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="">Aucun</option>
                  {lots.data.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.code}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800 md:col-span-3">
                Motif (optionnel)
                <Input
                  value={movementForm.reason}
                  onChange={(e) => setMovementForm((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="Distribution lot 12"
                />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={creatingMovement || filtered.length === 0}>
                {creatingMovement ? 'Enregistrement...' : 'Ajouter un mouvement'}
              </Button>
              {movementMessage && (
                <p className={movementMessage.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                  {movementMessage.text}
                </p>
              )}
            </div>
          </form>

          {filtered.length > 0 && (
            <div className="rounded-lg border border-neutral-200 bg-white">
              <div className="border-b border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800">Derniers mouvements</div>
              <div className="divide-y divide-neutral-200">
                {movements.length === 0 && <p className="px-4 py-2 text-sm text-neutral-600">Aucun mouvement.</p>}
                {movements.slice(0, 15).map((mvt) => {
                  const item = data.find((it) => it.id === mvt.stock_item)
                  const lotLabel = mvt.lot ? lots.data.find((l) => l.id === mvt.lot)?.code || mvt.lot : ''
                  return (
                    <div key={mvt.id} className="grid gap-2 px-4 py-2 md:grid-cols-5 md:items-center">
                      <div className="text-sm font-semibold text-neutral-900">{item?.name ?? mvt.stock_item}</div>
                      <div className="text-xs text-neutral-600">{mvt.date}</div>
                      <div className="text-xs text-neutral-600">
                        {mvt.movement_type === 'in' ? '+' : '-'}{mvt.quantity}
                        {item?.unit ? ` ${item.unit}` : ''}
                      </div>
                      <div className="text-xs text-neutral-600">{lotLabel}</div>
                      <div className="text-xs text-neutral-700">{mvt.reason}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
