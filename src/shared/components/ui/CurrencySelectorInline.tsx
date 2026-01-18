import React from 'react';
import type { Currency } from '../../contexts';
import { ToggleInline } from './ToggleInline';

interface CurrencySelectorInlineProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export const CurrencySelectorInline: React.FC<CurrencySelectorInlineProps> = ({
  value,
  onChange,
}) => {
  const options = (['RON', 'EUR', 'USD'] as Currency[]).map((curr) => ({
    value: curr,
    label: curr,
  }));

  return <ToggleInline value={value} onChange={onChange} options={options} />;
};
