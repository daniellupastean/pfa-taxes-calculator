import React, { useState, useEffect } from 'react';

interface NumberInputProps {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  helperText?: string;
  suffix?: string;
  placeholder?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  helperText,
  suffix,
  placeholder = '0',
}) => {
  const [inputValue, setInputValue] = useState(
    value === null || value === 0 ? '' : value.toString()
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInputValue(value === null || value === 0 ? '' : value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === '') {
      setInputValue('');
      onChange(null);
      return;
    }

    if (!/^[0-9.,]*$/.test(val)) {
      return;
    }

    setInputValue(val);

    const numVal = parseFloat(val.replace(',', '.'));
    if (!isNaN(numVal)) {
      onChange(Math.max(0, numVal));
    }
  };

  const handleBlur = (e?: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue === '' || isNaN(parseFloat(inputValue.replace(',', '.')))) {
      setInputValue('');
      onChange(null);
    } else {
      const numVal = parseFloat(inputValue.replace(',', '.'));
      setInputValue(numVal.toString());
    }

    if (e) {
      e.target.style.borderColor = 'var(--color-border)';
      e.target.style.boxShadow = 'none';
    }
  };

  return (
    <div className="mb-5">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all font-mono"
          style={{
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            paddingRight: suffix ? '140px' : '16px',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-accent-primary)';
            e.target.style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.1)';
          }}
        />
        {suffix && (
          <span
            className="absolute right-4 top-3 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {suffix}
          </span>
        )}
      </div>
      {helperText && (
        <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {helperText}
        </p>
      )}
    </div>
  );
};
