import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import Navigation from '@/components/Navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

export default function StockPage() {
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [movementData, setMovementData] = useState({
    stockItemId: '',
    movementType: '',
    quantity: '',
    reason: '',
  });

  // Mock stock data
  const stockItems = [
    { id: '1', name: 'Aliment Poulet Premium', category: 'feed', quantity: 450, unit: 'kg', reorderLevel: 100, status: 'good' },
    { id: '2', name: 'Vitamines A+D3', category: 'supplement', quantity: 25, unit: 'L', reorderLevel: 10, status: 'good' },
    { id: '3', name: 'Aliment Dinde', category: 'feed', quantity: 80, unit: 'kg', reorderLevel: 100, status: 'low' },
    { id: '4', name: 'Antibiotique Large Spectre', category: 'medication', quantity: 5, unit: 'L', reorderLevel: 10, status: 'critical' },
  ];

  const recentMovements = [
    { id: '1', item: 'Aliment Poulet Premium', type: 'out', quantity: 50, date: '2024-12-07', reason: 'Alimentation quotidienne' },
    { id: '2', item: 'Vitamines A+D3', type: 'in', quantity: 15, date: '2024-12-06', reason: 'Réapprovisionnement' },
    { id: '3', item: 'Aliment Dinde', type: 'out', quantity: 20, date: '2024-12-06', reason: 'Alimentation lot-002' },
  ];

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call
    console.log('Movement:', movementData);
    alert('Mouvement enregistré !');
    setShowMovementForm(false);
    setMovementData({ stockItemId: '', movementType: '', quantity: '', reason: '' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">Critique</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">Bas</Badge>;
      default:
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">OK</Badge>;
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Gestion du Stock
            </h1>
            <p className="text-gray-600">
              Inventaire et mouvements de stock
            </p>
          </div>
          <Button onClick={() => setShowMovementForm(!showMovementForm)}>
            {showMovementForm ? 'Annuler' : '+ Nouveau Mouvement'}
          </Button>
        </div>

        {/* Stock Alerts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock Bas</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">3</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critique</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">1</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Movement Form */}
        {showMovementForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nouveau Mouvement de Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMovementSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockItemId">Article *</Label>
                    <Select
                      value={movementData.stockItemId}
                      onValueChange={(value) => setMovementData(prev => ({ ...prev, stockItemId: value }))}
                      required
                    >
                      <SelectTrigger id="stockItemId">
                        <SelectValue placeholder="Sélectionner un article" />
                      </SelectTrigger>
                      <SelectContent>
                        {stockItems.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} ({item.quantity} {item.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="movementType">Type *</Label>
                    <Select
                      value={movementData.movementType}
                      onValueChange={(value) => setMovementData(prev => ({ ...prev, movementType: value }))}
                      required
                    >
                      <SelectTrigger id="movementType">
                        <SelectValue placeholder="Entrée ou sortie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Entrée (+)</SelectItem>
                        <SelectItem value="out">Sortie (-)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      min="0.1"
                      placeholder="50"
                      value={movementData.quantity}
                      onChange={(e) => setMovementData(prev => ({ ...prev, quantity: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Raison *</Label>
                    <Input
                      id="reason"
                      type="text"
                      placeholder="Ex: Alimentation quotidienne"
                      value={movementData.reason}
                      onChange={(e) => setMovementData(prev => ({ ...prev, reason: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit">Enregistrer le Mouvement</Button>
                  <Button type="button" variant="outline" onClick={() => setShowMovementForm(false)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stock Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inventaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead className="text-right">Seuil</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="capitalize">{item.category}</TableCell>
                      <TableCell className="text-right">
                        <span className={item.quantity < item.reorderLevel ? 'text-red-600 font-semibold' : ''}>
                          {item.quantity} {item.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-gray-500">{item.reorderLevel} {item.unit}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Historique</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Mouvements Récents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      movement.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {movement.type === 'in' ? (
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{movement.item}</p>
                      <p className="text-sm text-gray-500">{movement.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                      {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                    </p>
                    <p className="text-xs text-gray-500">{movement.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
