import { useLots } from '../hooks/useLots'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function LotsPage() {
  const { data, loading, error } = useLots()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lots</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lots</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lots</CardTitle>
          <CardDescription>Liste des lots par unité/espèce.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {data.length === 0 && <p className="text-sm text-neutral-600">Aucun lot.</p>}
          {data.map((lot) => (
            <div
              key={lot.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-neutral-900">{lot.name}</p>
                <p className="text-xs text-neutral-600">Effectif: {lot.headcount}</p>
              </div>
              <Badge variant="info">Unit #{lot.unit}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
