/**
 * Password Settings Page - Réinitialisation du mot de passe
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ArrowLeft, KeyRound } from 'lucide-react';

export default function PasswordSettingsPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    console.log('Changement de mot de passe');
    // TODO: Appel API Django
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/settings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux paramètres
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-neutral-900">
          Mot de passe et sécurité
        </h1>
        <p className="mt-1 text-neutral-600">
          Changez votre mot de passe pour sécuriser votre compte
        </p>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                required
              />
              <p className="mt-1 text-xs text-neutral-500">
                Minimum 8 caractères, avec majuscule, minuscule et chiffre
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                Confirmer le nouveau mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" asChild>
                <Link to="/settings">Annuler</Link>
              </Button>
              <Button type="submit" className="flex-1 gap-2">
                <KeyRound className="h-4 w-4" />
                Changer le mot de passe
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info sécurité */}
      <Card className="border-info-200 bg-info-50/50">
        <CardContent className="pt-6">
          <h3 className="font-medium text-info-900">Conseils de sécurité</h3>
          <ul className="mt-2 space-y-1 text-sm text-info-700">
            <li>• Utilisez un mot de passe unique pour ce compte</li>
            <li>• Changez régulièrement votre mot de passe</li>
            <li>• N'utilisez pas d'informations personnelles évidentes</li>
            <li>• Activez la vérification en deux étapes si disponible</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
