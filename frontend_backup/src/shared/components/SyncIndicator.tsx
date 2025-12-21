/**
 * SyncIndicator - Affiche le statut de synchronisation et les actions offline
 */

import { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useSync } from '@/shared/hooks/useSync';
import { useOfflineQueue } from '@/shared/hooks/useOfflineQueue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

export function SyncIndicator() {
  const { status, sync, isSyncing } = useSync();
  const { pendingCount, retryFailed } = useOfflineQueue();
  const [isOpen, setIsOpen] = useState(false);

  const formatLastSync = (timestamp: number | null): string => {
    if (!timestamp) return 'Jamais';

    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return new Date(timestamp).toLocaleDateString('fr-FR');
  };

  const getSyncIcon = () => {
    if (isSyncing) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    if (pendingCount > 0) {
      return <Clock className="h-4 w-4 text-warning" />;
    }
    if (status.error) {
      return <AlertCircle className="h-4 w-4 text-error" />;
    }
    return <CheckCircle className="h-4 w-4 text-success" />;
  };

  const getSyncLabel = () => {
    if (isSyncing) return 'Synchronisation...';
    if (pendingCount > 0) return `${pendingCount} en attente`;
    if (status.error) return 'Erreur de sync';
    return 'Synchronisé';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {getSyncIcon()}
          <span className="hidden md:inline text-sm">{getSyncLabel()}</span>
          {pendingCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {pendingCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>État de synchronisation</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="px-2 py-3 space-y-2">
          {/* Statut principal */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Statut</span>
            <div className="flex items-center gap-2">
              {getSyncIcon()}
              <span className="text-sm font-medium">{getSyncLabel()}</span>
            </div>
          </div>

          {/* Dernière sync */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Dernière sync</span>
            <span className="text-sm">{formatLastSync(status.lastSyncTime)}</span>
          </div>

          {/* Actions en attente */}
          {pendingCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Actions en attente</span>
              <Badge variant="secondary">{pendingCount}</Badge>
            </div>
          )}

          {/* Erreur */}
          {status.error && (
            <div className="p-2 bg-error-surface rounded-md">
              <p className="text-xs text-error">{status.error}</p>
            </div>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* Actions */}
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            sync();
          }}
          disabled={isSyncing}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Synchroniser maintenant
        </DropdownMenuItem>

        {pendingCount > 0 && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              retryFailed();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer les échecs
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <div className="px-2 py-1">
          <p className="text-xs text-muted">
            {navigator.onLine
              ? 'Connecté - sync automatique active'
              : 'Hors ligne - les modifications seront synchronisées'}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
