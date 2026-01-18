import React from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider } from '../contexts/theme/provider';
import { CurrencyProvider } from '../contexts/currency/provider';
import { SettingsProvider } from '../contexts/settings/provider';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <SettingsProvider>{children}</SettingsProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};
