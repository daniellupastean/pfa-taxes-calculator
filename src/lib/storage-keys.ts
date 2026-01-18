export const STORAGE_KEYS = {
  THEME: 'pfa-calculator-theme',
  INPUT_CURRENCY: 'pfa-calculator-input-currency',
  RESULT_CURRENCY: 'pfa-calculator-result-currency',
  RATES: 'pfa-calculator-rates',
  RATES_TIMESTAMP: 'pfa-calculator-rates-timestamp',
  SETTINGS: 'pfa-calculator-settings',
  ADVANCED_CONFIG: 'pfa-calculator-advanced-config',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
