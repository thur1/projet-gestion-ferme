/**
 * QuickActions - Actions rapides dashboard
 * Boutons d'accès rapide aux fonctionnalités principales
 */

import { Plus, FileText, PackageSearch, BarChart3, type LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
  onClick: () => void;
}

const defaultActions: QuickAction[] = [
  {
    label: 'Nouvelle saisie',
    icon: Plus,
    variant: 'primary',
    onClick: () => console.log('Nouvelle saisie'),
  },
  {
    label: 'Ajouter lot',
    icon: FileText,
    variant: 'outline',
    onClick: () => console.log('Ajouter lot'),
  },
  {
    label: 'Vérifier stock',
    icon: PackageSearch,
    variant: 'outline',
    onClick: () => console.log('Vérifier stock'),
  },
  {
    label: 'Générer rapport',
    icon: BarChart3,
    variant: 'outline',
    onClick: () => console.log('Générer rapport'),
  },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  title?: string;
  className?: string;
}

export function QuickActions({
  actions = defaultActions,
  title = 'Actions rapides',
  className,
}: QuickActionsProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant === 'primary' ? 'default' : 'outline'}
                onClick={action.onClick}
                className={cn(
                  'h-auto flex-col gap-2 py-4',
                  action.variant === 'primary' && 'bg-primary-500 hover:bg-primary-600'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
