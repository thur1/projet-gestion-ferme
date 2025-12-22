import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useDashboardSummary } from '../hooks/useDashboardSummary'
import { useFarms } from '../hooks/useFarms'

export default function DashboardPage() {
  const [selectedFarm, setSelectedFarm] = useState<string | undefined>(undefined)
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week')
  const navigate = useNavigate()
  const { data, loading, error } = useDashboardSummary(selectedFarm)
  const farmsList = useFarms()
  const farms = Array.isArray(farmsList.data) ? farmsList.data : []
  const sortedMargins = [...(data?.lot_margins_30d ?? [])].sort((a, b) => b.margin - a.margin)
  const topLotMargin = sortedMargins[0]

  const timeLabel = { day: '24h', week: '7j', month: '30j', year: '365j' }[period]

  const scaled = useMemo(() => {
    if (!data) {
      return {
        lotsActive: '—',
        lotsTotal: '—',
        mortalityRate: '—',
        mortalityCount: '—',
        stockAlertsCount: '0',
        eggs: '—',
        feedIntake: '—',
        fcr: '—',
        gmq: '—',
        eggsPerHen: '—',
        farmMargin: '—',
        topLotMarginValue: null as number | null,
      }
    }

    const periodFactor = (() => {
      if (period === 'day') return 1 / 7
      if (period === 'week') return 1
      if (period === 'month') return 30 / 7
      return 365 / 7
    })()

    const marginFactor = (() => {
      if (period === 'day') return 1 / 30
      if (period === 'week') return 7 / 30
      if (period === 'month') return 1
      return 365 / 30
    })()

    return {
      lotsActive: data.active_lots,
      lotsTotal: data.total_lots,
      mortalityRate: `${data.mortality_rate_percent_7d}%`,
      mortalityCount: Math.round(data.mortality_7d * periodFactor * 10) / 10,
      stockAlertsCount: data.stock_alerts?.length ?? 0,
      eggs: Math.round(data.eggs_count_7d * periodFactor),
      feedIntake: `${Math.round(data.feed_intake_kg_7d * periodFactor)} kg`,
      fcr: data.feed_conversion_ratio ?? '—',
      gmq: data.avg_daily_gain_kg,
      eggsPerHen: `${data.eggs_per_hen_per_day} oeuf/j/poule`,
      farmMargin: `${Math.round(data.farm_margin_30d * marginFactor)} €`,
      topLotMarginValue: topLotMargin ? Math.round(topLotMargin.margin * marginFactor) : null,
    }
  }, [data, period, topLotMargin])

  const lotsActive = loading ? '...' : scaled.lotsActive
  const lotsTotal = loading ? '...' : scaled.lotsTotal
  const mortalityRate = loading ? '...' : scaled.mortalityRate
  const mortalityCount = loading ? '...' : scaled.mortalityCount
  const stockAlertsCount = loading ? '...' : scaled.stockAlertsCount
  const eggs = loading ? '...' : scaled.eggs
  const feedIntake = loading ? '...' : scaled.feedIntake
  const fcr = loading ? '...' : scaled.fcr
  const gmq = loading ? '...' : scaled.gmq
  const eggsPerHen = loading ? '...' : scaled.eggsPerHen
  const farmMargin = loading ? '...' : scaled.farmMargin
  const topLotMarginText = loading
    ? '...'
    : topLotMargin
    ? `Top lot: ${topLotMargin.lot_code || topLotMargin.lot_id} (${scaled.topLotMarginValue} €)`
    : 'Pas de données lot'
  const hasError = error || farmsList.error

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-700">Vue d'ensemble</p>
              <CardTitle>Tableau de bord élevage</CardTitle>
              <CardDescription>
                Pilotage des lots, santé, alimentation, stocks et marges. Données {timeLabel} actualisées.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/units')}
              >
                Créer une ferme
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(['day', 'week', 'month', 'year'] as const).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={period === p ? 'primary' : 'ghost'}
                onClick={() => setPeriod(p)}
              >
                {p === 'day' && 'Jour'}
                {p === 'week' && 'Semaine'}
                {p === 'month' && 'Mois'}
                {p === 'year' && 'Année'}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge
            variant="info"
            className="cursor-pointer"
            onClick={() => window.open('https://github.com/thur1/projet-gestion-ferme/blob/main/frontend/PWA_DOCUMENTATION.md', '_blank')}
          >
            PWA hors ligne
          </Badge>
          <Badge
            variant="success"
            className="cursor-pointer"
            onClick={() => window.open('https://github.com/thur1/projet-gestion-ferme/blob/main/README.md', '_blank')}
          >
            JWT + RBAC
          </Badge>
          <Button size="sm" variant="primary" onClick={() => navigate('/sante')}>
            Voir la santé
          </Button>
          <Button size="sm" variant="secondary" onClick={() => navigate('/lots')}>
            Importer des lots
          </Button>
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
          label={`Mortalité (${timeLabel})`}
          value={mortalityRate}
          muted={`Décès: ${mortalityCount}`}
          error={hasError}
        />
        <StatCard
          label="Alertes stock"
          value={stockAlertsCount}
          muted={`Stocks critiques: ${stockAlertsCount}`}
          error={hasError}
        />
        <StatCard
          label={`IC (${timeLabel})`}
          value={fcr}
          muted={`Ingestion: ${feedIntake}`}
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
          muted={`Production: ${eggs} oeufs`}
          error={hasError}
        />
        <StatCard
          label={`Marge (${timeLabel})`}
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
