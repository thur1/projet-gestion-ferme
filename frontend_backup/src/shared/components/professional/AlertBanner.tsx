/**
 * AlertBanner - Bannière d'alertes avec priorités
 * Affichage visuel des alertes système avec actions
 */

import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp?: Date;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-success-50',
    border: 'border-success-200',
    text: 'text-success-900',
    iconColor: 'text-success-600',
    badge: 'bg-success-100 text-success-700',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    text: 'text-warning-900',
    iconColor: 'text-warning-600',
    badge: 'bg-warning-100 text-warning-700',
  },
  error: {
    icon: XCircle,
    bg: 'bg-error-50',
    border: 'border-error-200',
    text: 'text-error-900',
    iconColor: 'text-error-600',
    badge: 'bg-error-100 text-error-700',
  },
  info: {
    icon: Info,
    bg: 'bg-info-50',
    border: 'border-info-200',
    text: 'text-info-900',
    iconColor: 'text-info-600',
    badge: 'bg-info-100 text-info-700',
  },
};

interface AlertBannerProps {
  alerts: Alert[];
  title?: string;
  maxVisible?: number;
  className?: string;
}

export function AlertBanner({
  alerts,
  title = 'Alertes en cours',
  maxVisible = 5,
  className,
}: AlertBannerProps) {
  const visibleAlerts = alerts.slice(0, maxVisible);
  const hiddenCount = alerts.length - maxVisible;

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Badge variant="secondary" className="text-xs">
          {alerts.length} {alerts.length === 1 ? 'alerte' : 'alertes'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleAlerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'relative rounded-lg border p-4 transition-all',
                config.bg,
                config.border
              )}
            >
              <div className="flex gap-3">
                <Icon className={cn('h-5 w-5 flex-shrink-0', config.iconColor)} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium', config.text)}>
                      {alert.title}
                    </p>
                    {alert.onDismiss && (
                      <button
                        onClick={alert.onDismiss}
                        className={cn(
                          'rounded-md p-0.5 transition-colors hover:bg-neutral-200/50',
                          config.text
                        )}
                        aria-label="Fermer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className={cn('text-xs', config.text, 'opacity-80')}>
                    {alert.message}
                  </p>
                  {alert.timestamp && (
                    <p className="text-xs text-neutral-500">
                      {alert.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {alert.actionLabel && alert.onAction && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={alert.onAction}
                      className="mt-2 h-7 text-xs"
                    >
                      {alert.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {hiddenCount > 0 && (
          <Button variant="ghost" size="sm" className="w-full text-xs">
            Voir {hiddenCount} alerte{hiddenCount > 1 ? 's' : ''} de plus
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
