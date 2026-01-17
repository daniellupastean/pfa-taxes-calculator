import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TaxCalculationService, TaxInput } from '../../../domain';
import { getTaxRulesForYear } from '../../../data/tax-configurations';
import type { PlainTaxInput, PlainTaxResult } from '../../../domain/tax/models';
import {
  useSettings,
  useCurrency,
  useAdvancedConfig,
  type Currency,
} from '../../../shared/contexts';
import { CurrencySelectorInline } from '../../../shared/components/ui';

interface TaxRateChartProps {
  currentInput: PlainTaxInput;
}

export const TaxRateChart: React.FC<TaxRateChartProps> = ({ currentInput }) => {
  const { t } = useTranslation();
  const { selectedYear } = useSettings();
  const { convertFromRON, formatCurrency } = useCurrency();
  const {
    customMinWage,
    customCasThreshold1,
    customCasThreshold2,
    customCassMinThreshold,
    customCassMaxCap,
  } = useAdvancedConfig();

  // Instantiate service
  const taxService = useMemo(() => new TaxCalculationService(), []);

  const [chartCurrency, setChartCurrency] = useState<Currency>('RON');

  const [hoveredThreshold, setHoveredThreshold] = useState<{
    type: 'CASS' | 'CAS';
    value: number;
    label: string;
    x: number;
  } | null>(null);

  const currentRules = getTaxRulesForYear(selectedYear);

  const thresholds = useMemo(() => {
    return {
      cass: {
        minThreshold: customCassMinThreshold * customMinWage,
        maxCap: customCassMaxCap * customMinWage,
      },
      cas: {
        threshold1: customCasThreshold1 * customMinWage,
        threshold2: customCasThreshold2 * customMinWage,
      },
    };
  }, [
    customMinWage,
    customCasThreshold1,
    customCasThreshold2,
    customCassMinThreshold,
    customCassMaxCap,
  ]);

  const chartData = useMemo(() => {
    const maxIncome = 500000;
    const deductibleExpensesRate =
      currentInput.grossIncome > 0 ? currentInput.deductibleExpenses / currentInput.grossIncome : 0;
    const incomePoints: number[] = [];
    const criticalPoints = [
      0,
      thresholds.cass.minThreshold,
      thresholds.cas.threshold1,
      thresholds.cas.threshold2,
      thresholds.cass.maxCap,
      maxIncome,
    ].sort((a, b) => a - b);

    for (let i = 0; i < criticalPoints.length - 1; i++) {
      const start = criticalPoints[i];
      const end = criticalPoints[i + 1];
      const intervalSize = end - start;
      let pointsInInterval;
      if (intervalSize < 50000) {
        pointsInInterval = 50;
      } else if (intervalSize < 100000) {
        pointsInInterval = 40;
      } else {
        pointsInInterval = 30;
      }

      const step = intervalSize / pointsInInterval;

      for (let j = 0; j <= pointsInInterval; j++) {
        const income = start + j * step;
        if (!incomePoints.includes(income)) {
          incomePoints.push(income);
        }
      }
    }

    const uniquePoints = Array.from(new Set(incomePoints)).sort((a, b) => a - b);
    const data = uniquePoints.map((income) => {
      const deductibleExpenses = income * deductibleExpensesRate;

      const taxInput = TaxInput.create({
        ...currentInput,
        grossIncome: income,
        deductibleExpenses: deductibleExpenses,
        configOverrides: {
          minimumWageMonthly: customMinWage,
          casThresholds: [customCasThreshold1, customCasThreshold2],
          cassThresholds: [customCassMinThreshold],
          cassMaxCap: customCassMaxCap,
        },
      });

      const result = taxService.calculate(taxInput, currentRules).toPlainObject();

      const effectiveRate = income > 0 ? (result.breakdown.total / income) * 100 : 0;
      return {
        income,
        effectiveRate,
        total: result.breakdown.total,
      };
    });

    return data;
  }, [
    currentInput,
    currentRules,
    thresholds,
    customMinWage,
    customCasThreshold1,
    customCasThreshold2,
    customCassMinThreshold,
    customCassMaxCap,
    taxService,
  ]);

  const currentResult = useMemo<PlainTaxResult>(() => {
    const taxInput = TaxInput.create({
      ...currentInput,
      configOverrides: {
        minimumWageMonthly: customMinWage,
        casThresholds: [customCasThreshold1, customCasThreshold2],
        cassThresholds: [customCassMinThreshold],
        cassMaxCap: customCassMaxCap,
      },
    });
    return taxService.calculate(taxInput, currentRules).toPlainObject();
  }, [
    currentInput,
    currentRules,
    customMinWage,
    customCasThreshold1,
    customCasThreshold2,
    customCassMinThreshold,
    customCassMaxCap,
    taxService,
  ]);

  const currentEffectiveRate =
    currentInput.grossIncome > 0
      ? (currentResult.breakdown.total / currentInput.grossIncome) * 100
      : 0;

  const width = 900;
  const height = 600;
  const padding = { top: 40, right: 60, bottom: 70, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxIncome = 500000;
  const maxRate = 80;

  const scaleX = (incomeRON: number) => (incomeRON / maxIncome) * chartWidth;
  const scaleY = (rate: number) => chartHeight - (rate / maxRate) * chartHeight;

  const linePath = chartData
    .map((point, i) => {
      const x = scaleX(point.income);
      const y = scaleY(point.effectiveRate);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
  const currentX = scaleX(currentInput.grossIncome);
  const currentY = scaleY(currentEffectiveRate);

  return (
    <div
      className="rounded-xl p-6 border-glow card-hover animate-fade-up"
      style={{
        backgroundColor: 'var(--color-panel)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">{t('home.chart.title')}</h2>
        <div className="flex items-center gap-6">
          <CurrencySelectorInline value={chartCurrency} onChange={setChartCurrency} />
          <div className="text-right">
            <div
              className="text-3xl font-bold font-mono"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              {currentEffectiveRate.toFixed(1)}%
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {t('home.chart.currentRate')}
            </div>
          </div>
        </div>
      </div>

      <div className="relative" style={{ width: '100%' }}>
        <svg
          style={{ width: '100%', height: 'auto', display: 'block' }}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
              <stop offset="40%" stopColor="var(--color-accent-primary)" stopOpacity="0.4" />
              <stop offset="70%" stopColor="var(--color-accent-primary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
            </linearGradient>
            <clipPath id="chartClip">
              <rect x="0" y="0" width={chartWidth} height={chartHeight} />
            </clipPath>
            <mask id="fadeMask">
              <rect x="0" y="0" width={chartWidth} height={chartHeight} fill="white" />
              <rect
                x="0"
                y="0"
                width={chartWidth}
                height={chartHeight * 0.05}
                fill="url(#fadeGradient)"
              />
            </mask>
            <linearGradient id="fadeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
          </defs>

          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {Array.from({ length: Math.floor(maxRate / 10) + 1 }, (_, i) => i * 10).map((rate) => (
              <g key={rate}>
                <line
                  x1={0}
                  y1={scaleY(rate)}
                  x2={chartWidth}
                  y2={scaleY(rate)}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
                <text
                  x={-10}
                  y={scaleY(rate)}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="var(--color-text-muted)"
                  fontSize="16"
                  fontWeight="500"
                >
                  {rate}%
                </text>
              </g>
            ))}

            {/* Grid lines X - Venit brut */}
            {[0, 100000, 200000, 300000, 400000, 500000].map((incomeRON) => (
              <g key={incomeRON}>
                <line
                  x1={scaleX(incomeRON)}
                  y1={0}
                  x2={scaleX(incomeRON)}
                  y2={chartHeight}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
                <text
                  x={scaleX(incomeRON)}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fill="var(--color-text-muted)"
                  fontSize="16"
                  fontWeight="500"
                >
                  {formatCurrency(convertFromRON(incomeRON, chartCurrency), chartCurrency, {
                    compact: true,
                  })}
                </text>
              </g>
            ))}

            <path
              d={areaPath}
              fill="url(#areaGradient)"
              clipPath="url(#chartClip)"
              mask="url(#fadeMask)"
            />

            <path
              d={linePath}
              fill="none"
              stroke="var(--color-accent-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              clipPath="url(#chartClip)"
              mask="url(#fadeMask)"
            />

            {/* Praguri CASS - linii verticale cu hover (deasupra graficului) */}
            {/* CASS: Prag minim 6 salarii + Plafon maxim 72 salarii - toate verde */}
            {[
              {
                value: thresholds.cass.minThreshold,
                salaries: customCassMinThreshold,
                label: t('home.chart.thresholds.cassMin'),
              },
              {
                value: thresholds.cass.maxCap,
                salaries: customCassMaxCap,
                label: t('home.chart.thresholds.cassMax'),
              },
            ].map((threshold, idx) => {
              const x = scaleX(threshold.value);
              return (
                <g key={`cass-${idx}`}>
                  <line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={chartHeight}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                    opacity="0.6"
                  />
                  <rect
                    x={x - 10}
                    y={0}
                    width={20}
                    height={chartHeight}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => {
                      setHoveredThreshold({
                        type: 'CASS',
                        value: threshold.value,
                        label: `${threshold.label}: ${threshold.salaries} ${t('common.minimumSalaries')}`,
                        x: padding.left + x,
                      });
                    }}
                    onMouseLeave={() => setHoveredThreshold(null)}
                  />
                </g>
              );
            })}

            {[
              {
                value: thresholds.cas.threshold1,
                salaries: customCasThreshold1,
              },
              {
                value: thresholds.cas.threshold2,
                salaries: customCasThreshold2,
              },
            ].map((threshold, idx) => {
              const x = scaleX(threshold.value);
              return (
                <g key={`cas-${idx}`}>
                  <line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={chartHeight}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                    opacity="0.6"
                  />
                  <rect
                    x={x - 10}
                    y={0}
                    width={20}
                    height={chartHeight}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => {
                      setHoveredThreshold({
                        type: 'CAS',
                        value: threshold.value,
                        label: `${t('home.chart.thresholds.cas')}: ${threshold.salaries} ${t('common.minimumSalaries')}`,
                        x: padding.left + x,
                      });
                    }}
                    onMouseLeave={() => setHoveredThreshold(null)}
                  />
                </g>
              );
            })}

            {/* Current point */}
            {currentInput.grossIncome > 0 && currentInput.grossIncome <= maxIncome && (
              <>
                {/* Vertical line to point */}
                <line
                  x1={currentX}
                  y1={chartHeight}
                  x2={currentX}
                  y2={currentY}
                  stroke="var(--color-accent-secondary)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Point */}
                <circle
                  cx={currentX}
                  cy={currentY}
                  r="6"
                  fill="var(--color-accent-primary)"
                  stroke="var(--color-surface)"
                  strokeWidth="2"
                />
                {/* Label */}
                <g transform={`translate(${currentX}, ${currentY - 25})`}>
                  <rect
                    x="-50"
                    y="-24"
                    width="100"
                    height="28"
                    rx="6"
                    fill="var(--color-surface)"
                    stroke="var(--color-accent-primary)"
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    fill="var(--color-accent-primary)"
                    fontSize="20"
                    fontWeight="bold"
                  >
                    {currentEffectiveRate.toFixed(1)}%
                  </text>
                </g>
              </>
            )}

            {/* Axes */}
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="var(--color-text-secondary)"
              strokeWidth="2"
            />
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={chartHeight}
              stroke="var(--color-text-secondary)"
              strokeWidth="2"
            />
          </g>
        </svg>

        {/* Tooltip pentru praguri */}
        {hoveredThreshold && (
          <div
            style={{
              position: 'absolute',
              left: `${(hoveredThreshold.x / width) * 100}%`,
              top: '20px',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <div
              className="px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: `2px solid ${hoveredThreshold.type === 'CASS' ? '#10b981' : '#f59e0b'}`,
                color: 'var(--color-text-primary)',
              }}
            >
              <div className="font-semibold text-base">{hoveredThreshold.label}</div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {formatCurrency(
                  convertFromRON(hoveredThreshold.value, chartCurrency),
                  chartCurrency
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {currentInput.grossIncome > 0 && currentInput.grossIncome < thresholds.cass.minThreshold && (
        <div
          className="mt-4 p-4 rounded-lg text-sm"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>
            {t('home.chart.note.prefix')}
          </span>{' '}
          {t('home.chart.note.text', {
            amount: formatCurrency(
              convertFromRON(customCassMinThreshold * customMinWage, chartCurrency),
              chartCurrency
            ),
            cassMin: formatCurrency(
              convertFromRON(customCassMinThreshold * customMinWage * 0.1, chartCurrency),
              chartCurrency
            ),
          })}
        </div>
      )}
    </div>
  );
};
