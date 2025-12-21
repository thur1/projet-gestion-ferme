import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Package,
  Plus,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Search,
  Filter,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatsCard } from '@/shared/components/professional';
import { coreApi } from '@/services/core';
import { offlineQueue } from '@/shared/services/offline';
import { Skeleton } from '@/shared/components/ui/skeleton';

 type FarmOption = { id: string; name: string };
type StockItem = {
  id: string;
  name: string;
  item_type: 'feed' | 'med' | 'other';
  quantity: number;
  unit: string;
  alert_threshold?: number;
};

type StockMovement = {
  id: string;
  date: string;
  movement_type: 'in' | 'out';
  quantity: number;
  reason?: string;
  stock_item: string;
  lot?: string | null;
};

export default function StockManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [farms, setFarms] = useState<FarmOption[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<StockItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    item_type: 'feed' as StockItem['item_type'],
    unit: 'kg',
    alert_threshold: '',
  });
  const [movementDraft, setMovementDraft] = useState({
    itemId: '',
    movement_type: 'out' as StockMovement['movement_type'],
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    let mounted = true;
    async function loadFarms() {
      try {
        setLoading(true);
        const data = await coreApi.farms.list();
        if (!mounted) return;
        const list = (data as any[]).map((f) => ({ id: String((f as any).id), name: (f as any).name }));
        setFarms(list);
        if (list.length > 0) {
          setSelectedFarmId((prev) => prev ?? list[0].id);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError('Impossible de charger les fermes');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFarms();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedFarmId) return;
    let mounted = true;
    async function loadStock() {
      try {
        setLoading(true);
        setError(null);
        const [itemsRes, movesRes] = await Promise.all([
          coreApi.stock.list({ farm_id: selectedFarmId }),
          coreApi.stockMovements.list({ farm_id: selectedFarmId }),
        ]);
        if (!mounted) return;
        setItems(itemsRes as StockItem[]);
        setMovements(movesRes as StockMovement[]);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Impossible de charger le stock');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadStock();
    return () => {
      mounted = false;
    };
  }, [selectedFarmId]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(q);
      const matchCategory = filterCategory === 'all' || item.item_type === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [filterCategory, items, searchQuery]);

  const lowStockItems = items.filter(
    (item) => item.alert_threshold !== undefined && Number(item.quantity) < Number(item.alert_threshold)
  );

  const kpis = {
    itemsCount: items.length,
    alerts: lowStockItems.length,
    movesCount: movements.length,
  };

  const handleCreateItem = async () => {
    if (!selectedFarmId || !newItem.name.trim()) return;
    const payload = {
      farm: selectedFarmId,
      name: newItem.name,
      item_type: newItem.item_type,
      unit: newItem.unit,
      alert_threshold: newItem.alert_threshold ? Number(newItem.alert_threshold) : undefined,
    };

    try {
      if (!navigator.onLine) {
        await offlineQueue.enqueue({ type: 'CREATE', endpoint: '/stock-items/', method: 'POST', data: payload });
        setItems((prev) => [...prev, { ...payload, id: `temp-${Date.now()}`, quantity: 0 } as StockItem]);
      } else {
        const created = await coreApi.stock.create(payload);
        setItems((prev) => [...prev, created as StockItem]);
      }
      setIsAddDialogOpen(false);
      setNewItem({ name: '', item_type: 'feed', unit: 'kg', alert_threshold: '' });
    } catch (err) {
      console.error(err);
      setError('Creation du produit impossible');
    }
  };

  const handleMovementSubmit = async () => {
    if (!selectedFarmId || !movementDraft.itemId || !movementDraft.quantity) return;
    const payload = {
      stock_item: movementDraft.itemId,
      movement_type: movementDraft.movement_type,
      quantity: Number(movementDraft.quantity),
      date: new Date().toISOString().slice(0, 10),
      reason: movementDraft.reason || undefined,
    };

    try {
      setLoadingMovements(true);
      if (!navigator.onLine) {
        await offlineQueue.enqueue({ type: 'CREATE', endpoint: '/stock-movements/', method: 'POST', data: payload });
        setMovements((prev) => [{ id: `temp-${Date.now()}`, ...payload } as StockMovement, ...prev]);
      } else {
        const created = await coreApi.stockMovements.create(payload);
        setMovements((prev) => [created as StockMovement, ...prev]);
        const refreshed = await coreApi.stock.list({ farm_id: selectedFarmId });
        setItems(refreshed as StockItem[]);
      }
      setMovementDraft({ itemId: '', movement_type: 'out', quantity: '', reason: '' });
    } catch (err) {
      console.error(err);
      setError('Impossible denregistrer le mouvement');
    } finally {
      setLoadingMovements(false);
    }
  };

  return (
    <div className="min-h-screen space-y-8 pb-12">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-slate-600 hover:text-[#1f5c3f] transition-colors">
          Dashboard
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-900">Stock</span>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            <span className="text-gradient-agri">Gestion du Stock</span>
          </h1>
          <p className="text-lg text-slate-600">Suivi des produits et mouvements</p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Ferme</span>
            <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder={loading ? 'Chargement...' : 'Selectionner'} />
              </SelectTrigger>
              <SelectContent>
                {farms.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouveau produit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un produit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">Nom du produit</Label>
                <Input
                  id="productName"
                  placeholder="Ex: Aliment Demarrage"
                  value={newItem.name}
                  onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Type</Label>
                  <Select value={newItem.item_type} onValueChange={(v) => setNewItem((p) => ({ ...p, item_type: v as StockItem['item_type'] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feed">Aliments</SelectItem>
                      <SelectItem value="med">Medicaments</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Unite</Label>
                  <Input
                    value={newItem.unit}
                    onChange={(e) => setNewItem((p) => ({ ...p, unit: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="threshold">Seuil d'alerte</Label>
                <Input
                  id="threshold"
                  type="number"
                  placeholder="Ex: 100"
                  value={newItem.alert_threshold}
                  onChange={(e) => setNewItem((p) => ({ ...p, alert_threshold: e.target.value }))}
                />
              </div>
              <Button className="w-full" onClick={handleCreateItem} disabled={loading}>
                Enregistrer
              </Button>
              {error && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded px-3 py-2">{error}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Produits"
          value={loading ? '...' : kpis.itemsCount.toString()}
          subtitle="produits references"
          icon={Package}
          variant="default"
        />
        <StatsCard
          title="Valeur totale"
          value="N/A"
          subtitle="Valeur non calculee"
          icon={TrendingUp}
          variant="info"
        />
        <StatsCard
          title="Alertes stock"
          value={loading ? '...' : kpis.alerts.toString()}
          subtitle="produits en rupture"
          icon={AlertTriangle}
          variant={kpis.alerts > 0 ? 'warning' : 'success'}
        />
        <StatsCard
          title="Mouvements J-7"
          value={loadingMovements ? '...' : kpis.movesCount.toString()}
          subtitle="entrees et sorties"
          icon={ArrowDown}
          variant="default"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes categories</SelectItem>
                <SelectItem value="feed">Aliments</SelectItem>
                <SelectItem value="med">Medicaments</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        {!loading && filteredItems.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            Aucun article pour cette ferme. Ajoutez un produit pour commencer.
          </div>
        )}
        {filteredItems.map((item) => {
          const stockPercentage = item.alert_threshold
            ? (Number(item.quantity) / Number(item.alert_threshold)) * 100
            : 100;
          const isLowStock = item.alert_threshold !== undefined && Number(item.quantity) < Number(item.alert_threshold);
          const label = item.item_type === 'feed' ? 'Aliments' : item.item_type === 'med' ? 'Medicaments' : 'Autre';

          return (
            <Card key={item.id} className="group hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                          <Badge variant="secondary">{label}</Badge>
                          {isLowStock && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Alerte
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-neutral-500">
                          Seuil: {item.alert_threshold ?? ''} {item.unit}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">
                          <strong className="text-lg text-neutral-900">{item.quantity}</strong> {item.unit}
                        </span>
                        {item.alert_threshold !== undefined && (
                          <span className="text-neutral-500">Seuil: {item.alert_threshold}</span>
                        )}
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                        <div
                          className={cn('h-full transition-all', isLowStock ? 'bg-error-500' : 'bg-success-500')}
                          style={{ width: `${Math.min(stockPercentage, 130)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog
                      onOpenChange={(open) => {
                        if (open) {
                          setMovementDraft({ itemId: item.id, movement_type: 'in', quantity: '', reason: '' });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <ArrowDown className="h-4 w-4 text-success-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Entree de stock - {item.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`quantity-in-${item.id}`}>Quantite ({item.unit})</Label>
                            <Input
                              id={`quantity-in-${item.id}`}
                              type="number"
                              placeholder="100"
                              value={movementDraft.itemId === item.id ? movementDraft.quantity : ''}
                              onChange={(e) => setMovementDraft((p) => ({ ...p, quantity: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`reason-in-${item.id}`}>Motif</Label>
                            <Input
                              id={`reason-in-${item.id}`}
                              placeholder="Achat fournisseur..."
                              value={movementDraft.itemId === item.id ? movementDraft.reason : ''}
                              onChange={(e) => setMovementDraft((p) => ({ ...p, reason: e.target.value }))}
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => {
                              setMovementDraft((p) => ({ ...p, movement_type: 'in', itemId: item.id }));
                              handleMovementSubmit();
                            }}
                            disabled={loadingMovements || !movementDraft.quantity}
                          >
                            Enregistrer l'entree
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      onOpenChange={(open) => {
                        if (open) {
                          setMovementDraft({ itemId: item.id, movement_type: 'out', quantity: '', reason: '' });
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <ArrowUp className="h-4 w-4 text-error-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Sortie de stock - {item.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`quantity-out-${item.id}`}>Quantite ({item.unit})</Label>
                            <Input
                              id={`quantity-out-${item.id}`}
                              type="number"
                              placeholder="50"
                              value={movementDraft.itemId === item.id ? movementDraft.quantity : ''}
                              onChange={(e) => setMovementDraft((p) => ({ ...p, quantity: e.target.value }))}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`reason-out-${item.id}`}>Motif</Label>
                            <Input
                              id={`reason-out-${item.id}`}
                              placeholder="Consommation lot..."
                              value={movementDraft.itemId === item.id ? movementDraft.reason : ''}
                              onChange={(e) => setMovementDraft((p) => ({ ...p, reason: e.target.value }))}
                            />
                          </div>
                          <Button
                            className="w-full"
                            variant="secondary"
                            onClick={() => {
                              setMovementDraft((p) => ({ ...p, movement_type: 'out', itemId: item.id }));
                              handleMovementSubmit();
                            }}
                            disabled={loadingMovements || !movementDraft.quantity}
                          >
                            Enregistrer la sortie
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Derniers mouvements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movements.length === 0 && (
              <p className="text-sm text-neutral-600">Aucun mouvement recense.</p>
            )}
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between border-b border-neutral-200 pb-3 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      movement.movement_type === 'in' ? 'bg-success-100' : 'bg-error-100'
                    )}
                  >
                    {movement.movement_type === 'in' ? (
                      <ArrowDown className="h-5 w-5 text-success-600" />
                    ) : (
                      <ArrowUp className="h-5 w-5 text-error-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{movement.stock_item}</p>
                    <p className="text-sm text-neutral-500">
                      {movement.reason || 'Mouvement stock'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'font-semibold',
                      movement.movement_type === 'in' ? 'text-success-600' : 'text-error-600'
                    )}
                  >
                    {movement.movement_type === 'in' ? '+' : '-'}
                    {movement.quantity}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {new Date(movement.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
