import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

export default function DailyLogPage() {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Mock data
  const batches = [
    { id: '1', name: 'Lot Poulets - Bâtiment A', day: 28, effectif: 1216 },
    { id: '2', name: 'Lot Poules Pondeuses - Bâtiment B', day: 52, effectif: 982 },
    { id: '3', name: 'Lot Porcs - Bâtiment C', day: 15, effectif: 43 },
  ];

  const currentBatch = batches.find(b => b.id === selectedBatch);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to save daily log
    console.log('Saving daily log...', { batch: selectedBatch, photo: photoFile });
  };

  return (
    <div className="min-h-screen bg-farm-light-gray">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-farm-brown flex items-center gap-2">
            📝 Suivi Journalier
          </h1>
          <p className="text-farm-text-gray mt-1">Enregistrez les données du jour en quelques clics</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulaire principal - 2 colonnes sur desktop */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sélection du lot */}
              <Card className="bg-white shadow-card p-6 rounded-lg">
                <h2 className="text-lg font-bold text-farm-brown mb-4">1. Sélectionner le lot</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="batch" className="text-farm-text-gray">Choisir un lot</Label>
                    <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                      <SelectTrigger 
                        id="batch" 
                        className="mt-2 min-h-input text-base border-2 border-farm-light-green/30 focus:border-farm-green"
                      >
                        <SelectValue placeholder="Sélectionner un lot..." />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id} className="text-base py-3">
                            {batch.name} (J{batch.day})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {currentBatch && (
                    <div className="bg-farm-light-gray p-4 rounded-lg">
                      <p className="text-sm text-farm-text-gray mb-2">Informations du lot</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-farm-brown">{currentBatch.name}</p>
                          <p className="text-sm text-farm-text-gray mt-1">Effectif actuel: {currentBatch.effectif} animaux</p>
                        </div>
                        <Badge className="bg-farm-light-green text-farm-green">
                          Jour {currentBatch.day}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Section Santé */}
              <Card className="bg-white shadow-card p-6 rounded-lg">
                <h2 className="text-lg font-bold text-farm-brown mb-4 flex items-center gap-2">
                  💊 2. Santé
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mortality" className="text-farm-text-gray font-medium">
                      Mortalité du jour
                    </Label>
                    <Input
                      id="mortality"
                      type="number"
                      min="0"
                      placeholder="Nombre d'animaux décédés"
                      className="mt-2 min-h-input text-base border-2 border-farm-light-green/30 focus:border-farm-green"
                    />
                    <p className="text-xs text-farm-text-gray mt-1">Entrez 0 si aucune mortalité</p>
                  </div>

                  <div>
                    <Label htmlFor="treatments" className="text-farm-text-gray font-medium">
                      Traitements / Médicaments
                    </Label>
                    <Textarea
                      id="treatments"
                      rows={3}
                      placeholder="Ex: Antibiotique administré, vaccination, vitamines..."
                      className="mt-2 text-base border-2 border-farm-light-green/30 focus:border-farm-green resize-none"
                    />
                  </div>
                </div>
              </Card>

              {/* Section Alimentation & Eau */}
              <Card className="bg-white shadow-card p-6 rounded-lg">
                <h2 className="text-lg font-bold text-farm-brown mb-4 flex items-center gap-2">
                  🌾 3. Alimentation & Eau
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="food" className="text-farm-text-gray font-medium">
                      Aliment distribué (kg)
                    </Label>
                    <Input
                      id="food"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="750.5"
                      className="mt-2 min-h-input text-base border-2 border-farm-light-green/30 focus:border-farm-green"
                    />
                  </div>

                  <div>
                    <Label htmlFor="water" className="text-farm-text-gray font-medium">
                      Eau consommée (L) <span className="text-farm-text-gray/50 font-normal">(optionnel)</span>
                    </Label>
                    <Input
                      id="water"
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="450.0"
                      className="mt-2 min-h-input text-base border-2 border-farm-light-green/30 focus:border-farm-green"
                    />
                  </div>
                </div>
              </Card>

              {/* Section Environnement */}
              <Card className="bg-white shadow-card p-6 rounded-lg">
                <h2 className="text-lg font-bold text-farm-brown mb-4 flex items-center gap-2">
                  🌡️ 4. Conditions Environnementales
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="temperature" className="text-farm-text-gray font-medium">
                      Température (°C) <span className="text-farm-text-gray/50 font-normal">(optionnel)</span>
                    </Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="25.5"
                      className="mt-2 min-h-input text-base border-2 border-farm-light-green/30 focus:border-farm-green"
                    />
                  </div>

                  <div>
                    <Label htmlFor="humidity" className="text-farm-text-gray font-medium">
                      Humidité (%) <span className="text-farm-text-gray/50 font-normal">(optionnel)</span>
                    </Label>
                    <Input
                      id="humidity"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="65"
                      className="mt-2 min-h-input text-base border-2 border-farm-light-green/30 focus:border-farm-green"
                    />
                  </div>
                </div>
              </Card>

              {/* Section Notes */}
              <Card className="bg-white shadow-card p-6 rounded-lg">
                <h2 className="text-lg font-bold text-farm-brown mb-4 flex items-center gap-2">
                  📋 5. Notes & Observations
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes" className="text-farm-text-gray font-medium">
                      Notes du vétérinaire ou observations générales
                    </Label>
                    <Textarea
                      id="notes"
                      rows={4}
                      placeholder="Comportement des animaux, état de la litière, problèmes observés..."
                      className="mt-2 text-base border-2 border-farm-light-green/30 focus:border-farm-green resize-none"
                    />
                  </div>

                  {/* Upload photo */}
                  <div>
                    <Label htmlFor="photo" className="text-farm-text-gray font-medium flex items-center gap-2">
                      📷 Ajouter une photo <span className="text-farm-text-gray/50 font-normal">(optionnel)</span>
                    </Label>
                    <div className="mt-2">
                      <label 
                        htmlFor="photo" 
                        className="flex items-center justify-center w-full min-h-button border-2 border-dashed border-farm-light-green/50 rounded-lg cursor-pointer hover:border-farm-green hover:bg-farm-light-gray/30 transition-all"
                      >
                        <div className="text-center p-6">
                          {photoFile ? (
                            <>
                              <p className="text-farm-green font-medium">✓ {photoFile.name}</p>
                              <p className="text-xs text-farm-text-gray mt-1">Cliquez pour changer</p>
                            </>
                          ) : (
                            <>
                              <p className="text-farm-text-gray font-medium">Cliquez pour ajouter une photo</p>
                              <p className="text-xs text-farm-text-gray mt-1">Facture, aliment, litière, animaux...</p>
                            </>
                          )}
                        </div>
                        <input
                          id="photo"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bouton d'enregistrement - Large et visible */}
              <div className="sticky bottom-4 z-10">
                <Button 
                  type="submit" 
                  className="w-full bg-farm-green hover:bg-farm-green/90 text-white text-lg font-bold shadow-floating min-h-button py-6 rounded-lg"
                  disabled={!selectedBatch}
                >
                  ✅ ENREGISTRER LE JOUR
                </Button>
                {!selectedBatch && (
                  <p className="text-center text-sm text-warning mt-2">Sélectionnez d'abord un lot</p>
                )}
              </div>
            </div>

            {/* Sidebar - Historique récent */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-card p-6 rounded-lg sticky top-20">
                <h3 className="text-lg font-bold text-farm-brown mb-4">📅 Historique Récent</h3>
                <div className="space-y-3">
                  {[
                    { date: 'Aujourd\'hui', batch: 'Lot Poulets', status: 'draft', icon: '⏳' },
                    { date: 'Hier', batch: 'Lot Poulets', status: 'ok', icon: '✅' },
                    { date: 'Hier', batch: 'Lot Porcs', status: 'ok', icon: '✅' },
                    { date: 'Avant-hier', batch: 'Lot Poulets', status: 'warning', icon: '⚠️' },
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-farm-light-gray rounded-lg hover:shadow-button transition-all cursor-pointer">
                      <span className="text-2xl">{log.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-farm-brown">{log.batch}</p>
                        <p className="text-xs text-farm-text-gray">{log.date}</p>
                      </div>
                      <Badge 
                        className={
                          log.status === 'ok' ? 'bg-farm-light-green text-farm-green' :
                          log.status === 'warning' ? 'bg-warning/20 text-warning' :
                          'bg-farm-blue/20 text-farm-blue'
                        }
                      >
                        {log.status === 'draft' ? 'Brouillon' : log.status === 'ok' ? 'OK' : 'Alerte'}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-farm-blue/10 rounded-lg border border-farm-blue/20">
                  <p className="text-sm font-medium text-farm-blue mb-1">💡 Conseil</p>
                  <p className="text-xs text-farm-text-gray">
                    Enregistrez vos données quotidiennes avant 10h pour un meilleur suivi.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
