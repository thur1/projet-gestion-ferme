import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Bird,
  PiggyBank,
  Plus,
  Search,
  Filter,
  Eye,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { coreApi } from '@/services/core';
import { Skeleton } from '@/shared/components/ui/skeleton';

type Lot = {
  id: string;
  unit: string;
  species: string;
  code: string;
  entry_date: string;
  initial_count: number;
  status: 'active' | 'closed';
  destination?: string;
};

type FarmOption = { id: string; name: string };
type UnitOption = { id: string; name: string; species: string; farm: string };
type SpeciesOption = { id: string; code: string; name: string };

export default function ProjectsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const [farms, setFarms] = useState<FarmOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [species, setSpecies] = useState<SpeciesOption[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLots, setLoadingLots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      try {
        setLoading(true);
        const [farmsRes, speciesRes] = await Promise.all([
          coreApi.farms.list(),
          coreApi.species.list(),
        ]);
        if (!mounted) return;
        const farmOptions = (farmsRes as any[]).map((f) => ({ id: String((f as any).id), name: (f as any).name }));
        const speciesOptions = (speciesRes as any[]).map((s) => ({
          id: String((s as any).id),
          code: String((s as any).code ?? ''),
          name: String((s as any).name ?? ''),
        }));
        setFarms(farmOptions);
        setSpecies(speciesOptions);
        if (farmOptions.length > 0) {
          setSelectedFarm((prev) => prev || farmOptions[0].id);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError('Impossible de charger les données');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedFarm) {
      setUnits([]);
      return;
    }
    let mounted = true;
    async function loadUnits() {
      try {
        const data = await coreApi.units.list({ farm_id: selectedFarm });
        if (!mounted) return;
        const unitOptions = (data as any[]).map((u) => ({
          id: String((u as any).id),
          name: String((u as any).name ?? ''),
          species: String((u as any).species ?? ''),
          farm: String((u as any).farm ?? ''),
        }));
        setUnits(unitOptions);
      } catch (err) {
        console.error(err);
      }
    }
    loadUnits();
    return () => {
      mounted = false;
    };
  }, [selectedFarm]);

  useEffect(() => {
    let mounted = true;
    async function loadLots() {
      if (!selectedFarm) {
        setLots([]);
        return;
      }
      try {
        setLoadingLots(true);
        setError(null);
        const params: Record<string, string> = { farm_id: selectedFarm };
        if (filterType !== 'all') params.species = filterType;
        if (filterStatus !== 'all') params.status = filterStatus;
        const data = await coreApi.lots.list(params);
        if (!mounted) return;
        setLots(data as Lot[]);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Impossible de charger les projets');
      } finally {
        if (mounted) setLoadingLots(false);
      }
    }
    loadLots();
    return () => {
      mounted = false;
    };
  }, [filterStatus, filterType, selectedFarm]);

  const speciesMap = useMemo(() => {
    return species.reduce<Record<string, SpeciesOption>>((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  }, [species]);

  const unitMap = useMemo(() => {
    return units.reduce<Record<string, UnitOption>>((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {});
  }, [units]);

  // Filtrage
  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return lots.filter((lot) => {
      const unitName = unitMap[lot.unit]?.name ?? '';
      const speciesLabel = speciesMap[lot.species]?.name ?? '';
      const matchSearch =
        lot.code.toLowerCase().includes(q) || unitName.toLowerCase().includes(q) || speciesLabel.toLowerCase().includes(q);
      return matchSearch;
    });
  }, [lots, searchQuery, speciesMap, unitMap]);

  const statusLabel = (status: Lot['status']) => (status === 'active' ? 'Actif' : 'Clôturé');
  const statusBadgeVariant = (status: Lot['status']) => (status === 'active' ? 'default' : 'secondary');
  const computeAgeDays = (entryDate: string) => {
    const diff = Date.now() - new Date(entryDate).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Breadcrumb / Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-slate-600 hover:text-[#1f5c3f] transition-colors">
          Dashboard
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-900">Projets</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            <span className="text-gradient-agri">Projets</span>
          </h1>
          <p className="text-lg text-slate-600">
            Gestion de vos projets avicoles et porcins
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/projects/new">
            <Plus className="h-5 w-5" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Ferme */}
            <Select value={selectedFarm} onValueChange={setSelectedFarm}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Ferme" />
              </SelectTrigger>
              <SelectContent>
                {farms.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre Type */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les espèces</SelectItem>
                {species.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name || s.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre Statut */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="closed">Clôturé</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des projets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
          </p>
          <Badge variant="secondary">
            {filteredProjects.filter((p) => p.status === 'active').length} actifs
          </Badge>
        </div>

        {error && (
          <Card>
            <CardContent className="p-6 text-sm text-red-700 bg-red-50 border border-red-100">
              {error}
            </CardContent>
          </Card>
        )}

        {loading || loadingLots ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx}>
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center space-y-2">
              <p className="text-base font-semibold text-neutral-900">Aucun projet</p>
              <p className="text-sm text-neutral-600">Ajustez vos filtres ou créez un nouveau projet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => {
              const unitName = unitMap[project.unit]?.name ?? 'Unité inconnue';
              const speciesLabel = speciesMap[project.species]?.name || speciesMap[project.species]?.code || 'Espèce';
              const ageDays = computeAgeDays(project.entry_date);
              return (
                <Card
                  key={project.id}
                  className={cn(
                    'group transition-all hover:shadow-md',
                    project.status === 'closed' && 'opacity-80'
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      {/* Info projet */}
                      <div className="flex items-start gap-4">
                        {/* Icône type */}
                        <div
                          className={cn(
                            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg',
                            'bg-primary-100'
                          )}
                        >
                          {speciesLabel.toLowerCase().includes('por') ? (
                            <PiggyBank className="h-6 w-6 text-secondary-600" />
                          ) : (
                            <Bird className="h-6 w-6 text-primary-600" />
                          )}
                        </div>

                        {/* Détails */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-neutral-900">
                              {project.code}
                            </h3>
                            <Badge
                              variant={statusBadgeVariant(project.status)}
                              className={cn(
                                project.status === 'active' && 'bg-success-100 text-success-700'
                              )}
                            >
                              {statusLabel(project.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-neutral-500">
                            {speciesLabel} • {unitName} • Démarré le{' '}
                            {new Date(project.entry_date).toLocaleDateString('fr-FR')}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="text-neutral-600">
                              <strong>{project.initial_count}</strong> animaux (initial)
                            </span>
                            <span className="text-neutral-600">
                              <strong>{ageDays}</strong> jours
                            </span>
                            {project.destination && (
                              <span className="text-neutral-600">Destination: {project.destination}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/projects/${project.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Détails
                          </Link>
                        </Button>
                        <Button asChild size="icon" variant="ghost">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
