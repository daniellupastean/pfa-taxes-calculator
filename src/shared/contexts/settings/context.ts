import { createContext } from 'react';

export interface SettingsContextType {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  showMonthlyView: boolean;
  setShowMonthlyView: (show: boolean) => void;
  customMinWage: number;
  setCustomMinWage: (value: number) => void;
  customCasThreshold1: number;
  setCustomCasThreshold1: (value: number) => void;
  customCasThreshold2: number;
  setCustomCasThreshold2: (value: number) => void;
  customCassMinThreshold: number;
  setCustomCassMinThreshold: (value: number) => void;
  customCassMaxCap: number;
  setCustomCassMaxCap: (value: number) => void;
  resetToDefaults: (year: number) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
