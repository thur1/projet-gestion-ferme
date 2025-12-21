/**
 * Exemple d'utilisation de React Query
 * Affichage des fermes avec données réelles de l'API
 */

import { useFarms, useCreateFarm } from '@/hooks/useFarms';
import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';

export function FarmsExample() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    size: '',
    type: 'aviculture' as const,
  });

  // ✅ Hook React Query - Cache automatique
  const { data: farms, isLoading, error, refetch } = useFarms();
  
  // ✅ Mutation pour créer une ferme
  const createFarmMutation = useCreateFarm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createFarmMutation.mutateAsync({
      name: formData.name,
      location: formData.location,
      size: formData.size ? parseFloat(formData.size) : undefined,
      type: formData.type,
    });

    // Reset form
    setFormData({ name: '', location: '', size: '', type: 'aviculture' });
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#2e8b57]" />
        <span className="ml-3 text-slate-600">Chargement des fermes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
        <h3 className="text-lg font-bold text-red-900">Erreur</h3>
        <p className="mt-2 text-sm text-red-700">
          {error instanceof Error ? error.message : 'Impossible de charger les fermes'}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton d'ajout */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Mes Fermes</h2>
          <p className="mt-1 text-sm text-slate-600">
            {farms?.length || 0} ferme(s) enregistrée(s)
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-[#2e8b57] px-4 py-2 text-sm font-medium text-white hover:bg-[#256f46] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle ferme
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-slate-900">Créer une ferme</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nom de la ferme *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 w-full rounded-lg border-2 border-slate-200 px-4 py-2 focus:border-[#2e8b57] focus:outline-none"
                placeholder="Ferme de la Vallée"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Localisation
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 w-full rounded-lg border-2 border-slate-200 px-4 py-2 focus:border-[#2e8b57] focus:outline-none"
                placeholder="Bretagne, France"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Superficie (hectares)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="mt-1 w-full rounded-lg border-2 border-slate-200 px-4 py-2 focus:border-[#2e8b57] focus:outline-none"
                placeholder="25.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Type d'exploitation
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="mt-1 w-full rounded-lg border-2 border-slate-200 px-4 py-2 focus:border-[#2e8b57] focus:outline-none"
              >
                <option value="aviculture">Aviculture</option>
                <option value="porcin">Porcin</option>
                <option value="mixte">Mixte</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createFarmMutation.isPending}
                className="flex-1 rounded-lg bg-[#2e8b57] px-4 py-2 text-sm font-medium text-white hover:bg-[#256f46] disabled:opacity-50 transition-colors"
              >
                {createFarmMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Création...
                  </span>
                ) : (
                  'Créer'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border-2 border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Liste des fermes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {farms?.map((farm) => (
          <div
            key={farm.id}
            className="group rounded-xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#2e8b57] hover:shadow-md"
          >
            <h3 className="text-lg font-bold text-slate-900">{farm.name}</h3>
            
            {farm.location && (
              <p className="mt-2 text-sm text-slate-600">📍 {farm.location}</p>
            )}
            
            {farm.size && (
              <p className="mt-1 text-sm text-slate-600">🌾 {farm.size} hectares</p>
            )}
            
            {farm.type && (
              <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {farm.type}
              </span>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-xs text-slate-500">
                Créée le {new Date(farm.created_at).toLocaleDateString('fr-FR')}
              </span>
              <button
                className="text-red-600 opacity-0 transition-opacity hover:text-red-700 group-hover:opacity-100"
                title="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {farms?.length === 0 && (
          <div className="col-span-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-slate-600">
              Aucune ferme enregistrée. Créez votre première ferme pour commencer !
            </p>
          </div>
        )}
      </div>

      {/* Indicateur React Query Devtools */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>React Query actif</strong> - Les données sont mises en cache automatiquement. 
          Ouvrez React Query Devtools (icône en bas à droite) pour voir le cache en temps réel.
        </p>
      </div>
    </div>
  );
}
