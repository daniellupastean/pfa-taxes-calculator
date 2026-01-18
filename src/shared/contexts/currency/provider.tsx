import type { ReactNode } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { usePersistedState, STORAGE_KEYS } from '@/lib';
import { fetchExchangeRates, shouldUpdateRates } from '@/services/exchange-rates';
import type { Currency, CurrencyRates } from './context';
import { CurrencyContext } from './context';

// Default exchange rates (how many RON for 1 unit of foreign currency)
// Used only as fallback if API doesn't work
const DEFAULT_RATES: CurrencyRates = {
  RON: 1,
  EUR: 5.0,
  USD: 4.5,
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inputCurrency, setInputCurrencyState] = usePersistedState<Currency>(
    STORAGE_KEYS.INPUT_CURRENCY,
    'RON'
  );

  const [resultCurrency, setResultCurrencyState] = usePersistedState<Currency>(
    STORAGE_KEYS.RESULT_CURRENCY,
    'RON'
  );

  const [rates, setRates] = usePersistedState<CurrencyRates>(STORAGE_KEYS.RATES, DEFAULT_RATES);

  const [lastUpdate, setLastUpdate] = usePersistedState<string | null>(
    STORAGE_KEYS.RATES_TIMESTAMP,
    null
  );

  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const refreshRates = useCallback(async () => {
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
    } catch (error) {
      console.error('Failed to refresh exchange rates:', error);
    } finally {
      setIsLoadingRates(false);
    }
  }, [setRates, setLastUpdate]);

  useEffect(() => {
    if (shouldUpdateRates(lastUpdate)) {
      refreshRates();
    }
  }, [lastUpdate, refreshRates]);

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
      EUR: 'EUR',
      USD: 'USD',
    };

    if (options?.compact) {
      const absAmount = Math.abs(amount);
      if (absAmount >= 1000000) {
        const millions = (amount / 1000000).toFixed(1);
        return currency === 'RON'
          ? `${millions}M ${symbols[currency]}`
          : `${millions}M ${symbols[currency]}`;
      } else if (absAmount >= 1000) {
        const thousands = Math.round(amount / 1000);
        return currency === 'RON'
          ? `${thousands}k ${symbols[currency]}`
          : `${thousands}k ${symbols[currency]}`;
      }
    }

    const formatted = Math.round(amount).toLocaleString('ro-RO');
    return currency === 'RON'
      ? `${formatted} ${symbols[currency]}`
      : `${formatted} ${symbols[currency]}`;
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
