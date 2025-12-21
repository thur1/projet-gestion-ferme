/**
 * Configuration du routing de l'application
 * Code Splitting avec React.lazy() pour optimiser le bundle
 */

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

// Layout (eager load - toujours nécessaire)
import { ProtectedLayout } from '@/shared/components/modern/ProtectedLayout';

// Pages Auth (eager load - first load)
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#2e8b57]"></div>
      <p className="text-sm text-gray-600">Chargement...</p>
    </div>
  </div>
);

// 🚀 Lazy Loading - Code Splitting
// Dashboard
const DashboardHome = lazy(() => import('@/pages/DashboardHome'));
const HomeLanding = lazy(() => import('@/pages/HomeLanding'));

// Projects
const ProjectsList = lazy(() => import('@/pages/ProjectsList'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const ProjectCreate = lazy(() => import('@/pages/ProjectCreate'));

// Aviculture (backward compat)
const CreateBatchPage = lazy(() => import('@/pages/CreateBatchPage'));
const DailyLogPage = lazy(() => import('@/pages/DailyLogPage'));

// Stock
const StockManagement = lazy(() => import('@/pages/StockManagement'));

// KPI
const KPIPage = lazy(() => import('@/pages/KPIPage'));

// Settings
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/ProfileSettingsPage'));
const PasswordSettingsPage = lazy(() => import('@/pages/PasswordSettingsPage'));
const DeleteAccountPage = lazy(() => import('@/pages/DeleteAccountPage'));

// Modern Features Demo
const ModernFeaturesDemo = lazy(() => import('@/pages/ModernFeaturesDemo'));

export function AppRouter() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.register} element={<Register />} />

      {/* Routes protégées avec layout */}
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={
          <Suspense fallback={<PageLoader />}>
            <HomeLanding />
          </Suspense>
        } />
        <Route path="home" element={
          <Suspense fallback={<PageLoader />}>
            <HomeLanding />
          </Suspense>
        } />
        
        {/* Dashboard - Home avec Suspense */}
        <Route path="dashboard" element={
          <Suspense fallback={<PageLoader />}>
            <DashboardHome />
          </Suspense>
        } />

        {/* Modern Features Demo */}
        <Route path="demo" element={
          <Suspense fallback={<PageLoader />}>
            <ModernFeaturesDemo />
          </Suspense>
        } />
        
        {/* Projects - Nouvelle section multi-type */}
        <Route path="projects">
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <ProjectsList />
            </Suspense>
          } />
          <Route path="new" element={
            <Suspense fallback={<PageLoader />}>
              <ProjectCreate />
            </Suspense>
          } />
          <Route path=":id" element={
            <Suspense fallback={<PageLoader />}>
              <ProjectDetail />
            </Suspense>
          } />
        </Route>
        
        {/* Aviculture - Ancienne route (backward compatibility) */}
        <Route path="poultry">
          <Route index element={<Navigate to="/projects" replace />} />
          <Route path="create" element={
            <Suspense fallback={<PageLoader />}>
              <CreateBatchPage />
            </Suspense>
          } />
          <Route path=":id/daily-log" element={
            <Suspense fallback={<PageLoader />}>
              <DailyLogPage />
            </Suspense>
          } />
        </Route>
        
        {/* Porcin - Ancienne route (backward compatibility) */}
        <Route path="pigs">
          <Route index element={<Navigate to="/projects" replace />} />
        </Route>
        
        {/* Stock */}
        <Route path="stock" element={
          <Suspense fallback={<PageLoader />}>
            <StockManagement />
          </Suspense>
        } />
        
        {/* KPI / Rapports */}
        <Route path="kpi" element={
          <Suspense fallback={<PageLoader />}>
            <KPIPage />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<PageLoader />}>
            <KPIPage />
          </Suspense>
        } />
        
        {/* Settings */}
        <Route path="settings">
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          } />
          <Route path="profile" element={
            <Suspense fallback={<PageLoader />}>
              <ProfileSettingsPage />
            </Suspense>
          } />
          <Route path="password" element={
            <Suspense fallback={<PageLoader />}>
              <PasswordSettingsPage />
            </Suspense>
          } />
          <Route path="delete-account" element={
            <Suspense fallback={<PageLoader />}>
              <DeleteAccountPage />
            </Suspense>
          } />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}

export default AppRouter;
