import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
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
import { ArrowLeft, Check } from 'lucide-react';
import { coreApi } from '@/services/core';
import { Skeleton } from '@/shared/components/ui/skeleton';

 type FarmOption = { id: string; name: string };
type UnitOption = { id: string; name: string; farm: string; species: string };
type SpeciesOption = { id: string; code: string; name: string };

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<FarmOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [species, setSpecies] = useState<SpeciesOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    farm: '',
    unit: '',
    species: '',
    code: '',
    entry_date: new Date().toISOString().split('T')[0],
    initial_count: '',
    destination: '',
    notes: '',
  });

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
        setFormData((prev) => ({
          ...prev,
          farm: prev.farm || (farmOptions[0]?.id ?? ''),
          species: prev.species || (speciesOptions[0]?.id ?? ''),
        }));
      } catch (err) {
        console.error(err);
        if (mounted) setError('Impossible de charger les données nécessaires');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedSpeciesCode = useMemo(() => {
    return species.find((s) => s.id === formData.species)?.code ?? '';
  }, [formData.species, species]);

  useEffect(() => {
    if (!formData.farm) {
      setUnits([]);
      return;
    }
    let mounted = true;
    async function loadUnits() {
      try {
        setLoadingUnits(true);
        const data = await coreApi.units.list({
          farm_id: formData.farm,
          species: selectedSpeciesCode || undefined,
        });
        if (!mounted) return;
        const unitOptions = (data as any[]).map((u) => ({
          id: String((u as any).id),
          name: String((u as any).name ?? ''),
          farm: String((u as any).farm ?? ''),
          species: String((u as any).species ?? ''),
        }));
        setUnits(unitOptions);
        setFormData((prev) => ({
          ...prev,
          unit: prev.unit && unitOptions.find((u) => u.id === prev.unit) ? prev.unit : unitOptions[0]?.id ?? '',
        }));
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoadingUnits(false);
      }
    }
    loadUnits();
    return () => {
      mounted = false;
    };
  }, [formData.farm, selectedSpeciesCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.farm || !formData.unit || !formData.species) {
      setError('Sélectionnez une ferme, une unité et une espèce');
      return;
    }
    if (!formData.code.trim() || !formData.entry_date || !formData.initial_count) {
      setError('Remplissez les champs obligatoires');
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        unit: formData.unit,
        species: formData.species,
        code: formData.code.trim(),
        entry_date: formData.entry_date,
        initial_count: Number(formData.initial_count),
        status: 'active' as const,
        destination: formData.destination || undefined,
      };
      const created = await coreApi.lots.create(payload);
      const newId = (created as any)?.id;
      navigate(newId ? `/projects/${newId}` : '/projects');
    } catch (err) {
      console.error(err);
      setError('Impossible de créer le projet');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-12">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl min-h-screen space-y-8 pb-12">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-slate-600 hover:text-[#1f5c3f] transition-colors">
          Dashboard
        </Link>
        <span className="text-slate-400">/</span>
        <Link to="/projects" className="text-slate-600 hover:text-[#1f5c3f] transition-colors">
          Projets
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-900">Nouveau projet</span>
      </div>

      <Button asChild variant="outline" size="sm" className="px-4">
        <Link to="/projects">
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Link>
      </Button>

      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">
          <span className="text-gradient-agri">Nouveau projet</span>
        </h1>
        <p className="text-lg text-slate-600">Créez un nouveau projet avicole ou porcin</p>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-red-700 bg-red-50 border border-red-100">
            {error}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations du projet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ferme</Label>
                <Select value={formData.farm} onValueChange={(v) => setFormData((p) => ({ ...p, farm: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une ferme" />
                  </SelectTrigger>
                  <SelectContent>
                    {farms.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id}>
                        {farm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Espèce</Label>
                <Select
                  value={formData.species}
                  onValueChange={(v) => setFormData((p) => ({ ...p, species: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Espèce" />
                  </SelectTrigger>
                  <SelectContent>
                    {species.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name || s.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Unité</Label>
              <Select
                value={formData.unit}
                onValueChange={(v) => setFormData((p) => ({ ...p, unit: v }))}
                disabled={loadingUnits}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingUnits ? 'Chargement...' : 'Sélectionner une unité'} />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="code">Code du projet</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                  placeholder="LOT-2025-01"
                  required
                />
              </div>
              <div>
                <Label htmlFor="entry_date">Date d'entrée</Label>
                <Input
                  id="entry_date"
                  type="date"
                  value={formData.entry_date}
                  onChange={(e) => setFormData((p) => ({ ...p, entry_date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="initial_count">Effectif initial</Label>
                <Input
                  id="initial_count"
                  type="number"
                  min={1}
                  value={formData.initial_count}
                  onChange={(e) => setFormData((p) => ({ ...p, initial_count: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination (optionnel)</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData((p) => ({ ...p, destination: e.target.value }))}
                  placeholder="Vente, reproduction..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button type="submit" disabled={submitting} className="gap-2">
                <Check className="h-4 w-4" />
                {submitting ? 'Création...' : 'Créer le projet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
