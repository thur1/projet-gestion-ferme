/**
 * Point d'entrée principal de l'application
 * Architecture modulaire optimisée pour mobile/offline
 */

import { useEffect } from 'react';
import { AppProviders } from './providers';
import { AppRouter } from './router';
import { ReloadPrompt } from '@/shared/components/ReloadPrompt';
import { validateEnv } from '@/config/env';

function App() {
  useEffect(() => {
    // Valider les variables d'environnement au démarrage
    try {
      validateEnv();
    } catch (error) {
      console.error('Configuration error:', error);
    }
  }, []);

  return (
    <AppProviders>
      <AppRouter />
      <ReloadPrompt />
    </AppProviders>
  );
}

export default App;
