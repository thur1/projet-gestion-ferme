/**
 * Layout principal de l'application avec sidebar responsive
 * Mobile-first, optimisé pour connexions faibles
 */

import { useState, createContext, useContext } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Activity,
  BarChart3,
  Bell,
  Settings,
  Menu,
  X,
  ChevronLeft,
  User,
  LogOut,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOnlineStatus } from '@/shared/hooks';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Separator } from '@/shared/components/ui/separator';
import { SyncIndicator } from '@/shared/components/SyncIndicator';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/routes';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  toggleCollapse: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

const navigation = [
  { name: 'Accueil', href: ROUTES.home, icon: LayoutDashboard },
  { name: 'Projets', href: '/projects', icon: ClipboardList },
  { name: 'Saisie quotidienne', href: ROUTES.poultry.base, icon: Activity },
  { name: 'Stock', href: ROUTES.stock.base, icon: Package },
  { name: 'Rapports', href: ROUTES.reports, icon: BarChart3 },
  { name: 'Paramètres', href: ROUTES.settings, icon: Settings },
];

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isOnline = useOnlineStatus();
  const location = useLocation();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U';

  const currentPage = navigation.find(n => 
    location.pathname.startsWith(n.href)
  )?.name || 'Page';

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobile}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <motion.aside
          animate={{ width: isCollapsed ? 80 : 256 }}
          className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-white border-r shadow-sm z-50"
        >
          <SidebarContent isOnline={isOnline} />
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-xl z-50 lg:hidden"
            >
              <SidebarContent isOnline={isOnline} onClose={toggleMobile} />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className={cn(
          "transition-all duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}>
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
            <div className="flex items-center justify-between h-16 px-4">
              {/* Mobile Menu + Collapse Button */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMobile}
                  className="lg:hidden"
                  aria-label="Menu"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCollapse}
                  className="hidden lg:flex"
                >
                  {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>

                {/* Breadcrumb */}
                <div className="hidden sm:flex items-center text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{currentPage}</span>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-2">
                {/* Online Status Indicator */}
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
                  isOnline 
                    ? "bg-green-50 text-green-700" 
                    : "bg-red-50 text-red-700"
                )}>
                  {isOnline ? (
                    <>
                      <Wifi className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">En ligne</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Hors ligne</span>
                    </>
                  )}
                </div>

                {/* Sync Indicator */}
                <SyncIndicator />

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-emerald-600 text-white">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline text-sm font-medium max-w-[120px] truncate">
                        {user?.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 sm:p-6 max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

// Sidebar Content Component
function SidebarContent({ 
  isOnline, 
  onClose 
}: { 
  isOnline: boolean;
  onClose?: () => void;
}) {
  const { isCollapsed } = useSidebar();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="bg-emerald-600 p-2 rounded-lg">
              <span className="text-2xl">🌾</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Farm Manager</h1>
              <p className="text-xs text-gray-500">Gestion Agricole</p>
            </div>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="mx-auto bg-emerald-600 p-2 rounded-lg">
            <span className="text-xl">🌾</span>
          </div>
        )}
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all min-h-touch",
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "h-6 w-6")} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Status Indicator (collapsed) */}
      {isCollapsed && (
        <div className="p-4 flex justify-center">
          {isOnline ? (
            <Wifi className="h-5 w-5 text-green-600" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-600" />
          )}
        </div>
      )}

      {/* Tip Card (expanded) */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs font-medium text-blue-900 mb-1">💡 Astuce</p>
            <p className="text-xs text-blue-700">
              Saisissez vos données quotidiennes avant 10h pour un suivi optimal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppLayout;
