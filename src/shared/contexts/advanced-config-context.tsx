import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

interface AdvancedConfigContextType {
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

const AdvancedConfigContext = createContext<AdvancedConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'pfa-calculator-advanced-config';

interface StoredConfig {
  customMinWage: number;
  customCasThreshold1: number;
  customCasThreshold2: number;
  customCassMinThreshold: number;
  customCassMaxCap: number;
}

const DEFAULT_CONFIG: StoredConfig = {
  customMinWage: 4050,
  customCasThreshold1: 12,
  customCasThreshold2: 24,
  customCassMinThreshold: 6,
  customCassMaxCap: 72,
};

export const AdvancedConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoredConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_CONFIG;
    }

    try {
      const parsed = JSON.parse(stored);

      // Migration: convert old CASS thresholds to new format
      if (
        parsed.customCassThreshold1 !== undefined &&
        parsed.customCassMinThreshold === undefined
      ) {
        return {
          customMinWage: parsed.customMinWage ?? DEFAULT_CONFIG.customMinWage,
          customCasThreshold1: parsed.customCasThreshold1 ?? DEFAULT_CONFIG.customCasThreshold1,
          customCasThreshold2: parsed.customCasThreshold2 ?? DEFAULT_CONFIG.customCasThreshold2,
          customCassMinThreshold:
            parsed.customCassThreshold1 ?? DEFAULT_CONFIG.customCassMinThreshold,
          customCassMaxCap: parsed.customCassMaxCap ?? DEFAULT_CONFIG.customCassMaxCap,
        };
      }

      // Ensure all required fields exist
      return {
        customMinWage: parsed.customMinWage ?? DEFAULT_CONFIG.customMinWage,
        customCasThreshold1: parsed.customCasThreshold1 ?? DEFAULT_CONFIG.customCasThreshold1,
        customCasThreshold2: parsed.customCasThreshold2 ?? DEFAULT_CONFIG.customCasThreshold2,
        customCassMinThreshold:
          parsed.customCassMinThreshold ?? DEFAULT_CONFIG.customCassMinThreshold,
        customCassMaxCap: parsed.customCassMaxCap ?? DEFAULT_CONFIG.customCassMaxCap,
      };
    } catch (error) {
      console.error('Failed to parse stored config, using defaults:', error);
      return DEFAULT_CONFIG;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const resetToDefaults = useCallback((year: number) => {
    const defaults: Record<number, StoredConfig> = {
      2024: {
        customMinWage: 3700,
        customCasThreshold1: 12,
        customCasThreshold2: 24,
        customCassMinThreshold: 6,
        customCassMaxCap: 72,
      },
      2025: {
        customMinWage: 4050,
        customCasThreshold1: 12,
        customCasThreshold2: 24,
        customCassMinThreshold: 6,
        customCassMaxCap: 72,
      },
      2026: {
        customMinWage: 4050,
        customCasThreshold1: 12,
        customCasThreshold2: 24,
        customCassMinThreshold: 6,
        customCassMaxCap: 72,
      },
      2027: {
        customMinWage: 4325,
        customCasThreshold1: 12,
        customCasThreshold2: 24,
        customCassMinThreshold: 6,
        customCassMaxCap: 72,
      },
    };

    setConfig(defaults[year] || DEFAULT_CONFIG);
  }, []);

  return (
    <AdvancedConfigContext.Provider
      value={{
        customMinWage: config.customMinWage,
        setCustomMinWage: (value) => setConfig((prev) => ({ ...prev, customMinWage: value })),
        customCasThreshold1: config.customCasThreshold1,
        setCustomCasThreshold1: (value) =>
          setConfig((prev) => ({ ...prev, customCasThreshold1: value })),
        customCasThreshold2: config.customCasThreshold2,
        setCustomCasThreshold2: (value) =>
          setConfig((prev) => ({ ...prev, customCasThreshold2: value })),
        customCassMinThreshold: config.customCassMinThreshold,
        setCustomCassMinThreshold: (value) =>
          setConfig((prev) => ({ ...prev, customCassMinThreshold: value })),
        customCassMaxCap: config.customCassMaxCap,
        setCustomCassMaxCap: (value) => setConfig((prev) => ({ ...prev, customCassMaxCap: value })),
        resetToDefaults,
      }}
    >
      {children}
    </AdvancedConfigContext.Provider>
  );
};

export const useAdvancedConfig = () => {
  const context = useContext(AdvancedConfigContext);
  if (!context) {
    throw new Error('useAdvancedConfig must be used within AdvancedConfigProvider');
  }
  return context;
};
