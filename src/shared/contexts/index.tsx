/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider } from './theme-context';
import { CurrencyProvider } from './currency-context';
import { SettingsProvider } from './settings-context';
import { AdvancedConfigProvider } from './advanced-config-context';

export { useTheme } from './theme-context';
export { useCurrency } from './currency-context';
export { useSettings } from './settings-context';
export { useAdvancedConfig } from './advanced-config-context';
export type { Theme } from './theme-context';
export type { Currency, CurrencyRates } from './currency-context';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <SettingsProvider>
          <AdvancedConfigProvider>{children}</AdvancedConfigProvider>
        </SettingsProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};
