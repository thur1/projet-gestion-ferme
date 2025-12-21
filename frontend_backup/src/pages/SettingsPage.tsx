/**
 * Settings Page - Page des paramètres utilisateur
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { User, KeyRound, Bell, Trash2, Settings as SettingsIcon, ArrowRight } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Paramètres</h1>
        <p className="mt-1 text-neutral-600">
          Gérez les paramètres de votre compte
        </p>
      </div>

      {/* Options de paramètres */}
      <div className="grid gap-4">
        {/* Profil */}
        <Card className="group transition-all hover:shadow-md">
          <CardContent className="p-6">
            <Link to="/settings/profile" className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    Informations personnelles
                  </h3>
                  <p className="mt-0.5 text-sm text-neutral-600">
                    Modifier votre nom, email et photo de profil
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>

        {/* Mot de passe */}
        <Card className="group transition-all hover:shadow-md">
          <CardContent className="p-6">
            <Link to="/settings/password" className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-info-100">
                  <KeyRound className="h-6 w-6 text-info-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    Mot de passe et sécurité
                  </h3>
                  <p className="mt-0.5 text-sm text-neutral-600">
                    Réinitialiser votre mot de passe
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="group transition-all hover:shadow-md">
          <CardContent className="p-6">
            <Link to="/settings/notifications" className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning-100">
                  <Bell className="h-6 w-6 text-warning-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    Notifications
                  </h3>
                  <p className="mt-0.5 text-sm text-neutral-600">
                    Gérer vos préférences de notifications
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>

        {/* Préférences */}
        <Card className="group transition-all hover:shadow-md">
          <CardContent className="p-6">
            <Link to="/settings/preferences" className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-100">
                  <SettingsIcon className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">
                    Préférences
                  </h3>
                  <p className="mt-0.5 text-sm text-neutral-600">
                    Langue, unités, affichage
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-neutral-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Zone dangereuse */}
      <Card className="border-error-200 bg-error-50/50">
        <CardHeader>
          <CardTitle className="text-error-700">Zone dangereuse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-neutral-900">
                Supprimer le compte
              </h4>
              <p className="mt-0.5 text-sm text-neutral-600">
                Action irréversible. Toutes vos données seront perdues.
              </p>
            </div>
            <Button variant="destructive" size="sm" asChild>
              <Link to="/settings/delete-account" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
