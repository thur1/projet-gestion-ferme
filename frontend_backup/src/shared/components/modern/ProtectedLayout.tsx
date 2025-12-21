/**
 * ProtectedLayout - Wrapper pour les routes protégées
 */

import { Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { ModernAppLayout } from './ModernAppLayout';

export function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <ModernAppLayout>
        <Outlet />
      </ModernAppLayout>
    </ProtectedRoute>
  );
}
