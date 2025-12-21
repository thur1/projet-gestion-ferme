import { Link } from 'react-router-dom';
import { ArrowRight, Package, Activity, ClipboardPlus, BarChart3 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

const quickLinks = [
  {
    title: 'Nouveau projet',
    description: 'Créez un cycle avicole ou porcin en quelques clics.',
    to: '/projects/new',
    icon: ClipboardPlus,
  },
  {
    title: 'Gérer stock',
    description: 'Suivez les entrées/sorties et vos alertes critiques.',
    to: '/stock',
    icon: Package,
  },
  {
    title: 'Saisie quotidienne',
    description: 'Enregistrez vos données journalières sans friction.',
    to: '/projects',
    icon: Activity,
  },
  {
    title: 'Rapports',
    description: 'Analysez les performances et exportez en un clic.',
    to: '/reports',
    icon: BarChart3,
  },
];

export default function HomeLanding() {
  return (
    <div className="min-h-screen space-y-10 pb-16">
      <section className="rounded-3xl bg-white/80 p-8 shadow-xl ring-1 ring-slate-200/70">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1 text-sm font-semibold text-primary-700 shadow-sm">
              AgriTrack Pro • Gestion globale des élevages
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                Pilotez vos élevages avec une expérience sobre et premium.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600">
                Vision 360° pour la volaille, le porcin et le stock. Décisions rapides, données fiables,
                et une interface élégante pensée pour le terrain comme pour le bureau.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="btn-premium">
                <Link to="/projects/new">
                  Lancer un projet
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/demo">Voir la démo</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>• Offline & PWA</span>
              <span>• Sync auto toutes 30s</span>
              <span>• Auth JWT sécurisée</span>
              <span>• KPIs en temps réel</span>
            </div>
          </div>
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-secondary-50 to-white p-6 shadow-lg">
            <p className="text-sm font-semibold text-slate-600">Accès rapide</p>
            <div className="mt-4 grid gap-3">
              {quickLinks.slice(0, 3).map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.title}
                    to={link.to}
                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{link.title}</p>
                        <p className="text-sm text-slate-500">{link.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary-600 transition-transform group-hover:translate-x-1" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Card key={link.title} className="bg-white/85 shadow-sm ring-1 ring-slate-200/70 transition-all hover:-translate-y-1 hover:shadow-md">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{link.title}</p>
                      <p className="text-sm text-slate-500">{link.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={link.to}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
