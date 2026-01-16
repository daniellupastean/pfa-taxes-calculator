import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption<T = string | number> {
  value: T;
  label: string;
}

interface SelectProps<T = string | number> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  helperText?: string;
  placeholder?: string;
}

export const Select = <T extends string | number>({
  label,
  value,
  onChange,
  options,
  helperText,
  placeholder = 'Select...',
}: SelectProps<T>): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="mb-5" ref={containerRef}>
      {label && (
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border-hover)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(251, 191, 36, 0.1)';
          }}
          onBlur={(e) => {
            if (!isOpen) {
              e.currentTarget.style.borderColor = 'var(--color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <span
            style={{
              color: selectedOption ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={20}
            style={{
              color: 'var(--color-accent-primary)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute z-50 w-full mt-2 rounded-lg overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(251, 191, 36, 0.1)',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {options.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="w-full px-4 py-3 text-left transition-all"
                style={{
                  backgroundColor:
                    option.value === value ? 'var(--color-accent-primary)' : 'transparent',
                  color: option.value === value ? '#000' : 'var(--color-text-primary)',
                  border: 'none',
                  cursor: 'pointer',
                  borderLeft: '3px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (option.value !== value) {
                    e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
                    e.currentTarget.style.borderLeftColor = 'var(--color-accent-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (option.value !== value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
          {helperText}
        </p>
      )}
    </div>
  );
};
