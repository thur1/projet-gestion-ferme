import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useDashboardSummary } from '../hooks/useDashboardSummary'

export default function DashboardPage() {
  const { data, loading, error } = useDashboardSummary()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold text-brand-700">Vue d'ensemble</p>
          <CardTitle>Dashboard élevage</CardTitle>
          <CardDescription>
            Suivi des lots, santé, alimentation et stocks. Prochaine étape : connecter les données API.
          </CardDescription>
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
          label="Fermes"
          value={loading ? '...' : data?.farms_total ?? '—'}
          muted="Total"
          error={error}
        />
        <StatCard
          label="Unités"
          value={loading ? '...' : data?.units_total ?? '—'}
          muted="Multi-espèces"
          error={error}
        />
        <StatCard
          label="Lots actifs"
          value={loading ? '...' : data?.lots_total ?? '—'}
          muted={`Têtes: ${loading ? '...' : data?.headcount_total ?? '—'}`}
          error={error}
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
