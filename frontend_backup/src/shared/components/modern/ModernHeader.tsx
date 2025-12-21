/**
 * ModernHeader - Header moderne type SaaS 2025
 * Sticky, backdrop-blur, navigation subtile
 */

import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Package,
  BarChart3,
  Users,
  Bell,
  Search,
  Settings,
  LogOut,
  User,
  Menu,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Badge } from '@/shared/components/ui/badge';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projets', href: '/projects', icon: FolderKanban },
  { name: 'Stock', href: '/stock', icon: Package },
  { name: 'Rapports', href: '/reports', icon: BarChart3 },
  { name: 'Équipe', href: '/team', icon: Users },
];

interface ModernHeaderProps {
  onMenuClick?: () => void;
}

export function ModernHeader({ onMenuClick }: ModernHeaderProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isOnline = useOnlineStatus();

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg" style={{ borderColor: 'var(--gray-200)' }}>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-3 transition-transform hover:scale-105">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-700" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--gray-900)' }}>
                  AgriTrack Pro
                </span>
                <span className="text-xs font-medium" style={{ color: 'var(--gray-500)' }}>Votre ferme, maîtrisée</span>
              </div>
            </Link>

            {/* Navigation principale */}
            <nav className="hidden lg:flex lg:gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-gray-900'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    {item.name}
                    {isActive && (
                      <span 
                        className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full" 
                        style={{ backgroundColor: 'var(--primary-600)' }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Statut en ligne */}
            {isOnline && (
              <Badge variant="outline" className="hidden gap-1.5 border-none bg-gray-100 text-xs font-medium text-gray-600 sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
                </span>
                En ligne
              </Badge>
            )}

            {/* Search button */}
            <button
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Rechercher"
            >
              <Search className="h-4 w-4" strokeWidth={2} />
            </button>

            {/* Notifications */}
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" strokeWidth={2} />
              <span className="absolute right-1 top-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
              </span>
            </button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-gray-100">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary-100 text-sm font-medium text-primary-700">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-gray-700 sm:inline-block">
                    {user?.email?.split('@')[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium text-gray-900">{user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex w-full cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex w-full cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-danger-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
