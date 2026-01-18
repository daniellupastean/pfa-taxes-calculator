import React, { useCallback } from 'react';
import type { ReactNode } from 'react';
import { SettingsContext } from './context';
import { usePersistedState, STORAGE_KEYS } from '@lib';
import { availableYears, defaultYear, getDefaultAdvancedConfig } from '@data/tax-configurations';

interface StoredSettings {
  selectedYear: number;
  showMonthlyView: boolean;
  customMinWage: number;
  customCasThreshold1: number;
  customCasThreshold2: number;
  customCassMinThreshold: number;
  customCassMaxCap: number;
}

const DEFAULT_ADVANCED_CONFIG = getDefaultAdvancedConfig(defaultYear);

const DEFAULT_SETTINGS: StoredSettings = {
  selectedYear: defaultYear,
  showMonthlyView: false,
  customMinWage: DEFAULT_ADVANCED_CONFIG.customMinWage,
  customCasThreshold1: DEFAULT_ADVANCED_CONFIG.customCasThreshold1,
  customCasThreshold2: DEFAULT_ADVANCED_CONFIG.customCasThreshold2,
  customCassMinThreshold: DEFAULT_ADVANCED_CONFIG.customCassMinThreshold,
  customCassMaxCap: DEFAULT_ADVANCED_CONFIG.customCassMaxCap,
};

const resolveYearDefaults = (year: number): { selectedYear: number; defaults: StoredSettings } => {
  const resolvedYear = availableYears.includes(year) ? year : DEFAULT_SETTINGS.selectedYear;
  const defaults = getDefaultAdvancedConfig(resolvedYear);
  return {
    selectedYear: resolvedYear,
    defaults: {
      selectedYear: resolvedYear,
      showMonthlyView: DEFAULT_SETTINGS.showMonthlyView,
      customMinWage: defaults.customMinWage,
      customCasThreshold1: defaults.customCasThreshold1,
      customCasThreshold2: defaults.customCasThreshold2,
      customCassMinThreshold: defaults.customCassMinThreshold,
      customCassMaxCap: defaults.customCassMaxCap,
    },
  };
};

const migrateSettings = (stored: unknown): StoredSettings => {
  const parsed = stored as Record<string, unknown>;
  const parsedYear = typeof parsed.selectedYear === 'number' ? parsed.selectedYear : undefined;
  const { selectedYear, defaults } = resolveYearDefaults(
    parsedYear ?? DEFAULT_SETTINGS.selectedYear
  );

  return {
    selectedYear,
    showMonthlyView: (parsed.showMonthlyView as boolean) ?? defaults.showMonthlyView,
    customMinWage: (parsed.customMinWage as number) ?? defaults.customMinWage,
    customCasThreshold1:
      (parsed.customCasThreshold1 as number) ?? defaults.customCasThreshold1,
    customCasThreshold2:
      (parsed.customCasThreshold2 as number) ?? defaults.customCasThreshold2,
    customCassMinThreshold:
      (parsed.customCassMinThreshold as number) ??
      (parsed.customCassThreshold1 as number) ??
      defaults.customCassMinThreshold,
    customCassMaxCap: (parsed.customCassMaxCap as number) ?? defaults.customCassMaxCap,
  };
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = usePersistedState<StoredSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS,
    { migrate: migrateSettings }
  );

  const setSelectedYear = (year: number) => {
    const yearDefaults = getDefaultAdvancedConfig(year);
    setSettings((prev) => ({ ...prev, selectedYear: year, ...yearDefaults }));
  };

  const setShowMonthlyView = (show: boolean) => {
    setSettings((prev) => ({ ...prev, showMonthlyView: show }));
  };

  const setCustomMinWage = (value: number) => {
    setSettings((prev) => ({ ...prev, customMinWage: value }));
  };

  const setCustomCasThreshold1 = (value: number) => {
    setSettings((prev) => ({ ...prev, customCasThreshold1: value }));
  };

  const setCustomCasThreshold2 = (value: number) => {
    setSettings((prev) => ({ ...prev, customCasThreshold2: value }));
  };

  const setCustomCassMinThreshold = (value: number) => {
    setSettings((prev) => ({ ...prev, customCassMinThreshold: value }));
  };

  const setCustomCassMaxCap = (value: number) => {
    setSettings((prev) => ({ ...prev, customCassMaxCap: value }));
  };

  const resetToDefaults = useCallback(
    (year: number) => {
      const yearDefaults = getDefaultAdvancedConfig(year);
      setSettings((prev) => ({ ...prev, ...yearDefaults }));
    },
    [setSettings]
  );

  return (
    <SettingsContext.Provider
      value={{
        selectedYear: settings.selectedYear,
        setSelectedYear,
        showMonthlyView: settings.showMonthlyView,
        setShowMonthlyView,
        customMinWage: settings.customMinWage,
        setCustomMinWage,
        customCasThreshold1: settings.customCasThreshold1,
        setCustomCasThreshold1,
        customCasThreshold2: settings.customCasThreshold2,
        setCustomCasThreshold2,
        customCassMinThreshold: settings.customCassMinThreshold,
        setCustomCassMinThreshold,
        customCassMaxCap: settings.customCassMaxCap,
        setCustomCassMaxCap,
        resetToDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
