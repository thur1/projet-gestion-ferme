/**
 * ModernAppLayout - Layout horizontal moderne type SaaS
 */

import { TopNavigation } from './TopNavigation';

interface ModernAppLayoutProps {
  children: React.ReactNode;
}

export function ModernAppLayout({ children }: ModernAppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <TopNavigation />
      <main className="mx-auto max-w-[1920px] px-6 py-8">
        {children}
      </main>
    </div>
  );
}
