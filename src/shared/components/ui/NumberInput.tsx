import React from 'react';
import { useNumericInput } from '@lib';

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
  const { inputValue, handleChange, handleBlur } = useNumericInput(value, onChange);

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleBlur();
    e.target.style.borderColor = 'var(--color-border)';
    e.target.style.boxShadow = 'none';
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
          onBlur={handleInputBlur}
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
