import React, { useState, useEffect } from 'react';
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
    EUR: '€',
    USD: '$',
  };

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
  };

  const cleanNumber = (str: string): string => {
    return str.replace(/[\s\u202F\u2009]/g, '');
  };

  const [inputValue, setInputValue] = useState(
    value === null || value === 0 ? '' : formatNumber(value)
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(value === null || value === 0 ? '' : formatNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === '') {
      setInputValue('');
      onChange(null);
      return;
    }

    if (!/^[0-9.,\s\u202F\u2009]*$/.test(val)) {
      return;
    }

    setInputValue(val);
    const cleanedVal = cleanNumber(val.replace(',', '.'));
    const numVal = parseFloat(cleanedVal);
    if (!isNaN(numVal)) {
      onChange(Math.max(0, numVal));
    }
  };

  const handleBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
    const cleanedVal = cleanNumber(inputValue.replace(',', '.'));
    if (inputValue === '' || isNaN(parseFloat(cleanedVal))) {
      setInputValue('');
      onChange(null);
    } else {
      const numVal = parseFloat(cleanedVal);
      setInputValue(formatNumber(numVal));
    }

    if (e) {
      // styles handled by Tailwind classes now
    }
  };

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
