/**
 * Dashboard Home - AgriTrack Pro
 * Vue d'ensemble optimisée de l'exploitation
 */

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import {
  Package,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowRight,
  Bird,
  PiggyBank,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { coreApi } from '@/services/core';
import { Skeleton } from '@/shared/components/ui/skeleton';

type FarmOption = { id: string; name: string; location?: string };

type DashboardSummary = {
  total_lots: number;
  active_lots: number;
  mortality_7d: number;
  feed_intake_kg_7d: number;
  milk_production_l_7d: number;
  eggs_count_7d: number;
  stock_alerts: { id: string | number; name: string; quantity: number; unit: string; alert_threshold: number }[];
};

const financeData = [
  { month: 'Juil', revenu: 1800, depense: 1200 },
  { month: 'Août', revenu: 2100, depense: 1350 },
  { month: 'Sept', revenu: 1950, depense: 1100 },
  { month: 'Oct', revenu: 2300, depense: 1400 },
  { month: 'Nov', revenu: 2050, depense: 1250 },
  { month: 'Déc', revenu: 2400, depense: 1500 },
];

export default function DashboardHome() {
  const [farms, setFarms] = useState<FarmOption[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les fermes accessibles
  useEffect(() => {
    let isMounted = true;
    async function loadFarms() {
      try {
        setLoadingFarms(true);
        const data = await coreApi.farms.list();
        if (!isMounted) return;
        const farmsList: FarmOption[] = (data as any[]).map((farm) => ({
          id: String((farm as any).id),
          name: (farm as any).name,
          location: (farm as any).location,
        }));
        setFarms(farmsList);
        if (farmsList.length > 0) {
          setSelectedFarmId((prev) => prev ?? farmsList[0].id);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Impossible de charger les fermes');
      } finally {
        if (isMounted) setLoadingFarms(false);
      }
    }
    loadFarms();
    return () => {
      isMounted = false;
    };
  }, []);

  // Charger le résumé pour la ferme sélectionnée
  useEffect(() => {
    if (!selectedFarmId) return;
    let isMounted = true;
    async function loadSummary() {
      try {
        setLoadingSummary(true);
        setError(null);
        const farmId = selectedFarmId;
        if (!farmId) return;
        const data = await coreApi.dashboard.summary(farmId);
        if (!isMounted) return;
        setSummary(data as DashboardSummary);
      } catch (err) {
        console.error(err);
        if (isMounted) setError('Impossible de charger le tableau de bord');
      } finally {
        if (isMounted) setLoadingSummary(false);
      }
    }
    loadSummary();
    return () => {
      isMounted = false;
    };
  }, [selectedFarmId]);

  const hasFarm = farms.length > 0;
  const kpi = useMemo(() => ({
    lotsActifs: summary?.active_lots ?? 0,
    lotsTotal: summary?.total_lots ?? 0,
    stockAlerts: summary?.stock_alerts?.length ?? 0,
    mortalite7d: summary?.mortality_7d ?? 0,
    eggs7d: summary?.eggs_count_7d ?? 0,
    feed7d: summary?.feed_intake_kg_7d ?? 0,
  }), [summary]);

  const activeProjects: any[] = [];

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Logo + Actions rapides - Style Gavicole */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-6">
        {/* Logo AgriTrack Pro */}
        <Link to="/dashboard" className="flex items-center gap-3 transition-transform hover:scale-105">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f5c3f] to-[#194c34] shadow-xl" style={{ boxShadow: '0 4px 16px 0 rgba(31, 92, 63, 0.28)' }}>
            <svg
              className="h-9 w-9 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-2xl font-bold tracking-tight" style={{ color: '#1f5c3f' }}>
              AgriTrack Pro
            </span>
            <span className="text-xs font-medium text-slate-500">Votre ferme, maîtrisée</span>
          </div>
        </Link>

        {/* Sélecteur de ferme */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600">Ferme</span>
          <Select value={selectedFarmId ?? undefined} onValueChange={setSelectedFarmId}>
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder={loadingFarms ? 'Chargement...' : 'Sélectionner une ferme'} />
            </SelectTrigger>
            <SelectContent>
              {farms.map((farm) => (
                <SelectItem key={farm.id} value={farm.id}>
                  {farm.name}{farm.location ? ` • ${farm.location}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!loadingFarms && !hasFarm && (
            <Badge variant="secondary">Aucune ferme encore créée</Badge>
          )}
        </div>
      </div>

        {/* Actions rapides sur la même ligne */}
        <div className="flex flex-1 gap-4 overflow-x-auto">
        <Link
          to="/projects/new"
          className="group flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-slate-200 bg-white/90 p-4 min-w-[140px] transition-all hover:border-[#1f5c3f] hover:shadow-lg"
        >
          <h3 className="text-sm font-bold text-slate-900">Nouveau projet</h3>
          <p className="text-xs text-slate-600">Créer un nouveau lot</p>
        </Link>

        <Link
          to="/stock"
          className="group flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-slate-200 bg-white/90 p-4 min-w-[140px] transition-all hover:border-[#1f5c3f] hover:shadow-lg"
        >
          <h3 className="text-sm font-bold text-slate-900">Gérer stock</h3>
          <p className="text-xs text-slate-600">Entrées et sorties</p>
        </Link>

        <Link
          to="/projects"
          className="group flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-slate-200 bg-white/90 p-4 min-w-[140px] transition-all hover:border-[#1f5c3f] hover:shadow-lg"
        >
          <h3 className="text-sm font-bold text-slate-900">Saisie quotidienne</h3>
          <p className="text-xs text-slate-600">Enregistrer données</p>
        </Link>

        <Link
          to="/reports"
          className="group flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-slate-200 bg-white/90 p-4 min-w-[140px] transition-all hover:border-[#1f5c3f] hover:shadow-lg"
        >
          <h3 className="text-sm font-bold text-slate-900">Rapports</h3>
          <p className="text-xs text-slate-600">Analyses & exports</p>
        </Link>
        </div>
      </div>

      {/* Header avec impact visuel fort */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Bienvenue sur <span className="text-gradient-agri">AgriTrack Pro</span>
          </h1>
          <p className="text-lg text-slate-600">
            Une vision 360° de votre exploitation. Prenez des décisions plus rapidement.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/projects/new">
            <Activity className="h-5 w-5" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* KPIs - 4 cartes avec impact visuel */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Link to="/projects" className="card-metric group block p-6 hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f5c3f] to-[#194c34] shadow-xl shadow-emerald-900/30 transition-transform group-hover:scale-110">
              <Activity className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-right">
              {loadingSummary ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <p className="text-4xl font-bold text-slate-900">{kpi.lotsActifs}</p>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Actifs / {kpi.lotsTotal}</p>
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-slate-700">Cycles de production</h3>
            <p className="mt-1 text-sm text-slate-500">Données live par ferme</p>
          </div>
        </Link>

        <Link to="/stock" className="card-metric group block p-6 hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#cdb78a] to-[#b89c67] shadow-xl shadow-amber-700/30 transition-transform group-hover:scale-110">
              <Package className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-right">
              {loadingSummary ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <p className="text-4xl font-bold text-slate-900">{kpi.stockAlerts}</p>
                  <p className="text-sm text-slate-500">alertes stock</p>
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-slate-700">Stock disponible</h3>
            <p className="mt-1 text-sm text-slate-500">Suivi alertes temps réel</p>
          </div>
        </Link>

        <div className="card-metric p-6 hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f5c3f] to-[#143a28] shadow-xl shadow-emerald-900/30 transition-transform hover:scale-110">
              <TrendingUp className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-right">
              {loadingSummary ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <p className="text-4xl font-bold text-slate-900">{kpi.mortalite7d}</p>
                  <p className="text-xs text-slate-500">mortalités 7j</p>
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-600">Taux survie</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-success-600">Suivi des pertes hebdo</p>
          </div>
        </div>

        <div className="card-metric p-6 hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f5c3f] to-[#194c34] shadow-xl shadow-emerald-900/30 transition-transform hover:scale-110">
              <DollarSign className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-success-600">+900</p>
              <p className="text-xs text-slate-500">€</p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-600">Bénéfice</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-success-600">
              <TrendingUp className="h-3 w-3" />
              +15% ce mois
            </p>
          </div>
        </div>
      </div>

      {/* Section principale : Graphique + Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Graphique finances - 2/3 largeur */}
        <div className="card-metric overflow-hidden lg:col-span-2">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Évolution financière
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Revenus vs Dépenses • 6 derniers mois
                </p>
              </div>
              <Button asChild variant="outline" className="px-5 text-sm">
                <Link to="/reports">
                  Rapport complet
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financeData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f5c3f" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1f5c3f" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#d1d5db"
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#d1d5db"
                  tickFormatter={(value) => `${value}€`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.97)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    padding: '12px',
                  }}
                  formatter={(value) => `${value}€`}
                />
                <Legend wrapperStyle={{ paddingTop: '16px' }} />
                <Line
                  type="monotone"
                  dataKey="revenu"
                  stroke="#1f5c3f"
                  strokeWidth={3}
                  name="Revenus"
                  dot={{ fill: '#1f5c3f', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, stroke: '#1f5c3f', strokeWidth: 3 }}
                  fill="url(#colorRevenue)"
                />
                <Line
                  type="monotone"
                  dataKey="depense"
                  stroke="#dc2626"
                  strokeWidth={3}
                  name="Dépenses"
                  dot={{ fill: '#dc2626', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, stroke: '#dc2626', strokeWidth: 3 }}
                  fill="url(#colorExpenses)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats rapides - 1/3 largeur */}
        <div className="space-y-6">
          <div className="card-metric p-6">
            <h3 className="text-base font-bold text-slate-900">Ce mois-ci</h3>
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Revenus</span>
                  <span className="text-xl font-bold text-success-600">2,400€</span>
                </div>
                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-success-500 to-success-600 shadow-sm" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Dépenses</span>
                  <span className="text-xl font-bold text-error-600">1,500€</span>
                </div>
                <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[50%] rounded-full bg-gradient-to-r from-error-500 to-error-600 shadow-sm" />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-900">Bénéfice</span>
                  <span className="text-3xl font-bold text-[#1f5c3f]">+900€</span>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-green-100 to-green-200/50 px-4 py-3 text-center shadow-sm">
                <p className="text-xs font-semibold text-green-700">
                  +15% vs mois dernier 📈
                </p>
              </div>
            </div>
          </div>

          <div className="card-premium overflow-hidden rounded-xl bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-600">Consommation</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Aliment</span>
                <span className="text-sm font-bold text-slate-900">620 kg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Médicaments</span>
                <span className="text-sm font-bold text-slate-900">120 L</span>
              </div>
              <Button asChild className="mt-2 w-full">
                <Link to="/stock">
                  Gérer le stock
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Projets actifs */}
      <div className="card-metric overflow-hidden">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Cycles de production actifs
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Journal quotidien de vos lots en cours
              </p>
            </div>
            <Button asChild variant="outline" className="px-5 text-sm">
              <Link to="/projects">
                Voir tous les cycles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block"
              >
                <div className="group flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white/90 p-5 shadow-sm transition-all hover:border-[#1f5c3f] hover:shadow-md">
                  <div className="flex items-center gap-4">
                    {/* Icône type */}
                    <div
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl shadow-lg transition-all group-hover:scale-110 ${
                        project.type === 'Volaille'
                          ? 'bg-gradient-to-br from-[#1f5c3f] to-[#194c34] shadow-emerald-900/25'
                          : 'bg-gradient-to-br from-[#cdb78a] to-[#b89c67] shadow-amber-800/25'
                      }`}
                    >
                      {project.type === 'Volaille' ? (
                        <Bird className="h-7 w-7 text-white" strokeWidth={2.5} />
                      ) : (
                        <PiggyBank className="h-7 w-7 text-white" strokeWidth={2.5} />
                      )}
                    </div>

                    {/* Info projet */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate font-semibold text-slate-900">
                          {project.name}
                        </h4>
                        <Badge className="bg-success-100 text-success-700 hover:bg-success-100">
                          {project.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(project.startDate).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                        <span>•</span>
                        <span>{project.age} jours</span>
                        <span>•</span>
                        <span className="font-mono">{project.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Métriques */}
                  <div className="hidden items-center gap-6 sm:flex">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {project.effectif}
                      </p>
                      <p className="text-xs text-slate-500">
                        /{project.initial}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          project.health >= 97
                            ? 'text-success-600'
                            : project.health >= 95
                            ? 'text-warning-600'
                            : 'text-error-600'
                        }`}
                      >
                        {project.health}%
                      </p>
                      <p className="text-xs text-slate-500">Santé</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
