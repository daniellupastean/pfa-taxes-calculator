import { useState, useEffect, useCallback } from 'react';

interface UseNumericInputOptions {
  formatThousands?: boolean;
}

interface UseNumericInputResult {
  inputValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
}

export function parseLocaleNumber(value: string, cleanThousands = false): number | null {
  let cleaned = value.replace(',', '.');
  if (cleanThousands) {
    cleaned = cleaned.replace(/[\s\u202F\u2009]/g, '');
  }
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : Math.max(0, num);
}

export function formatThousands(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');
}

export function useNumericInput(
  value: number | null,
  onChange: (value: number | null) => void,
  options: UseNumericInputOptions = {}
): UseNumericInputResult {
  const { formatThousands: shouldFormat = false } = options;

  const formatValue = useCallback(
    (val: number | null): string => {
      if (val === null || val === 0) return '';
      return shouldFormat ? formatThousands(val) : val.toString();
    },
    [shouldFormat]
  );

  const [inputValue, setInputValue] = useState(() => formatValue(value));

  useEffect(() => {
    setInputValue(formatValue(value));
  }, [value, formatValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;

      if (val === '') {
        setInputValue('');
        onChange(null);
        return;
      }

      const validPattern = shouldFormat ? /^[0-9.,\s\u202F\u2009]*$/ : /^[0-9.,]*$/;

      if (!validPattern.test(val)) {
        return;
      }

      setInputValue(val);
      const numVal = parseLocaleNumber(val, shouldFormat);
      if (numVal !== null) {
        onChange(numVal);
      }
    },
    [onChange, shouldFormat]
  );

  const handleBlur = useCallback(() => {
    const numVal = parseLocaleNumber(inputValue, shouldFormat);
    if (numVal === null) {
      setInputValue('');
      onChange(null);
    } else {
      setInputValue(formatValue(numVal));
    }
  }, [inputValue, onChange, formatValue, shouldFormat]);

  return { inputValue, handleChange, handleBlur };
}
