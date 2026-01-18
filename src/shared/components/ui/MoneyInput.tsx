import React from 'react';
import { useNumericInput } from '@/lib';
import { useCurrency, type Currency } from '../../contexts';

interface MoneyInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  helperText?: string;
  error?: string;
  placeholder?: string;
  currency?: Currency | 'fixed-RON';
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  label,
  value,
  onChange,
  helperText,
  error,
  placeholder = '0',
  currency,
}) => {
  const { inputCurrency } = useCurrency();
  const effectiveCurrency = currency === 'fixed-RON' ? 'RON' : currency || inputCurrency;

  const currencySymbols: Record<Currency, string> = {
    RON: 'RON',
    EUR: 'EUR',
    USD: 'USD',
  };

  const { inputValue, handleChange, handleBlur } = useNumericInput(value, onChange, {
    formatThousands: true,
  });

  return (
    <div className="mb-5">
      <label className="block text-sm font-medium mb-2 text-text-secondary">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all font-mono border bg-surface text-text-primary ${
            error
              ? 'border-danger focus:border-danger'
              : 'border-border focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/10'
          }`}
        />
        <span className="absolute right-4 top-3 text-sm font-mono text-text-muted">
          {currencySymbols[effectiveCurrency]}
        </span>
      </div>
      {helperText && !error && <p className="mt-2 text-xs text-text-muted">{helperText}</p>}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
};
