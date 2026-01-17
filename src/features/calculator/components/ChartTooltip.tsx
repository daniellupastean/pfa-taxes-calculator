import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Currency } from '../../../shared/contexts';

interface ChartTooltipProps {
    income: number;
    effectiveRate: number;
    total: number;
    formatCurrency: (amount: number, currency: Currency) => string;
    currency: Currency;
    x: number;
    y: number;
    containerWidth?: number;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
    income,
    effectiveRate,
    total,
    formatCurrency,
    currency,
    x,
    y,
    containerWidth = 900,
}) => {
    const { t } = useTranslation();

    // Smart positioning to keep tooltip within bounds
    let translateX = '-50%';
    let left = `${x}px`;

    // If close to left edge (e.g. < 120px), anchor left
    if (x < 120) {
        translateX = '0%';
        left = `${x + 10}px`; // Add small offset
    }
    // If close to right edge, anchor right
    else if (containerWidth && x > containerWidth - 120) {
        translateX = '-100%';
        left = `${x - 10}px`; // Add small offset
    }

    return (
        <div
            style={{
                position: 'absolute',
                left,
                top: `${y - 15}px`, // Move slightly up
                transform: `translate(${translateX}, -100%)`,
                pointerEvents: 'none',
                zIndex: 40,
            }}
        >
            <div
                className="px-4 py-3 rounded-xl shadow-2xl text-sm whitespace-nowrap bg-opacity-95 backdrop-blur-md"
                style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                }}
            >
                <div className="space-y-2">
                    {/* Income Row */}
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold leading-tight">
                            {t('home.chart.tooltip.income')}
                        </span>
                        <span className="font-bold text-lg leading-tight" style={{ color: 'var(--color-accent-primary)' }}>
                            {formatCurrency(income, currency)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-2 mt-2">
                        {/* Rate Column */}
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold leading-tight">
                                {t('home.chart.tooltip.rate')}
                            </span>
                            <span className="font-mono font-bold text-sm">
                                {effectiveRate.toFixed(1)}%
                            </span>
                        </div>

                        {/* Taxes Column */}
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold leading-tight">
                                {t('home.chart.tooltip.taxes')}
                            </span>
                            <span className="font-mono font-bold text-sm">
                                {formatCurrency(total, currency)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
