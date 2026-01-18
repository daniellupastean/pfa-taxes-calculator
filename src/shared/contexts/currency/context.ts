import { createContext } from 'react';

export type Currency = 'RON' | 'EUR' | 'USD';

export interface CurrencyRates {
  RON: number;
  EUR: number;
  USD: number;
}

export interface CurrencyContextType {
  inputCurrency: Currency;
  resultCurrency: Currency;
  setInputCurrency: (currency: Currency) => void;
  setResultCurrency: (currency: Currency) => void;
  rates: CurrencyRates;
  updateRates: (rates: Partial<CurrencyRates>) => void;
  convertFromRON: (amount: number, targetCurrency: Currency) => number;
  convertToRON: (amount: number, sourceCurrency: Currency) => number;
  convertBetweenCurrencies: (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
  ) => number;
  formatCurrency: (amount: number, currency: Currency, options?: { compact?: boolean }) => string;
  isLoadingRates: boolean;
  lastUpdate: string | null;
  refreshRates: () => Promise<void>;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
