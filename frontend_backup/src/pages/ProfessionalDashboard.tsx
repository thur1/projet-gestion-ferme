/**
 * Professional Dashboard - Design moderne 2024
 * UI pure sans logique métier
 */

import { StatsCard } from '@/shared/components/professional/StatsCard';
import { QuickActions } from '@/shared/components/professional/QuickActions';
import { AlertBanner, type Alert } from '@/shared/components/professional/AlertBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Bird,
  PiggyBank,
  Package,
  TrendingUp,
  Activity,
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
import { Button } from '@/shared/components/ui/button';

// Mock data - À remplacer par vraies données API
const mortalityData = [
  { day: 'Lun', value: 2 },
  { day: 'Mar', value: 1 },
  { day: 'Mer', value: 3 },
  { day: 'Jeu', value: 2 },
  { day: 'Ven', value: 1 },
  { day: 'Sam', value: 2 },
  { day: 'Dim', value: 1 },
];

const stockData = [
  { name: 'Aliments', level: 85, threshold: 20 },
  { name: 'Médic.', level: 45, threshold: 30 },
  { name: 'Vitam.', level: 60, threshold: 25 },
  { name: 'Équip.', level: 30, threshold: 15 },
];

const recentBatches = [
  {
    id: 'LOT-2024-001',
    type: 'Poulets',
    count: 1500,
    initial: 1520,
    age: '12 jours',
    health: 98.7,
    status: 'Actif',
  },
  {
    id: 'LOT-2024-002',
    type: 'Porcs',
    count: 120,
    initial: 125,
    age: '45 jours',
    health: 96.0,
    status: 'Actif',
  },
  {
    id: 'LOT-2024-003',
    type: 'Poulets',
    count: 985,
    initial: 1000,
    age: '8 jours',
    health: 98.5,
    status: 'Actif',
  },
];

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Stock aliment P1 < 2 jours',
    message: 'Réapprovisionner avant jeudi 19/12',
    timestamp: new Date(),
    actionLabel: 'Commander',
    onAction: () => console.log('Commander'),
  },
  {
    id: '2',
    type: 'error',
    title: 'Mortalité élevée LOT-A12',
    message: 'Taux de 3.2% dépassé - Vérifier conditions sanitaires',
    timestamp: new Date(Date.now() - 3600000),
    actionLabel: 'Consulter',
    onAction: () => console.log('Consulter'),
  },
  {
    id: '3',
    type: 'info',
    title: 'Vaccination due LOT-P03',
    message: 'Rappel prévu pour demain 19/12',
    timestamp: new Date(Date.now() - 7200000),
  },
];

export default function ProfessionalDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span>{new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}</span>
          </div>
        </div>
        <p className="text-neutral-600">Vue d'ensemble de votre exploitation</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Lots volaille actifs"
          value="12"
          subtitle="3 245 animaux"
          icon={Bird}
          trend={{ value: 8.2, label: 'vs sem. dern.' }}
          variant="success"
        />
        <StatsCard
          title="Lots porcins actifs"
          value="5"
          subtitle="180 animaux"
          icon={PiggyBank}
          trend={{ value: -2.4 }}
          variant="info"
        />
        <StatsCard
          title="Stock - Alertes"
          value="3"
          subtitle="Articles < seuil"
          icon={Package}
          variant="warning"
        />
        <StatsCard
          title="Taux de croissance"
          value="94.2%"
          subtitle="Moyenne semaine"
          icon={TrendingUp}
          trend={{ value: 3.1 }}
          variant="default"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mortality Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Mortalité - 7 derniers jours
                </CardTitle>
                <p className="mt-1 text-sm text-neutral-500">
                  Tendance hebdomadaire tous lots
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                <Activity className="mr-1 h-3 w-3" />
                Temps réel
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mortalityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'var(--neutral-600)', fontSize: 12 }}
                  stroke="var(--neutral-300)"
                />
                <YAxis
                  tick={{ fill: 'var(--neutral-600)', fontSize: 12 }}
                  stroke="var(--neutral-300)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--neutral-0)',
                    border: '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary-500)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--primary-500)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Levels */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Niveaux de stock
                </CardTitle>
                <p className="mt-1 text-sm text-neutral-500">
                  Par catégorie de produits
                </p>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Détails
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--neutral-600)', fontSize: 12 }}
                  stroke="var(--neutral-300)"
                />
                <YAxis
                  tick={{ fill: 'var(--neutral-600)', fontSize: 12 }}
                  stroke="var(--neutral-300)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--neutral-0)',
                    border: '1px solid var(--neutral-200)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="level" fill="var(--primary-500)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="threshold" fill="var(--warning-500)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Bottom Grid - Recent Activity + Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Batches */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg font-semibold">Lots récents</CardTitle>
              <p className="mt-1 text-sm text-neutral-500">Activité en cours</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1">
              Voir tout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBatches.map((batch) => (
              <div
                key={batch.id}
                className="group flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-all hover:border-primary-300 hover:bg-primary-50/30"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    {batch.type === 'Poulets' ? (
                      <Bird className="h-6 w-6 text-primary-600" />
                    ) : (
                      <PiggyBank className="h-6 w-6 text-primary-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{batch.id}</p>
                    <p className="text-sm text-neutral-500">
                      {batch.count}/{batch.initial} {batch.type} • {batch.age}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-success-600">
                      {batch.health}%
                    </p>
                    <p className="text-xs text-neutral-500">Santé</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-success-100 text-success-700"
                  >
                    {batch.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <AlertBanner alerts={mockAlerts} maxVisible={3} />
      </div>
    </div>
  );
}
