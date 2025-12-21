import Navigation from '@/components/Navigation';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - will be replaced with real API calls
  const stats = {
    poultry: { lots: 3, animals: 1250, icon: '🐔' },
    pigs: { lots: 2, animals: 45, icon: '🐷' },
    stock: { items: 12, lowStock: 3, icon: '📦' },
    kpi: { avgMortality: 2.3, performance: 'Bon', icon: '📊' },
  };

  const activeBatches = [
    {
      id: 1,
      name: 'Lot Poulets',
      building: 'Bâtiment A',
      day: 28,
      totalDays: 45,
      mortality: 34,
      foodConsumed: 750,
      avgWeight: 1.2,
      status: 'active',
    },
    {
      id: 2,
      name: 'Lot Poules Pondeuses',
      building: 'Bâtiment B',
      day: 52,
      totalDays: 120,
      mortality: 18,
      foodConsumed: 520,
      avgWeight: 1.8,
      status: 'active',
    },
    {
      id: 3,
      name: 'Lot Porcs',
      building: 'Bâtiment C',
      day: 15,
      totalDays: 60,
      mortality: 2,
      foodConsumed: 180,
      avgWeight: 25,
      status: 'warning',
    },
  ];

  return (
    <div className="min-h-screen bg-farm-light-gray">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header avec salutation */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-farm-brown flex items-center gap-2">
            Bonjour, {user?.email?.split('@')[0] || 'Fermier'} 🐓
          </h1>
          <p className="text-farm-text-gray mt-1">Votre Ferme - Vue d'ensemble</p>
        </div>

        {/* Grille 4 blocs principaux */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Volailles */}
          <Card className="bg-white shadow-card hover:shadow-card-hover transition-all p-6 rounded-lg cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">{stats.poultry.icon}</span>
              <Badge className="bg-farm-light-green text-farm-green">Actif</Badge>
            </div>
            <h3 className="text-lg font-semibold text-farm-brown">Volailles</h3>
            <p className="text-3xl font-bold text-farm-green mt-2">{stats.poultry.lots}</p>
            <p className="text-sm text-farm-text-gray">lots en cours</p>
            <p className="text-xs text-farm-text-gray mt-1">{stats.poultry.animals} animaux</p>
          </Card>

          {/* Porcs */}
          <Card className="bg-white shadow-card hover:shadow-card-hover transition-all p-6 rounded-lg cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">{stats.pigs.icon}</span>
              <Badge className="bg-farm-light-green text-farm-green">Actif</Badge>
            </div>
            <h3 className="text-lg font-semibold text-farm-brown">Porcs</h3>
            <p className="text-3xl font-bold text-farm-green mt-2">{stats.pigs.lots}</p>
            <p className="text-sm text-farm-text-gray">lots en cours</p>
            <p className="text-xs text-farm-text-gray mt-1">{stats.pigs.animals} animaux</p>
          </Card>

          {/* Stocks */}
          <Card className="bg-white shadow-card hover:shadow-card-hover transition-all p-6 rounded-lg cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">{stats.stock.icon}</span>
              <Badge className="bg-warning/20 text-warning">Alerte</Badge>
            </div>
            <h3 className="text-lg font-semibold text-farm-brown">Stocks</h3>
            <p className="text-3xl font-bold text-farm-green mt-2">{stats.stock.items}</p>
            <p className="text-sm text-farm-text-gray">articles</p>
            <p className="text-xs text-warning mt-1">{stats.stock.lowStock} stock faible</p>
          </Card>

          {/* Indicateurs */}
          <Card className="bg-white shadow-card hover:shadow-card-hover transition-all p-6 rounded-lg cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl">{stats.kpi.icon}</span>
              <Badge className="bg-success/20 text-success">{stats.kpi.performance}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-farm-brown">Performance</h3>
            <p className="text-3xl font-bold text-farm-green mt-2">{stats.kpi.avgMortality}%</p>
            <p className="text-sm text-farm-text-gray">mortalité moy.</p>
            <Link to="/kpi">
              <p className="text-xs text-farm-blue mt-1 hover:underline">Voir détails →</p>
            </Link>
          </Card>
        </div>

        {/* Section "Mes lots en cours" */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-farm-brown">📋 Mes lots en cours</h2>
            <Link to="/batches/new">
              <Button className="bg-farm-green hover:bg-farm-green/90 text-white shadow-button min-h-touch">
                + Nouveau Lot
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeBatches.map((batch) => (
              <Card key={batch.id} className="bg-white shadow-card hover:shadow-card-hover transition-all p-6 rounded-lg">
                {/* Header carte lot */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-farm-brown">{batch.name}</h3>
                    <p className="text-sm text-farm-text-gray">{batch.building}</p>
                  </div>
                  <Badge 
                    className={batch.status === 'active' 
                      ? 'bg-farm-light-green text-farm-green' 
                      : 'bg-warning/20 text-warning'}
                  >
                    {batch.status === 'active' ? 'Actif' : 'Attention'}
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-farm-text-gray">Progression</span>
                    <span className="font-semibold text-farm-green">J{batch.day} / {batch.totalDays} jours</span>
                  </div>
                  <div className="w-full bg-farm-light-gray rounded-full h-2">
                    <div 
                      className="bg-farm-green h-2 rounded-full transition-all"
                      style={{ width: `${(batch.day / batch.totalDays) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Indicateurs clés */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-farm-light-gray rounded-lg">
                    <p className="text-xs text-farm-text-gray mb-1">Mortalité</p>
                    <p className="text-lg font-bold text-farm-brown">{batch.mortality}</p>
                  </div>
                  <div className="text-center p-3 bg-farm-light-gray rounded-lg">
                    <p className="text-xs text-farm-text-gray mb-1">Aliments (kg)</p>
                    <p className="text-lg font-bold text-farm-brown">{batch.foodConsumed}</p>
                  </div>
                  <div className="text-center p-3 bg-farm-light-gray rounded-lg">
                    <p className="text-xs text-farm-text-gray mb-1">Poids moy.</p>
                    <p className="text-lg font-bold text-farm-brown">{batch.avgWeight} kg</p>
                  </div>
                </div>

                {/* Bouton action */}
                <Link to="/daily-log">
                  <Button className="w-full bg-farm-green hover:bg-farm-green/90 text-white shadow-button min-h-button">
                    📝 Suivi du jour
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
