import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { useFarms } from '../hooks/useFarms'
import { useLots } from '../hooks/useLots'
import { useFinancialEntries } from '../hooks/useFinancialEntries'

const CATEGORY_LABELS: Record<string, string> = {
  feed: 'Aliment',
  vet: 'Véto',
  labor: 'Main d’œuvre',
  sale: 'Vente',
  other: 'Autre',
}

export default function FinancesPage() {
  const farms = useFarms()
  const [selectedFarm, setSelectedFarm] = useState<string>('all')
  const lots = useLots(selectedFarm === 'all' ? undefined : selectedFarm)
  const [selectedLot, setSelectedLot] = useState<string>('')
  const { data, loading, error, create, creating } = useFinancialEntries(
    selectedFarm === 'all' ? undefined : selectedFarm,
    selectedLot || undefined
  )

  const [form, setForm] = useState({
    date: '',
    entry_type: 'cost' as 'cost' | 'revenue',
    category: 'feed',
    amount: 0,
    notes: '',
  })
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const total = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        if (item.entry_type === 'revenue') acc.revenue += Number(item.amount)
        else acc.cost += Number(item.amount)
        return acc
      },
      { revenue: 0, cost: 0 }
    )
  }, [data])

  const isLoading = loading || farms.loading || lots.loading
  const hasError = error || farms.error || lots.error

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Finances</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Finances</CardTitle>
          <CardDescription className="text-red-600">{hasError}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Finances</CardTitle>
          <CardDescription>Coûts et recettes par ferme/lot.</CardDescription>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="text-sm font-medium text-neutral-700" htmlFor="farm-filter-fin">
              Filtrer par ferme
            </label>
            <select
              id="farm-filter-fin"
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

            <label className="text-sm font-medium text-neutral-700" htmlFor="lot-filter-fin">
              Lot
            </label>
            <select
              id="lot-filter-fin"
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
              if (selectedFarm === 'all') {
                setMessage({ type: 'error', text: 'Sélectionnez une ferme' })
                return
              }
              const payload = {
                farm: selectedFarm,
                lot: selectedLot || null,
                date: form.date,
                entry_type: form.entry_type,
                category: form.category as 'feed' | 'vet' | 'labor' | 'sale' | 'other',
                amount: Number(form.amount),
                notes: form.notes,
              }
              const res = await create(payload)
              if (res.success) {
                setMessage({ type: 'success', text: 'Entrée enregistrée' })
                setForm((prev) => ({ ...prev, amount: 0, notes: '' }))
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
                  value={form.entry_type}
                  onChange={(e) => setForm((p) => ({ ...p, entry_type: e.target.value as 'cost' | 'revenue' }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="cost">Coût</option>
                  <option value="revenue">Recette</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Catégorie
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none"
                >
                  <option value="feed">Aliment</option>
                  <option value="vet">Véto</option>
                  <option value="labor">Main d’œuvre</option>
                  <option value="sale">Vente</option>
                  <option value="other">Autre</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800">
                Montant
                <Input type="number" step={0.01} value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))} />
              </label>
              <label className="grid gap-1 text-sm font-medium text-neutral-800 md:col-span-3">
                Notes
                <Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Détail de la dépense/recette" />
              </label>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={creating || selectedFarm === 'all'}>
                {creating ? 'Ajout...' : 'Enregistrer'}
              </Button>
              {message && (
                <p className={message.type === 'error' ? 'text-sm text-red-600' : 'text-sm text-green-700'}>
                  {message.text}
                </p>
              )}
            </div>
          </form>

          <div className="flex flex-wrap gap-4 text-sm text-neutral-800">
            <span>Total coûts: {total.cost.toFixed(2)}</span>
            <span>Total recettes: {total.revenue.toFixed(2)}</span>
            <span>Résultat: {(total.revenue - total.cost).toFixed(2)}</span>
          </div>

          {data.length === 0 && <p className="text-sm text-neutral-600">Aucune entrée.</p>}

          <div className="space-y-2">
            {data.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-neutral-900">{entry.date}</div>
                  <div className="text-xs text-neutral-600">Ferme: {entry.farm} · Lot: {entry.lot || '—'}</div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-neutral-800 md:grid-cols-4">
                  <span>Type: {entry.entry_type === 'cost' ? 'Coût' : 'Recette'}</span>
                  <span>Catégorie: {CATEGORY_LABELS[entry.category] ?? entry.category}</span>
                  <span>Montant: {Number(entry.amount).toFixed(2)}</span>
                  {entry.notes && <span className="md:col-span-2">{entry.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
