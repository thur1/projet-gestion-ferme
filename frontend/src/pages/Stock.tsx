import { useStockItems } from '../hooks/useStockItems'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function StockPage() {
  const { data, loading, error } = useStockItems()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock</CardTitle>
          <CardDescription>Chargement en cours...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stock</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
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
        </CardHeader>
        <CardContent className="space-y-3">
          {data.length === 0 && <p className="text-sm text-neutral-600">Aucun article.</p>}
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{item.name}</p>
                <p className="text-xs text-neutral-600">{item.quantity} {item.unit}</p>
              </div>
              <Badge variant="info">{item.category ?? 'Stock'}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
