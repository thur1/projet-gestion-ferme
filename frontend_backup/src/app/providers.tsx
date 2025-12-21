/**
 * Configuration des providers globaux
 */

import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/hooks/useAuth';
import { OfflineProvider } from './providers/OfflineProvider';
import { Toaster } from '@/shared/components/ui/sonner';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineProvider>
          {children}
          <Toaster />
        </OfflineProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppProviders;
