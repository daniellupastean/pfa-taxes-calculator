import React from 'react';
import type { TFunction } from 'i18next';
import type { Currency } from '@/shared/contexts';
import type { HoveredThreshold } from '../types';

interface ChartThresholdTooltipProps {
  hoveredThreshold: HoveredThreshold;
  width: number;
  effectiveContainerWidth: number;
  formatCurrency: (value: number, currency: Currency, options?: { compact?: boolean }) => string;
  convertFromRON: (value: number, currency: Currency) => number;
  chartCurrency: Currency;
  t: TFunction;
}

export const ChartThresholdTooltip: React.FC<ChartThresholdTooltipProps> = ({
  hoveredThreshold,
  width,
  effectiveContainerWidth,
  formatCurrency,
  convertFromRON,
  chartCurrency,
  t,
}) => {
  const getStyle = () => {
    let translateX = '-50%';
    let left = `${(hoveredThreshold.x / width) * 100}%`;
    const cssY = hoveredThreshold.cssY ?? 10;

    const pixelX = hoveredThreshold.x;
    const containerPixelWidth = effectiveContainerWidth;

    if (pixelX < 120) {
      translateX = '0%';
      left = `${((hoveredThreshold.x + 10) / width) * 100}%`;
    } else if (pixelX > containerPixelWidth - 120) {
      translateX = '-100%';
      left = `${((hoveredThreshold.x - 10) / width) * 100}%`;
    }

    return {
      position: 'absolute' as const,
      left,
      top: `${cssY - 15}px`,
      transform: `translate(${translateX}, -100%)`,
      pointerEvents: 'none' as const,
      zIndex: 30,
    };
  };

  return (
    <div style={getStyle()}>
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
              {hoveredThreshold.label}:
            </span>
            <span className="font-semibold text-sm">
              {hoveredThreshold.salaries} {t('common.minimumSalaries')}
            </span>
          </div>
          <div className="flex items-center justify-center border-t border-border/40 pt-1 mt-1">
            <span className="font-bold text-sm text-center" style={{ color: '#fbbf24' }}>
              {formatCurrency(convertFromRON(hoveredThreshold.value, chartCurrency), chartCurrency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
