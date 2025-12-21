import { useHealthEvents } from '../hooks/useHealthEvents'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function SantePage() {
  const { data, loading, error } = useHealthEvents()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Santé</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Santé</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
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
        </CardHeader>
        <CardContent className="space-y-3">
          {data.length === 0 && <p className="text-sm text-neutral-600">Aucun événement.</p>}
          {data.map((ev) => (
            <div key={ev.id} className="flex items-start justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{ev.description}</p>
                <p className="text-xs text-neutral-600">Lot #{ev.lot} · {new Date(ev.date).toLocaleDateString()}</p>
              </div>
              <Badge variant="warning">{ev.event_type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
