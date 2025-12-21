/**
 * Dashboard UI Moderne - Type Stripe/Vercel
 * Pure UI, pas de logique métier
 */

import { MetricCard } from '@/shared/components/modern/MetricCard';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Bird,
  PiggyBank,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock data pour démonstration visuelle
const mockMortalityData = [
  { day: 'Lun', value: 2 },
  { day: 'Mar', value: 1 },
  { day: 'Mer', value: 3 },
  { day: 'Jeu', value: 2 },
  { day: 'Ven', value: 1 },
  { day: 'Sam', value: 2 },
  { day: 'Dim', value: 1 },
];

const mockStockData = [
  { name: 'Aliments', value: 85 },
  { name: 'Médicaments', value: 45 },
  { name: 'Vitamines', value: 60 },
  { name: 'Équipement', value: 30 },
];

const recentBatches = [
  { id: 'LOT-2024-001', type: 'Poulets', count: 500, age: '12 jours', status: 'Actif' },
  { id: 'LOT-2024-002', type: 'Porcs', count: 30, age: '45 jours', status: 'Actif' },
  { id: 'LOT-2024-003', type: 'Poulets', count: 450, age: '8 jours', status: 'Actif' },
];

export default function ModernDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Vue d'ensemble de votre exploitation
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau lot
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Lots volaille actifs"
          value="12"
          description="3 245 animaux"
          icon={Bird}
          trend={{ value: 8.2, isPositive: true }}
          variant="success"
        />
        <MetricCard
          title="Lots porcins actifs"
          value="5"
          description="180 animaux"
          icon={PiggyBank}
          trend={{ value: -2.4, isPositive: false }}
          variant="default"
        />
        <MetricCard
          title="Articles en stock"
          value="45"
          description="3 alertes niveau bas"
          icon={Package}
          variant="warning"
        />
        <MetricCard
          title="Taux de croissance"
          value="94.2%"
          description="Semaine en cours"
          icon={TrendingUp}
          trend={{ value: 3.1, isPositive: true }}
          variant="default"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mortality Chart */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Mortalité - 7 derniers jours
            </h3>
            <p className="text-sm text-slate-500">Tendance hebdomadaire</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockMortalityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Stock Chart */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Niveaux de stock
            </h3>
            <p className="text-sm text-slate-500">Par catégorie</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockStockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Batches & Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent batches */}
        <Card className="lg:col-span-2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Lots récents
              </h3>
              <p className="text-sm text-slate-500">Activité en cours</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentBatches.map((batch) => (
              <div
                key={batch.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    {batch.type === 'Poulets' ? (
                      <Bird className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <PiggyBank className="h-5 w-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{batch.id}</p>
                    <p className="text-sm text-slate-500">
                      {batch.count} {batch.type} • {batch.age}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                  {batch.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts */}
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Alertes</h3>
            <p className="text-sm text-slate-500">Nécessite attention</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Stock aliments bas
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    Réapprovisionner sous 48h
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Mortalité élevée LOT-003
                  </p>
                  <p className="mt-1 text-xs text-red-700">
                    Vérifier conditions
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex gap-3">
                <TrendingUp className="h-5 w-5 flex-shrink-0 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Performance excellente
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    LOT-001 dépasse objectifs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
