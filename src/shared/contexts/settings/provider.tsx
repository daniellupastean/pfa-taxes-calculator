import React, { useCallback } from 'react';
import type { ReactNode } from 'react';
import { SettingsContext } from './context';
import { usePersistedState, STORAGE_KEYS } from '@/lib';
import { getDefaultAdvancedConfig } from '@/data/tax-configurations';

interface StoredSettings {
  selectedYear: number;
  showMonthlyView: boolean;
  customMinWage: number;
  customCasThreshold1: number;
  customCasThreshold2: number;
  customCassMinThreshold: number;
  customCassMaxCap: number;
}

const DEFAULT_SETTINGS: StoredSettings = {
  selectedYear: 2026,
  showMonthlyView: false,
  customMinWage: 4050,
  customCasThreshold1: 12,
  customCasThreshold2: 24,
  customCassMinThreshold: 6,
  customCassMaxCap: 72,
};

const migrateSettings = (stored: unknown): StoredSettings => {
  const parsed = stored as Record<string, unknown>;

  if (parsed.customCassThreshold1 !== undefined && parsed.customCassMinThreshold === undefined) {
    return {
      selectedYear: (parsed.selectedYear as number) ?? DEFAULT_SETTINGS.selectedYear,
      showMonthlyView: (parsed.showMonthlyView as boolean) ?? DEFAULT_SETTINGS.showMonthlyView,
      customMinWage: (parsed.customMinWage as number) ?? DEFAULT_SETTINGS.customMinWage,
      customCasThreshold1:
        (parsed.customCasThreshold1 as number) ?? DEFAULT_SETTINGS.customCasThreshold1,
      customCasThreshold2:
        (parsed.customCasThreshold2 as number) ?? DEFAULT_SETTINGS.customCasThreshold2,
      customCassMinThreshold:
        (parsed.customCassThreshold1 as number) ?? DEFAULT_SETTINGS.customCassMinThreshold,
      customCassMaxCap: (parsed.customCassMaxCap as number) ?? DEFAULT_SETTINGS.customCassMaxCap,
    };
  }

  return {
    selectedYear: (parsed.selectedYear as number) ?? DEFAULT_SETTINGS.selectedYear,
    showMonthlyView: (parsed.showMonthlyView as boolean) ?? DEFAULT_SETTINGS.showMonthlyView,
    customMinWage: (parsed.customMinWage as number) ?? DEFAULT_SETTINGS.customMinWage,
    customCasThreshold1:
      (parsed.customCasThreshold1 as number) ?? DEFAULT_SETTINGS.customCasThreshold1,
    customCasThreshold2:
      (parsed.customCasThreshold2 as number) ?? DEFAULT_SETTINGS.customCasThreshold2,
    customCassMinThreshold:
      (parsed.customCassMinThreshold as number) ?? DEFAULT_SETTINGS.customCassMinThreshold,
    customCassMaxCap: (parsed.customCassMaxCap as number) ?? DEFAULT_SETTINGS.customCassMaxCap,
  };
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = usePersistedState<StoredSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS,
    { migrate: migrateSettings }
  );

  const setSelectedYear = (year: number) => {
    setSettings((prev) => ({ ...prev, selectedYear: year }));
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
