import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface SettingsContextType {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  showMonthlyView: boolean;
  setShowMonthlyView: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'pfa-calculator-settings';

interface StoredSettings {
  selectedYear: number;
  showMonthlyView: boolean;
}

const DEFAULT_SETTINGS: StoredSettings = {
  selectedYear: 2026,
  showMonthlyView: false,
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoredSettings>(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setSelectedYear = (year: number) => {
    setSettings((prev) => ({ ...prev, selectedYear: year }));
  };

  const setShowMonthlyView = (show: boolean) => {
    setSettings((prev) => ({ ...prev, showMonthlyView: show }));
  };

  return (
    <SettingsContext.Provider
      value={{
        selectedYear: settings.selectedYear,
        setSelectedYear,
        showMonthlyView: settings.showMonthlyView,
        setShowMonthlyView,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};
