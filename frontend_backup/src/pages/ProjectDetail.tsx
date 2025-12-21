import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ArrowLeft, Calendar, TrendingUp, Activity, AlertTriangle, Settings, Bird } from "lucide-react";
import { StatsCard } from "@/shared/components/professional";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { coreApi } from "@/services/core";
import { Skeleton } from "@/shared/components/ui/skeleton";

type Lot = {
  id: string;
  unit: string;
  species: string;
  code: string;
  entry_date: string;
  initial_count: number;
  status: "active" | "closed";
  destination?: string;
};

type LotRecord = {
  id: string;
  lot: string;
  date: string;
  mortality: number;
  feed_intake_kg?: string;
  milk_production_l?: string;
  eggs_count?: number;
  avg_weight_kg?: string;
  notes?: string;
};

type UnitOption = { id: string; name: string; farm: string; species: string };
type SpeciesOption = { id: string; code: string; name: string };

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("suivi");
  const [lot, setLot] = useState<Lot | null>(null);
  const [records, setRecords] = useState<LotRecord[]>([]);
  const [species, setSpecies] = useState<SpeciesOption[]>([]);
  const [units, setUnits] = useState<UnitOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [dailyForm, setDailyForm] = useState({
    date: new Date().toISOString().split("T")[0],
    mortality: "",
    feed: "",
    eggs: "",
    weight: "",
    notes: "",
  });

  useEffect(() => {
    if (!id) return;
    const lotId = id!;
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [lotRes, recordsRes, speciesRes, unitsRes] = await Promise.all([
          coreApi.lots.get(lotId),
          coreApi.lotRecords.list({ lot_id: lotId }),
          coreApi.species.list(),
          coreApi.units.list(),
        ]);
        if (!mounted) return;
        setLot(lotRes as Lot);
        setRecords(recordsRes as LotRecord[]);
        setSpecies((speciesRes as any[]).map((s) => ({
          id: String((s as any).id),
          code: String((s as any).code ?? ""),
          name: String((s as any).name ?? ""),
        })));
        setUnits((unitsRes as any[]).map((u) => ({
          id: String((u as any).id),
          name: String((u as any).name ?? ""),
          farm: String((u as any).farm ?? ""),
          species: String((u as any).species ?? ""),
        })));
      } catch (err) {
        console.error(err);
        if (mounted) setError("Impossible de charger le projet");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const speciesMap = useMemo(() => {
    return species.reduce<Record<string, SpeciesOption>>((acc, s) => {
      acc[s.id] = s;
      return acc;
    }, {});
  }, [species]);

  const unitMap = useMemo(() => {
    return units.reduce<Record<string, UnitOption>>((acc, u) => {
      acc[u.id] = u;
      return acc;
    }, {});
  }, [units]);

  const chartData = useMemo(() => {
    return [...records]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((r) => ({
        date: r.date,
        mortality: r.mortality,
        feed: Number(r.feed_intake_kg ?? 0),
        weight: Number(r.avg_weight_kg ?? 0),
      }));
  }, [records]);

  const ageDays = useMemo(() => {
    if (!lot) return 0;
    const diff = Date.now() - new Date(lot.entry_date).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [lot]);

  const statusLabel = (status: Lot["status"]) => (status === "active" ? "Actif" : "Clôturé");

  const handleDailySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError(null);
    try {
      setSaving(true);
      const payload = {
        lot: id,
        date: dailyForm.date,
        mortality: Number(dailyForm.mortality || 0),
        feed_intake_kg: dailyForm.feed || undefined,
        eggs_count: dailyForm.eggs ? Number(dailyForm.eggs) : undefined,
        avg_weight_kg: dailyForm.weight || undefined,
        notes: dailyForm.notes || undefined,
      };
      const created = await coreApi.lotRecords.create(payload);
      setRecords((prev) => [created as LotRecord, ...prev]);
      setDailyForm({
        date: new Date().toISOString().split("T")[0],
        mortality: "",
        feed: "",
        eggs: "",
        weight: "",
        notes: "",
      });
      setSuccessMessage("Saisie quotidienne enregistrée");
    } catch (err) {
      console.error(err);
      setError("Impossible d'enregistrer la saisie");
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return null;
  }

  const speciesLabel = lot ? speciesMap[lot.species]?.name || speciesMap[lot.species]?.code || "Espèce" : "";
  const unitName = lot ? unitMap[lot.unit]?.name || "Unité inconnue" : "";

  return (
    <div className="min-h-screen space-y-8 pb-12">
      <div className="flex items-center gap-2 text-sm">
        <Link to="/dashboard" className="text-slate-600 hover:text-[#1f5c3f] transition-colors">
          Dashboard
        </Link>
        <span className="text-slate-400">/</span>
        <Link to="/projects" className="text-slate-600 hover:text-[#1f5c3f] transition-colors">
          Projets
        </Link>
        <span className="text-slate-400">/</span>
        <span className="font-semibold text-slate-900">{lot?.code ?? "Projet"}</span>
      </div>

      <Button asChild variant="outline" size="sm" className="px-4">
        <Link to="/projects">
          <ArrowLeft className="h-4 w-4" />
          Retour aux projets
        </Link>
      </Button>

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-red-700 bg-red-50 border border-red-100">
            {error}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx}>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f5c3f] to-[#194c34] shadow-xl shadow-emerald-900/30">
                  <Bird className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-900">
                      {lot?.code}
                    </h1>
                    {lot && (
                      <Badge className={lot.status === "active" ? "badge-success" : "badge-secondary"}>
                        {statusLabel(lot.status)}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-slate-600">
                    {speciesLabel} - {unitName}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Effectif initial"
              value={lot?.initial_count?.toString() ?? "0"}
              subtitle="Animaux"
              icon={Activity}
              variant="default"
            />
            <StatsCard
              title="Âge du lot"
              value={`${ageDays}j`}
              subtitle="depuis le démarrage"
              icon={Calendar}
              variant="info"
            />
            <StatsCard
              title="Mortalité récente"
              value={`${records[0]?.mortality ?? 0}`}
              subtitle="Dernière saisie"
              icon={AlertTriangle}
              variant="warning"
            />
            <StatsCard
              title="Aliment (kg)"
              value={records[0]?.feed_intake_kg ? String(records[0].feed_intake_kg) : "0"}
              subtitle="Dernière saisie"
              icon={TrendingUp}
              variant="success"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="suivi">Suivi</TabsTrigger>
              <TabsTrigger value="saisie">Saisie</TabsTrigger>
              <TabsTrigger value="sante" disabled>
                Santé
              </TabsTrigger>
              <TabsTrigger value="rapports" disabled>
                Rapports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suivi" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du lot</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length === 0 ? (
                    <p className="text-sm text-neutral-600">Aucune saisie pour le moment.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" label={{ value: "Date", position: "insideBottom", offset: -5 }} />
                        <YAxis yAxisId="left" label={{ value: "Mortalité", angle: -90, position: "insideLeft" }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: "Aliment (kg)", angle: 90, position: "insideRight" }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="mortality" stroke="#1f5c3f" name="Mortalité" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="feed" stroke="#ff9800" name="Aliment" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Historique des saisies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {records.length === 0 ? (
                      <p className="text-sm text-neutral-600">Aucune saisie enregistrée.</p>
                    ) : (
                      records.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between border-b border-neutral-200 pb-3 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-neutral-900">{new Date(log.date).toLocaleDateString("fr-FR")}</p>
                            <p className="text-sm text-neutral-500">
                              Mortalité: {log.mortality}
                            </p>
                          </div>
                          <div className="text-right text-sm text-neutral-600">
                            <p>Aliment: <strong>{log.feed_intake_kg ?? 0} kg</strong></p>
                            {log.avg_weight_kg && <p>Poids: <strong>{log.avg_weight_kg} kg</strong></p>}
                            {log.eggs_count !== undefined && <p>Oeufs: <strong>{log.eggs_count}</strong></p>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saisie">
              <Card>
                <CardHeader>
                  <CardTitle>Saisie quotidienne</CardTitle>
                </CardHeader>
                <CardContent>
                  {successMessage && (
                    <p className="mb-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-md px-3 py-2">
                      {successMessage}
                    </p>
                  )}
                  <form onSubmit={handleDailySubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={dailyForm.date}
                          onChange={(e) => setDailyForm({ ...dailyForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mortality">Mortalité</Label>
                        <Input
                          id="mortality"
                          type="number"
                          min="0"
                          value={dailyForm.mortality}
                          onChange={(e) => setDailyForm({ ...dailyForm, mortality: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <Label htmlFor="feed">Aliment distribué (kg)</Label>
                        <Input
                          id="feed"
                          type="number"
                          step="0.01"
                          min="0"
                          value={dailyForm.feed}
                          onChange={(e) => setDailyForm({ ...dailyForm, feed: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="eggs">Oeufs (si applicable)</Label>
                        <Input
                          id="eggs"
                          type="number"
                          min="0"
                          value={dailyForm.eggs}
                          onChange={(e) => setDailyForm({ ...dailyForm, eggs: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Poids moyen (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          min="0"
                          value={dailyForm.weight}
                          onChange={(e) => setDailyForm({ ...dailyForm, weight: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Observations</Label>
                      <Textarea
                        id="notes"
                        rows={3}
                        value={dailyForm.notes}
                        onChange={(e) => setDailyForm({ ...dailyForm, notes: e.target.value })}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                      <Button type="submit" disabled={saving}>
                        {saving ? "Enregistrement..." : "Enregistrer la saisie"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      <div className="h-4" />
    </div>
  );
}
