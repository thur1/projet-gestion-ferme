import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

export default function KPIPage() {
  // Mock performance data
  const batchPerformance = [
    {
      id: '1',
      batchNumber: 'LOT-2024-001',
      animalType: 'Poulet',
      age: 42,
      initialQty: 1000,
      currentQty: 980,
      mortalityRate: 2.0,
      avgWeight: 2.3,
      feedConversion: 1.8,
      status: 'active'
    },
    {
      id: '2',
      batchNumber: 'LOT-2024-002',
      animalType: 'Dinde',
      age: 56,
      initialQty: 500,
      currentQty: 485,
      mortalityRate: 3.0,
      avgWeight: 5.2,
      feedConversion: 2.1,
      status: 'active'
    },
    {
      id: '3',
      batchNumber: 'LOT-2023-045',
      animalType: 'Poulet',
      age: 49,
      initialQty: 1200,
      currentQty: 0,
      mortalityRate: 2.5,
      avgWeight: 2.5,
      feedConversion: 1.7,
      status: 'completed'
    },
  ];

  const getMortalityBadge = (rate: number) => {
    if (rate <= 2) return <Badge className="bg-green-500">Excellent</Badge>;
    if (rate <= 4) return <Badge className="bg-yellow-500">Normal</Badge>;
    return <Badge variant="destructive">Élevé</Badge>;
  };

  const getFeedConversionBadge = (fc: number) => {
    if (fc <= 1.8) return <Badge className="bg-green-500">Excellent</Badge>;
    if (fc <= 2.2) return <Badge className="bg-yellow-500">Normal</Badge>;
    return <Badge variant="destructive">À améliorer</Badge>;
  };

  return (
    <div className="min-h-screen space-y-8 pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-slate-600 hover:text-[#1f5c3f] transition-colors">
          Dashboard
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-900">Rapports KPI</span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          <span className="text-gradient-agri">Indicateurs de Performance</span>
        </h1>
        <p className="text-lg text-slate-600">
          Analyse des performances de vos lots
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Taux de Mortalité Moyen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">2.5%</div>
              <p className="text-xs text-green-600 mt-1">↓ 0.3% vs mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Indice de Conversion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">1.87</div>
              <p className="text-xs text-green-600 mt-1">↓ 0.12 vs mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Poids Moyen (kg)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">2.67</div>
              <p className="text-xs text-green-600 mt-1">↑ 0.15 vs mois dernier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Lots Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">12</div>
              <p className="text-xs text-gray-500 mt-1">2680 sujets total</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution de la Mortalité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <svg
                  className="h-12 w-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
                <p className="text-sm">Graphique à implémenter</p>
                <p className="text-xs mt-1">Utiliser Chart.js ou Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Performance par Lot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lot</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Âge (j)</TableHead>
                    <TableHead className="text-center">Effectif</TableHead>
                    <TableHead className="text-center">Mortalité %</TableHead>
                    <TableHead className="text-center">Poids Moy.</TableHead>
                    <TableHead className="text-center">IC</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchPerformance.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">
                        {batch.batchNumber}
                      </TableCell>
                      <TableCell>{batch.animalType}</TableCell>
                      <TableCell className="text-center">{batch.age}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col">
                          <span className="font-semibold">{batch.currentQty}</span>
                          <span className="text-xs text-gray-500">/ {batch.initialQty}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <span className="font-semibold">{batch.mortalityRate}%</span>
                          {getMortalityBadge(batch.mortalityRate)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {batch.avgWeight} kg
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <span className="font-semibold">{batch.feedConversion}</span>
                          {getFeedConversionBadge(batch.feedConversion)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={batch.status === 'active' ? 'default' : 'outline'}>
                          {batch.status === 'active' ? 'Actif' : 'Terminé'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* KPI Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">📊 Indice de Conversion (IC)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>
                L'IC mesure la quantité d'aliment nécessaire pour produire 1 kg de poids vif.
              </p>
              <div className="space-y-1 pl-4 border-l-2 border-blue-200">
                <p>• <strong>IC {"<"} 1.8</strong> : Excellent</p>
                <p>• <strong>IC 1.8-2.2</strong> : Normal</p>
                <p>• <strong>IC {">"} 2.2</strong> : À améliorer</p>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Un IC bas signifie une meilleure efficacité alimentaire et donc une meilleure rentabilité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">💀 Taux de Mortalité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>
                Pourcentage de perte par rapport à l'effectif initial.
              </p>
              <div className="space-y-1 pl-4 border-l-2 border-red-200">
                <p>• <strong>{"<"} 2%</strong> : Excellent</p>
                <p>• <strong>2-4%</strong> : Normal</p>
                <p>• <strong>{">"} 4%</strong> : Problème sanitaire</p>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Un taux élevé peut indiquer un problème de biosécurité, d'alimentation ou de conditions environnementales.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Export Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900">Exporter les Données</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Télécharger un rapport complet au format CSV ou PDF
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  📄 Export CSV
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  📊 Export PDF
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
