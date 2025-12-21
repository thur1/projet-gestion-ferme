import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useDashboardSummary } from '../hooks/useDashboardSummary'
import { useFarms } from '../hooks/useFarms'

export default function DashboardPage() {
  const [selectedFarm, setSelectedFarm] = useState<string | undefined>(undefined)
  const { data, loading, error } = useDashboardSummary(selectedFarm)
  const farmsList = useFarms()
  const farms = Array.isArray(farmsList.data) ? farmsList.data : []
  const sortedMargins = [...(data?.lot_margins_30d ?? [])].sort((a, b) => b.margin - a.margin)
  const topLotMargin = sortedMargins[0]

  const lotsActive = loading ? '...' : data?.active_lots ?? '—'
  const lotsTotal = loading ? '...' : data?.total_lots ?? '—'
  const mortalityRate = loading ? '...' : data ? `${data.mortality_rate_percent_7d}%` : '—'
  const mortalityCount = loading ? '...' : data?.mortality_7d ?? '—'
  const stockAlertsCount = loading ? '...' : data?.stock_alerts?.length ?? '0'
  const eggs7d = loading ? '...' : data?.eggs_count_7d ?? '—'
  const feedIntake = loading ? '...' : data ? `${data.feed_intake_kg_7d} kg` : '—'
  const fcr = loading ? '...' : data?.feed_conversion_ratio ?? '—'
  const gmq = loading ? '...' : data?.avg_daily_gain_kg ?? '—'
  const eggsPerHen = loading ? '...' : data ? `${data.eggs_per_hen_per_day} œuf/j/poule` : '—'
  const farmMargin = loading ? '...' : data ? `${data.farm_margin_30d} €` : '—'
  const topLotMarginText = topLotMargin
    ? `Top lot: ${topLotMargin.lot_code || topLotMargin.lot_id} (${topLotMargin.margin} €)`
    : 'Pas de données lot'
  const hasError = error || farmsList.error

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold text-brand-700">Vue d'ensemble</p>
          <CardTitle>Dashboard élevage</CardTitle>
          <CardDescription>
            Suivi des lots, santé, alimentation et stocks. KPIs 7j basés sur les enregistrements journaliers.
          </CardDescription>
          <div className="mt-3 flex items-center gap-3">
            <label className="text-sm font-medium text-neutral-700" htmlFor="farm-filter-dash">
              Ferme
            </label>
            <select
              id="farm-filter-dash"
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm focus:border-brand-600 focus:outline-none"
              value={selectedFarm ?? (farms[0]?.id ?? 'all')}
              onChange={(e) => {
                const val = e.target.value
                setSelectedFarm(val === 'all' ? undefined : val)
              }}
            >
              <option value="all">Toutes les fermes</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge variant="info">PWA offline</Badge>
          <Badge variant="success">JWT + RBAC</Badge>
          <Button size="sm" variant="primary">Voir la santé</Button>
          <Button size="sm" variant="secondary">Importer des lots</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Lots actifs"
          value={lotsActive}
          muted={`Total lots: ${lotsTotal}`}
          error={hasError}
        />
        <StatCard
          label="Mortalité 7j (%)"
          value={mortalityRate}
          muted={`Décès: ${mortalityCount}`}
          error={hasError}
        />
        <StatCard
          label="Alertes stock"
          value={stockAlertsCount}
          muted={`Œufs 7j: ${eggs7d}`}
          error={hasError}
        />
        <StatCard
          label="IC (7j)"
          value={fcr}
          muted={`Conso: ${feedIntake}`}
          error={hasError}
        />
        <StatCard
          label="GMQ (kg/j/poule)"
          value={gmq}
          muted="Gain moyen quotidien"
          error={hasError}
        />
        <StatCard
          label="Taux de ponte"
          value={eggsPerHen}
          muted={`Œufs 7j: ${eggs7d}`}
          error={hasError}
        />
        <StatCard
          label="Rentabilité 30j"
          value={farmMargin}
          muted={topLotMarginText}
          error={hasError}
        />
      </div>
    </div>
  )
}

function StatCard({ label, value, muted, error }: { label: string; value: string | number; muted?: string; error?: string }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <p className="text-sm text-neutral-500">{label}</p>
        <CardTitle>{error ? '—' : value}</CardTitle>
        {muted && <CardDescription>{muted}</CardDescription>}
        {error && <CardDescription className="text-red-600">{error}</CardDescription>}
      </CardHeader>
    </Card>
  )
}
