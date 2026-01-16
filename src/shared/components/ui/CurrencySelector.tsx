import React from 'react';
import { useCurrency, type Currency } from '../../contexts';

export const CurrencySelector: React.FC = () => {
  const { resultCurrency, setResultCurrency } = useCurrency();

  const currencies: Currency[] = ['RON', 'EUR', 'USD'];

  return (
    <div
      className="flex items-center gap-1 p-1 rounded-lg"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {currencies.map((curr) => (
        <button
          key={curr}
          onClick={() => setResultCurrency(curr)}
          className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
          style={{
            backgroundColor:
              resultCurrency === curr ? 'var(--color-accent-primary)' : 'transparent',
            color: resultCurrency === curr ? '#000' : 'var(--color-text-secondary)',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            if (resultCurrency !== curr) {
              e.currentTarget.style.backgroundColor = 'var(--color-surface)';
            }
          }}
          onMouseLeave={(e) => {
            if (resultCurrency !== curr) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          title={`Switch to ${curr}`}
        >
          {curr}
        </button>
      ))}
    </div>
  );
};
