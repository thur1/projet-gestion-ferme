/**
 * Delete Account Page - Suppression du compte utilisateur
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function DeleteAccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState('');
  const [password, setPassword] = useState('');

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmation !== 'SUPPRIMER') {
      alert('Veuillez taper SUPPRIMER pour confirmer');
      return;
    }

    if (!password) {
      alert('Veuillez entrer votre mot de passe');
      return;
    }

    // TODO: Appel API Django pour supprimer le compte
    console.log('Suppression du compte');
    
    // Déconnexion et redirection
    await signOut();
    navigate('/login');
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
        <h1 className="text-3xl font-bold text-error-700">
          Supprimer le compte
        </h1>
        <p className="mt-1 text-neutral-600">
          Cette action est irréversible
        </p>
      </div>

      {/* Avertissement */}
      <Card className="border-error-200 bg-error-50/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-error-600" />
            <div>
              <h3 className="font-semibold text-error-900">
                Attention : Action définitive
              </h3>
              <p className="mt-1 text-sm text-error-700">
                La suppression de votre compte entraînera la perte permanente de :
              </p>
              <ul className="mt-2 space-y-1 text-sm text-error-700">
                <li>• Tous vos projets et historiques</li>
                <li>• Votre inventaire de stock</li>
                <li>• Vos données financières</li>
                <li>• Vos paramètres et préférences</li>
                <li>• L'accès à votre compte email ({user?.email})</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de confirmation */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmer la suppression</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDelete} className="space-y-4">
            <div>
              <Label htmlFor="confirmation">
                Tapez <strong>SUPPRIMER</strong> pour confirmer
              </Label>
              <Input
                id="confirmation"
                placeholder="SUPPRIMER"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">
                Entrez votre mot de passe pour confirmer
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" asChild>
                <Link to="/settings">Annuler</Link>
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="flex-1"
                disabled={confirmation !== 'SUPPRIMER' || !password}
              >
                Supprimer définitivement
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Alternative */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium text-neutral-900">
            Vous avez juste besoin d'une pause ?
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Vous pouvez vous déconnecter sans supprimer votre compte. Vos données
            seront conservées.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => signOut()}
          >
            Se déconnecter uniquement
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
