import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bird,
  PiggyBank,
  Package,
  TrendingUp,
  AlertTriangle,
  Activity,
  Plus,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard } from '@/components/StatCard';
import { DashboardSkeleton } from '@/components/LoadingStates';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Link } from 'react-router-dom';

const COLORS = ['#2E7D32', '#6D4C41', '#03A9F4', '#FF9800'];

// Mock data - Replace with real API calls
const mortalityData = [
  { day: 'Lun', volailles: 2, porcs: 0 },
  { day: 'Mar', volailles: 1, porcs: 1 },
  { day: 'Mer', volailles: 3, porcs: 0 },
  { day: 'Jeu', volailles: 2, porcs: 0 },
  { day: 'Ven', volailles: 1, porcs: 0 },
  { day: 'Sam', volailles: 2, porcs: 1 },
  { day: 'Dim', volailles: 1, porcs: 0 },
];

const stockDistribution = [
  { name: 'Aliments', value: 450 },
  { name: 'Médicaments', value: 30 },
  { name: 'Vitamines', value: 80 },
  { name: 'Matériel', value: 120 },
];

const performanceData = [
  { batch: 'Lot-001', mortalite: 2.1, croissance: 1.8, ic: 1.65 },
  { batch: 'Lot-002', mortalite: 1.9, croissance: 2.1, ic: 1.58 },
  { batch: 'Lot-003', mortalite: 3.2, croissance: 1.5, ic: 1.82 },
  { batch: 'Lot-004', mortalite: 1.7, croissance: 2.3, ic: 1.52 },
];

export default function ModernDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-farm-brown mb-2">
          Tableau de Bord 📊
        </h1>
        <p className="text-farm-text-gray">
          Vue d'ensemble de votre exploitation agricole
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lots Volailles Actifs"
          value="12"
          subtitle="3 245 animaux"
          icon={Bird}
          trend={{ value: 8.2, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Lots Porcs Actifs"
          value="5"
          subtitle="180 animaux"
          icon={PiggyBank}
          trend={{ value: -2.4, isPositive: false }}
          variant="default"
        />
        <StatCard
          title="Articles en Stock"
          value="45"
          subtitle="3 alertes niveau bas"
          icon={Package}
          variant="warning"
        />
        <StatCard
          title="Mortalité Moyenne"
          value="2.1%"
          subtitle="Cette semaine"
          icon={TrendingUp}
          trend={{ value: -0.5, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Alerts Section */}
      <Card className="p-4 border-l-4 border-warning bg-warning/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-farm-brown mb-1">
              3 alertes nécessitent votre attention
            </h3>
            <ul className="space-y-1 text-sm text-farm-text-gray">
              <li>• Stock d'aliment poulet &lt; 100kg (reste: 85kg)</li>
              <li>• Mortalité anormale détectée sur Lot-003 (3.2%)</li>
              <li>• Rappel: Vaccination prévue demain pour Lot-005</li>
            </ul>
          </div>
          <Button size="sm" variant="outline">
            Voir tout
          </Button>
        </div>
      </Card>

      {/* Charts Section */}
      <Tabs defaultValue="mortality" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mortality">Mortalité</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="performance">Performances</TabsTrigger>
        </TabsList>

        <TabsContent value="mortality" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-farm-brown mb-4">
              Mortalité Quotidienne (7 derniers jours)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mortalityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                <XAxis dataKey="day" stroke="#616161" />
                <YAxis stroke="#616161" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #F5F5F5',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="volailles"
                  stroke="#2E7D32"
                  strokeWidth={3}
                  dot={{ fill: '#2E7D32', r: 5 }}
                  name="Volailles"
                />
                <Line
                  type="monotone"
                  dataKey="porcs"
                  stroke="#6D4C41"
                  strokeWidth={3}
                  dot={{ fill: '#6D4C41', r: 5 }}
                  name="Porcs"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-farm-brown mb-4">
                Répartition Stock
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stockDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stockDistribution.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-farm-brown mb-4">
                Alertes Stock
              </h3>
              <div className="space-y-3">
                {[
                  { item: 'Aliment Poulet Premium', current: 85, min: 100, status: 'critical' },
                  { item: 'Vitamines A+D3', current: 12, min: 10, status: 'warning' },
                  { item: 'Antibiotique', current: 5, min: 10, status: 'critical' },
                ].map((stock, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-farm-light-gray rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-farm-brown text-sm">{stock.item}</p>
                      <p className="text-xs text-farm-text-gray">
                        Stock: {stock.current}kg (Min: {stock.min}kg)
                      </p>
                    </div>
                    <Badge className={stock.status === 'critical' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'}>
                      {stock.status === 'critical' ? 'Critique' : 'Attention'}
                    </Badge>
                  </div>
                ))}
              </div>
              <Link to="/stock">
                <Button className="w-full mt-4 bg-farm-green hover:bg-farm-green/90">
                  Gérer le Stock
                </Button>
              </Link>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-farm-brown mb-4">
              Comparaison Performances Lots
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                <XAxis dataKey="batch" stroke="#616161" />
                <YAxis stroke="#616161" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #F5F5F5',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="mortalite" fill="#FF9800" name="Mortalité (%)" />
                <Bar dataKey="croissance" fill="#2E7D32" name="Croissance (kg)" />
                <Bar dataKey="ic" fill="#03A9F4" name="Indice Consommation" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-farm-brown mb-4">
          Actions Rapides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/batches/new">
            <Button className="w-full bg-farm-green hover:bg-farm-green/90 min-h-button justify-start">
              <Plus className="mr-2 h-5 w-5" />
              Nouveau Lot
            </Button>
          </Link>
          <Link to="/daily-log">
            <Button className="w-full bg-farm-blue hover:bg-farm-blue/90 min-h-button justify-start text-white">
              <Activity className="mr-2 h-5 w-5" />
              Suivi Journalier
            </Button>
          </Link>
          <Link to="/stock">
            <Button className="w-full bg-farm-brown hover:bg-farm-brown/90 min-h-button justify-start text-white">
              <Package className="mr-2 h-5 w-5" />
              Mouvement Stock
            </Button>
          </Link>
          <Link to="/kpi">
            <Button className="w-full bg-warning hover:bg-warning/90 min-h-button justify-start text-white">
              <TrendingUp className="mr-2 h-5 w-5" />
              Rapports KPI
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
