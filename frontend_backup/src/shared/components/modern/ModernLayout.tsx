/**
 * ModernLayout - Layout principal moderne
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ModernSidebar } from './ModernSidebar';
import { ModernHeader } from './ModernHeader';
import { Sheet, SheetContent } from '@/shared/components/ui/sheet';

export function ModernLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <ModernSidebar />

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <ModernSidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="lg:pl-64">
        <ModernHeader onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className="p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
