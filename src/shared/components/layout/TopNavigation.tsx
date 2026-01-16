import React, { type ReactNode } from 'react';
import { ThemeToggle, LanguageSelector } from '../ui';

interface TopNavigationProps {
  title: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightActions?: ReactNode;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  title,
  subtitle,
  leftAction,
  rightActions,
}) => {
  return (
    <header
      className="border-glow"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="container mx-auto px-4" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <div
          className="flex items-center justify-between flex-wrap gap-4"
          style={{ minHeight: '60px' }}
        >
          {/* Left side - Back button (if any) + Title */}
          <div className="flex items-center gap-4">
            {leftAction}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold gradient-text leading-tight">{title}</h1>
              {subtitle && (
                <p
                  className="text-sm font-medium leading-tight mt-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right side - Language selector + Theme toggle + Custom actions */}
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <ThemeToggle />
            {rightActions}
          </div>
        </div>
      </div>
    </header>
  );
};
