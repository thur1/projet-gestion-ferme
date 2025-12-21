import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import Navigation from '@/components/Navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export default function CreateBatchPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmId: '',
    buildingId: '',
    batchNumber: '',
    animalType: '',
    arrivalDate: '',
    initialQuantity: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Appel API pour créer le lot
      console.log('Creating batch:', formData);
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Lot créé avec succès !');
      
      // Réinitialiser le formulaire
      setFormData({
        farmId: '',
        buildingId: '',
        batchNumber: '',
        animalType: '',
        arrivalDate: '',
        initialQuantity: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating batch:', error);
      alert('Erreur lors de la création du lot');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Nouveau Lot
          </h1>
          <p className="text-gray-600">
            Créer un nouveau lot d'animaux
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du Lot</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Farm Selection */}
              <div className="space-y-2">
                <Label htmlFor="farmId">Ferme *</Label>
                <Select
                  value={formData.farmId}
                  onValueChange={(value) => handleChange('farmId', value)}
                  required
                >
                  <SelectTrigger id="farmId">
                    <SelectValue placeholder="Sélectionner une ferme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farm-1">Ferme Avicole du Sud</SelectItem>
                    <SelectItem value="farm-2">Ferme Bio Provence</SelectItem>
                    <SelectItem value="farm-3">Élevage des Collines</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Building Selection */}
              <div className="space-y-2">
                <Label htmlFor="buildingId">Bâtiment *</Label>
                <Select
                  value={formData.buildingId}
                  onValueChange={(value) => handleChange('buildingId', value)}
                  required
                  disabled={!formData.farmId}
                >
                  <SelectTrigger id="buildingId">
                    <SelectValue placeholder="Sélectionner un bâtiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="building-1">Poulailler A</SelectItem>
                    <SelectItem value="building-2">Poulailler B</SelectItem>
                    <SelectItem value="building-3">Poulailler C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Batch Number */}
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Numéro de Lot *</Label>
                  <Input
                    id="batchNumber"
                    type="text"
                    placeholder="LOT-2024-001"
                    value={formData.batchNumber}
                    onChange={(e) => handleChange('batchNumber', e.target.value)}
                    required
                  />
                </div>

                {/* Animal Type */}
                <div className="space-y-2">
                  <Label htmlFor="animalType">Type d'Animal *</Label>
                  <Select
                    value={formData.animalType}
                    onValueChange={(value) => handleChange('animalType', value)}
                    required
                  >
                    <SelectTrigger id="animalType">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chicken">Poulet</SelectItem>
                      <SelectItem value="turkey">Dinde</SelectItem>
                      <SelectItem value="duck">Canard</SelectItem>
                      <SelectItem value="goose">Oie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Arrival Date */}
                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">Date d'Arrivée *</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) => handleChange('arrivalDate', e.target.value)}
                    required
                  />
                </div>

                {/* Initial Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="initialQuantity">Quantité Initiale *</Label>
                  <Input
                    id="initialQuantity"
                    type="number"
                    min="1"
                    placeholder="1000"
                    value={formData.initialQuantity}
                    onChange={(e) => handleChange('initialQuantity', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Informations supplémentaires sur le lot..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Création en cours...
                    </>
                  ) : (
                    'Créer le Lot'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.history.back()}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <svg
                className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900">
                  Conseils pour la création d'un lot
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Assurez-vous que le bâtiment est propre et désinfecté</li>
                  <li>Le numéro de lot doit être unique</li>
                  <li>Enregistrez le log quotidien dès le premier jour</li>
                  <li>Vérifiez les stocks d'aliment avant l'arrivée</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
