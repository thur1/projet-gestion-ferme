import { useState, createContext, useContext } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bird,
  PiggyBank,
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
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
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
import { cn } from '@/lib/utils';

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
  { name: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Lots Volailles', href: '/poultry', icon: Bird },
  { name: 'Lots Porcs', href: '/pigs', icon: PiggyBank },
  { name: 'Stock', href: '/stock', icon: Package },
  { name: 'Santé Animale', href: '/health', icon: Activity },
  { name: 'Performances', href: '/kpi', icon: BarChart3 },
];

export default function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const userInitials = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      <div className={cn("min-h-screen bg-farm-light-gray", darkMode && "dark")}>
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
          className="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-white border-r border-farm-light-gray shadow-card z-50"
        >
          <SidebarContent />
        </motion.aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 bg-white border-r border-farm-light-gray shadow-floating z-50 lg:hidden"
            >
              <SidebarContent onClose={toggleMobile} />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className={cn(
          "transition-all duration-300",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}>
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 bg-white border-b border-farm-light-gray shadow-sm">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobile}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Desktop Collapse Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="hidden lg:flex"
              >
                {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>

              {/* Breadcrumbs - Hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-farm-text-gray">
                <span>🏠</span>
                <span>/</span>
                <span className="font-medium text-farm-brown">
                  {navigation.find(n => n.href === location.pathname)?.name || 'Page'}
                </span>
              </div>

              {/* Right Side: Notifications + User Menu */}
              <div className="flex items-center gap-3">
                {/* Dark Mode Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className="hidden sm:flex"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-white text-xs flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-farm-green text-white">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium">{user?.email}</span>
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
                    <DropdownMenuItem onClick={signOut} className="text-danger">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

// Sidebar Content Component
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { isCollapsed } = useSidebar();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-farm-light-gray">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="bg-farm-green p-2 rounded-lg">
              <span className="text-2xl">🐔</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-farm-brown">Farm Manager</h1>
              <p className="text-xs text-farm-text-gray">Gestion Avicole</p>
            </div>
          </motion.div>
        )}
        {isCollapsed && (
          <div className="mx-auto bg-farm-green p-2 rounded-lg">
            <span className="text-xl">🐔</span>
          </div>
        )}
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-farm-green text-white shadow-button"
                  : "text-farm-text-gray hover:bg-farm-light-gray hover:text-farm-brown",
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

      {/* Footer */}
      <div className="p-4">
        <div className={cn(
          "bg-farm-blue/10 rounded-lg p-3 border border-farm-blue/20",
          isCollapsed && "hidden"
        )}>
          <p className="text-xs font-medium text-farm-blue mb-1">💡 Astuce du jour</p>
          <p className="text-xs text-farm-text-gray">
            Enregistrez vos données quotidiennes avant 10h pour un meilleur suivi.
          </p>
        </div>
      </div>
    </div>
  );
}
