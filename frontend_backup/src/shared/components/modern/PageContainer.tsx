/**
 * PageContainer - Container moderne avec max-width professionnel
 * Sizes: narrow (768px), default (1280px), wide (1400px)
 */

import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  size?: 'narrow' | 'default' | 'wide' | 'full';
  className?: string;
}

export function PageContainer({ 
  children, 
  size = 'default',
  className = '' 
}: PageContainerProps) {
  const sizeClasses = {
    narrow: 'max-w-[768px]',      // Forms, Settings
    default: 'max-w-[1280px]',    // Dashboard, Lists (default)
    wide: 'max-w-[1400px]',       // Analytics, Charts
    full: 'max-w-[1920px]',       // Rare usage
  };

  return (
    <div 
      className={`
        mx-auto 
        w-full 
        ${sizeClasses[size]} 
        px-4 sm:px-6 lg:px-8
        py-6 sm:py-8 lg:py-12
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}

/**
 * PageHeader - En-tête de page moderne
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  actions,
  breadcrumbs 
}: PageHeaderProps) {
  return (
    <div className="space-y-4">
      {breadcrumbs && (
        <div className="text-sm text-gray-500">
          {breadcrumbs}
        </div>
      )}
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            {title}
          </h1>
          {description && (
            <p className="text-base text-gray-600">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Section - Section de contenu avec espacement
 */
interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function Section({ 
  children, 
  title, 
  description, 
  actions,
  className = '' 
}: SectionProps) {
  return (
    <section className={`space-y-6 ${className}`.trim()}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      
      {children}
    </section>
  );
}
