import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { fetchExchangeRates } from '../../services/exchange-rates';

export type Currency = 'RON' | 'EUR' | 'USD';

export interface CurrencyRates {
  RON: number;
  EUR: number;
  USD: number;
}

interface CurrencyContextType {
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

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const INPUT_CURRENCY_STORAGE_KEY = 'pfa-calculator-input-currency';
const RESULT_CURRENCY_STORAGE_KEY = 'pfa-calculator-result-currency';
const RATES_STORAGE_KEY = 'pfa-calculator-rates';
const RATES_TIMESTAMP_KEY = 'pfa-calculator-rates-timestamp';

// Default exchange rates (how many RON for 1 unit of foreign currency)
// Used only as fallback if API doesn't work
const DEFAULT_RATES: CurrencyRates = {
  RON: 1,
  EUR: 5.0,
  USD: 4.5,
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inputCurrency, setInputCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(INPUT_CURRENCY_STORAGE_KEY);
    return (stored as Currency) || 'RON';
  });

  const [resultCurrency, setResultCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem(RESULT_CURRENCY_STORAGE_KEY);
    return (stored as Currency) || 'RON';
  });

  const [rates, setRates] = useState<CurrencyRates>(() => {
    const stored = localStorage.getItem(RATES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_RATES;
  });

  const [lastUpdate, setLastUpdate] = useState<string | null>(() => {
    return localStorage.getItem(RATES_TIMESTAMP_KEY);
  });

  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const refreshRates = async () => {
    setIsLoadingRates(true);
    try {
      const newRates = await fetchExchangeRates();
      setRates((prev) => ({
        ...prev,
        EUR: newRates.EUR,
        USD: newRates.USD,
      }));
      const currentTimestamp = new Date().toISOString();
      setLastUpdate(currentTimestamp);
      localStorage.setItem(RATES_TIMESTAMP_KEY, currentTimestamp);
    } catch (error) {
      console.error('Failed to refresh exchange rates:', error);
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    refreshRates();
  }, []);

  useEffect(() => {
    localStorage.setItem(INPUT_CURRENCY_STORAGE_KEY, inputCurrency);
  }, [inputCurrency]);

  useEffect(() => {
    localStorage.setItem(RESULT_CURRENCY_STORAGE_KEY, resultCurrency);
  }, [resultCurrency]);

  useEffect(() => {
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
  }, [rates]);

  const setInputCurrency = (newCurrency: Currency) => {
    setInputCurrencyState(newCurrency);
  };

  const setResultCurrency = (newCurrency: Currency) => {
    setResultCurrencyState(newCurrency);
  };

  const updateRates = (newRates: Partial<CurrencyRates>) => {
    setRates((prev) => ({ ...prev, ...newRates }));
  };

  const convertFromRON = (amount: number, targetCurrency: Currency): number => {
    if (targetCurrency === 'RON') return amount;
    return amount / rates[targetCurrency];
  };

  const convertToRON = (amount: number, sourceCurrency: Currency): number => {
    if (sourceCurrency === 'RON') return amount;
    return amount * rates[sourceCurrency];
  };

  const convertBetweenCurrencies = (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
  ): number => {
    if (fromCurrency === toCurrency) return amount;
    const amountInRON = fromCurrency === 'RON' ? amount : amount * rates[fromCurrency];
    return toCurrency === 'RON' ? amountInRON : amountInRON / rates[toCurrency];
  };

  const formatCurrency = (
    amount: number,
    currency: Currency,
    options?: { compact?: boolean }
  ): string => {
    const symbols: Record<Currency, string> = {
      RON: 'RON',
      EUR: '€',
      USD: '$',
    };

    if (options?.compact) {
      const absAmount = Math.abs(amount);
      if (absAmount >= 1000000) {
        const millions = (amount / 1000000).toFixed(1);
        return currency === 'RON'
          ? `${millions}M ${symbols[currency]}`
          : `${symbols[currency]}${millions}M`;
      } else if (absAmount >= 1000) {
        const thousands = Math.round(amount / 1000);
        return currency === 'RON'
          ? `${thousands}k ${symbols[currency]}`
          : `${symbols[currency]}${thousands}k`;
      }
    }

    const formatted = Math.round(amount).toLocaleString('ro-RO');
    return currency === 'RON'
      ? `${formatted} ${symbols[currency]}`
      : `${symbols[currency]}${formatted}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        inputCurrency,
        resultCurrency,
        setInputCurrency,
        setResultCurrency,
        rates,
        updateRates,
        convertFromRON,
        convertToRON,
        convertBetweenCurrencies,
        formatCurrency,
        isLoadingRates,
        lastUpdate,
        refreshRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
