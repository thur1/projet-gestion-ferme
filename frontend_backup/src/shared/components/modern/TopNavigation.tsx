/**
 * TopNavigation - Navigation horizontale moderne type SaaS
 */

import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FolderKanban,
  Package,
  Activity,
  BarChart3,
  Users,
  Settings,
  LogOut,
  User,
  Camera,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Badge } from '@/shared/components/ui/badge';
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus';

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Projets', href: '/projects', icon: FolderKanban },
  { name: 'Saisie quotidienne', href: '/poultry', icon: Activity },
  { name: 'Stock', href: '/stock', icon: Package },
  { name: 'Rapports', href: '/reports', icon: BarChart3 },
  { name: 'Équipe', href: '/team', icon: Users },
  { name: '✨ Démo', href: '/demo', icon: Camera, badge: 'NEW' },
];

export function TopNavigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isOnline = useOnlineStatus();
  const userMetadata = (user as any)?.user_metadata || {};
  const avatarUrl: string | undefined = userMetadata.avatar_url;
  const fullName: string = userMetadata.full_name || user?.email || 'Utilisateur';
  const userInitials = (fullName || 'Utilisateur').substring(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-6">
        {/* Logo + Brand AgriTrack Pro */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f5c3f] to-[#143a28] shadow-lg" style={{ boxShadow: '0 4px 14px 0 rgba(31, 92, 63, 0.28)' }}>
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-xl font-bold tracking-tight text-[#1f5c3f]">AgriTrack Pro</span>
              <span className="text-xs font-medium text-slate-500">Votre ferme, maîtrisée</span>
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
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#dcf3e9] to-[#bbe7d3] text-[#1f593a] shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-[#2e8b57]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                  {(item as any).badge && (
                    <span className="rounded-full bg-[#ffb74d] px-2 py-0.5 text-xs font-bold text-white">
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions droite */}
        <div className="flex items-center gap-4">
          {/* Status en ligne */}
          <Badge
            variant={isOnline ? 'default' : 'secondary'}
            className={`hidden sm:flex ${
              isOnline
                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </Badge>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 rounded-full bg-slate-100 py-1.5 pl-1.5 pr-4 transition-all hover:bg-slate-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-xs font-semibold text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {fullName}
                </p>
                <p className="text-xs text-slate-500">{user?.email?.split('@')[0]}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 shadow-xl">
              <DropdownMenuLabel className="flex items-center gap-2 pb-2">
                <Avatar className="h-10 w-10 border-2 border-slate-200">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-bold text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {fullName}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings/profile" className="flex cursor-pointer items-center gap-2">
                  <User className="h-4 w-4" />
                  Mon profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings/profile" className="flex cursor-pointer items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photo de profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex cursor-pointer items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
