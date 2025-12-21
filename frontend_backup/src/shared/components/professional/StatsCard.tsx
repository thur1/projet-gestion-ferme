/**
 * StatsCard - Carte statistique professionnelle
 * Design moderne avec tendances et micro-interactions
 */

import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: {
    icon: 'bg-neutral-100 text-neutral-600',
    trend: 'text-neutral-600',
  },
  success: {
    icon: 'bg-success-50 text-success-600',
    trend: 'text-success-600',
  },
  warning: {
    icon: 'bg-warning-50 text-warning-600',
    trend: 'text-warning-600',
  },
  danger: {
    icon: 'bg-error-50 text-error-600',
    trend: 'text-error-600',
  },
  info: {
    icon: 'bg-info-50 text-info-600',
    trend: 'text-info-600',
  },
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  onClick,
}: StatsCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-600">
          {title}
        </CardTitle>
        <div
          className={cn(
            'rounded-lg p-2 transition-transform duration-200',
            'group-hover:scale-110',
            styles.icon
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold text-neutral-900">{value}</div>
        
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-neutral-500">{subtitle}</p>
          
          {trend && (
            <div className={cn('flex items-center gap-1 text-xs font-medium', styles.trend)}>
              {trend.value > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : trend.value < 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : null}
              <span>
                {trend.value > 0 && '+'}
                {trend.value}%
              </span>
              {trend.label && (
                <span className="text-neutral-400">• {trend.label}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Subtle gradient overlay on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-neutral-50/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </Card>
  );
}
