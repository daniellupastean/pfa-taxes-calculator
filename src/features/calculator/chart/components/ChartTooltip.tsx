import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Currency } from '@shared/contexts';

interface ChartTooltipProps {
  income: number;
  effectiveRate: number;
  formatCurrency: (amount: number, currency: Currency) => string;
  convertFromRON: (value: number, currency: Currency) => number;
  currency: Currency;
  x: number;
  y: number;
  containerWidth?: number;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  income,
  effectiveRate,
  formatCurrency,
  convertFromRON,
  currency,
  x,
  y,
  containerWidth = 900,
}) => {
  const { t } = useTranslation();

  // Keep the tooltip within the chart bounds.
  let translateX = '-50%';
  let left = `${x}px`;

  // Anchor to the left when near the left edge.
  if (x < 120) {
    translateX = '0%';
    left = `${x + 10}px`; // Nudge away from the cursor.
  }
  // Anchor to the right when near the right edge.
  else if (containerWidth && x > containerWidth - 120) {
    translateX = '-100%';
    left = `${x - 10}px`; // Nudge away from the cursor.
  }

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: `${y - 15}px`, // Lift above the cursor.
        transform: `translate(${translateX}, -100%)`,
        pointerEvents: 'none',
        zIndex: 40,
      }}
    >
      <div
        className="px-3 py-2 rounded-lg shadow-lg text-sm bg-opacity-95 backdrop-blur-sm"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          minWidth: 'max-content',
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-wide font-semibold opacity-75">
              {t('home.chart.tooltip.income')}
            </span>
            <span className="font-semibold text-sm">
              {formatCurrency(convertFromRON(income, currency), currency)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-1 mt-1">
            <span className="text-xs uppercase tracking-wide font-semibold opacity-75">
              {t('home.chart.tooltip.rate')}
            </span>
            <span className="font-bold text-sm" style={{ color: '#fbbf24' }}>
              {effectiveRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
