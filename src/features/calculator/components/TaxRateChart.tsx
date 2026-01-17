import React, { useMemo, useState, useCallback, useRef } from 'react';
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
import { useTaxChartData, type ChartDataPoint } from '../hooks/useTaxChartData';
import { useTaxChartScale } from '../hooks/useTaxChartScale';
import { ChartTooltip } from './ChartTooltip';
import { ChartThresholdLine } from './ChartThresholdLine';
import { ChartZoneBackground } from './ChartZoneBackground';

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

  const taxService = useMemo(() => new TaxCalculationService(), []);
  const [chartCurrency, setChartCurrency] = useState<Currency>('RON');
  const [hoveredThreshold, setHoveredThreshold] = useState<{
    type: 'CASS' | 'CAS';
    value: number;
    label: string;
    x: number;
  } | null>(null);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{
    point: ChartDataPoint;
    x: number;
    y: number;
    cssX: number;
    cssY: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentRules = getTaxRulesForYear(selectedYear);

  const thresholds = useMemo(() => ({
    cass: {
      minThreshold: customCassMinThreshold * customMinWage,
      maxCap: customCassMaxCap * customMinWage,
    },
    cas: {
      threshold1: customCasThreshold1 * customMinWage,
      threshold2: customCasThreshold2 * customMinWage,
    },
  }), [customMinWage, customCasThreshold1, customCasThreshold2, customCassMinThreshold, customCassMaxCap]);

  const { maxIncome } = useTaxChartScale({
    currentIncome: currentInput.grossIncome,
  });

  const chartData = useTaxChartData({
    currentInput,
    currentRules,
    maxIncome,
    thresholds,
    customMinWage,
    customCasThreshold1,
    customCasThreshold2,
    customCassMinThreshold,
    customCassMaxCap,
    taxService,
  });

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
  }, [currentInput, currentRules, customMinWage, customCasThreshold1, customCasThreshold2, customCassMinThreshold, customCassMaxCap, taxService]);

  const currentEffectiveRate = currentInput.grossIncome > 0
    ? (currentResult.breakdown.total / currentInput.grossIncome) * 100
    : 0;

  const width = 900;
  const height = 600;
  const padding = { top: 40, right: 60, bottom: 70, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxRate = useMemo(() => {
    let max = 60; // Default visualization limit

    // Only scale up if the CURRENT rate is higher than default.
    // We intentionally ignore spikes in chartData (e.g. at low income) 
    // to keep the chart readable for the relevant range.
    if (currentEffectiveRate > max) {
      max = currentEffectiveRate;
    }

    // Never scale beyond 150%
    max = Math.min(max, 150);

    return Math.ceil(max / 10) * 10;
  }, [currentEffectiveRate]);

  const scaleX = useCallback((incomeRON: number) => (incomeRON / maxIncome) * chartWidth, [maxIncome, chartWidth]);
  const scaleY = useCallback((rate: number) => chartHeight - (rate / maxRate) * chartHeight, [chartHeight, maxRate]);

  const linePath = chartData
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(point.income)} ${scaleY(point.effectiveRate)}`)
    .join(' ');

  const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  const currentX = scaleX(currentInput.grossIncome);
  const currentY = scaleY(currentEffectiveRate);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const localPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const chartX = localPt.x - padding.left;
    const chartY = localPt.y - padding.top;

    if (chartX < 0 || chartX > chartWidth) {
      setHoveredDataPoint(null);
      return;
    }

    const incomeThreshold = (chartX / chartWidth) * maxIncome;
    const closestPoint = chartData.reduce((prev, curr) =>
      Math.abs(curr.income - incomeThreshold) < Math.abs(prev.income - incomeThreshold) ? curr : prev
    );

    const pointX = scaleX(closestPoint.income);
    const pointY = scaleY(closestPoint.effectiveRate);

    // Euclidean distance check to ensure we are close to the line (e.g. within 30px)
    const dist = Math.sqrt(Math.pow(chartX - pointX, 2) + Math.pow(chartY - pointY, 2));

    if (dist > 50) { // 50px threshold for easier grabbing but strict enough
      setHoveredDataPoint(null);
      return;
    }

    // Get CSS coordinates for tooltip
    const rect = containerRef.current.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    setHoveredDataPoint({
      point: closestPoint,
      x: localPt.x, // SVG x for circle
      y: localPt.y, // SVG y for circle
      cssX,         // CSS x for tooltip
      cssY,         // CSS y for tooltip
    });
  };

  const zones = useMemo(() => [
    { start: 0, end: thresholds.cass.minThreshold, color: '#10b981', opacity: 0.1, label: t('home.chart.zones.cassOptional') },
    { start: thresholds.cass.minThreshold, end: thresholds.cas.threshold1, color: '#34d399', opacity: 0.2, label: t('home.chart.zones.cassRequired') },
    { start: thresholds.cas.threshold1, end: thresholds.cas.threshold2, color: '#fbbf24', opacity: 0.2, label: t('home.chart.zones.casRequired') },
    { start: thresholds.cas.threshold2, end: thresholds.cass.maxCap, color: '#f87171', opacity: 0.2, label: t('home.chart.zones.cassFull') },
    { start: thresholds.cass.maxCap, end: maxIncome, color: '#10b981', opacity: 0.1, label: t('home.chart.zones.cassCapped') },
  ], [thresholds, maxIncome, t]);

  return (
    <div
      className="rounded-xl p-6 border-glow card-hover animate-fade-up relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-panel)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Standard Header: Consistent with TaxForm */}
      < div className="flex flex-col md:flex-row items-start md:items-start justify-between mb-6 gap-4" >
        <h2 className="text-2xl font-bold gradient-text">{t('home.chart.title')}</h2>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <CurrencySelectorInline value={chartCurrency} onChange={setChartCurrency} />
        </div>



      </div >

      <div ref={containerRef} className="relative w-full overflow-visible">

        <div className="relative w-full overflow-visible">
          <svg
            className="w-full h-auto block select-none"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredDataPoint(null)}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.6" />
                <stop offset="40%" stopColor="var(--color-accent-primary)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
              </linearGradient>
              <clipPath id="chartClip">
                <rect x="0" y="0" width={chartWidth} height={chartHeight} rx="4" />
              </clipPath>
            </defs>

            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {/* Extremely Subtile Background Zones */}
              <g opacity="0.4">
                <ChartZoneBackground zones={zones} scaleX={scaleX} chartHeight={chartHeight} />
              </g>

              {/* Grid lines Y */}
              {Array.from({ length: Math.floor(maxRate / 10) + 1 }, (_, i) => i * 10).map((rate) => (
                <g key={rate}>
                  <line
                    x1={0} y1={scaleY(rate)} x2={chartWidth} y2={scaleY(rate)}
                    stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"
                  />
                  <text
                    x={-10} y={scaleY(rate)} textAnchor="end" dominantBaseline="middle"
                    fill="var(--color-text-muted)" fontSize="14" fontWeight="500"
                  >
                    {rate}%
                  </text>
                </g>
              ))}

              {/* Grid lines X */}
              {Array.from({ length: 6 }, (_, i) => (i * maxIncome) / 5).map((incomeRON) => (
                <g key={incomeRON}>
                  <line
                    x1={scaleX(incomeRON)} y1={0} x2={scaleX(incomeRON)} y2={chartHeight}
                    stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"
                  />
                  <text
                    x={scaleX(incomeRON)} y={chartHeight + 25} textAnchor="middle"
                    fill="var(--color-text-muted)" fontSize="14" fontWeight="500"
                  >
                    {formatCurrency(convertFromRON(incomeRON, chartCurrency), chartCurrency, { compact: true })}
                  </text>
                </g>
              ))}



              {/* PFA Area & Line */}
              <path d={areaPath} fill="url(#areaGradient)" clipPath="url(#chartClip)" opacity="0.6" />
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-accent-primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath="url(#chartClip)"
              />



              {/* Threshold Lines */}
              <ChartThresholdLine
                x={scaleX(thresholds.cass.minThreshold)}
                chartHeight={chartHeight}
                color="#10b981"
                label={t('home.chart.thresholds.cassMin')}
                value={thresholds.cass.minThreshold}
                salaries={customCassMinThreshold}
                type="CASS"
                onHover={setHoveredThreshold}
                padding={padding}
                t={t}
              />
              <ChartThresholdLine
                x={scaleX(thresholds.cass.maxCap)}
                chartHeight={chartHeight}
                color="#10b981"
                label={t('home.chart.thresholds.cassMax')}
                value={thresholds.cass.maxCap}
                salaries={customCassMaxCap}
                type="CASS"
                onHover={setHoveredThreshold}
                padding={padding}
                t={t}
              />
              <ChartThresholdLine
                x={scaleX(thresholds.cas.threshold1)}
                chartHeight={chartHeight}
                color="#f59e0b"
                label={t('home.chart.thresholds.cas')}
                value={thresholds.cas.threshold1}
                salaries={customCasThreshold1}
                type="CAS"
                onHover={setHoveredThreshold}
                padding={padding}
                t={t}
              />
              <ChartThresholdLine
                x={scaleX(thresholds.cas.threshold2)}
                chartHeight={chartHeight}
                color="#f59e0b"
                label={t('home.chart.thresholds.cas')}
                value={thresholds.cas.threshold2}
                salaries={customCasThreshold2}
                type="CAS"
                onHover={setHoveredThreshold}
                padding={padding}
                t={t}
              />

              {/* Current point */}
              {currentInput.grossIncome > 0 && currentInput.grossIncome <= maxIncome && (
                <g className="transition-all duration-300">
                  <line
                    x1={currentX} y1={chartHeight} x2={currentX} y2={currentY}
                    stroke="var(--color-accent-secondary)" strokeWidth="2" strokeDasharray="4 4"
                  />
                  <circle
                    cx={currentX} cy={currentY} r="6"
                    fill="var(--color-accent-primary)" stroke="var(--color-surface)" strokeWidth="3"
                    className="animate-pulse-slow"
                  />
                  <rect
                    x={currentX - 45}
                    y={currentY - 55} // Higher up
                    width="90"
                    height="40" // Taller
                    rx="10"
                    fill="var(--color-surface)"
                    stroke="var(--color-border)"
                    strokeWidth="2"
                    className="shadow-lg"
                  />
                  <text
                    x={currentX}
                    y={currentY - 33} // Centered in rect
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xl"
                    fill="var(--color-text-primary)"
                    style={{ fontWeight: 500 }}
                  >
                    {(Math.round(currentEffectiveRate * 10) / 10).toFixed(1)}%
                  </text>
                </g>
              )}

              {/* Hovered point indicator */}
              {hoveredDataPoint && (
                <circle
                  cx={hoveredDataPoint.x - padding.left}
                  cy={hoveredDataPoint.y - padding.top}
                  r="5"
                  fill="var(--color-accent-primary)"
                  opacity="0.5"
                />
              )}

              {/* Axes */}
              <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="var(--color-text-secondary)" strokeWidth="2" />
              <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="var(--color-text-secondary)" strokeWidth="2" />
            </g>
          </svg>

          {/* Threshold Tooltip */}
          {hoveredThreshold && (
            <div
              style={{
                position: 'absolute',
                left: `${(hoveredThreshold.x / width) * 100}%`,
                top: '10px',
                transform: 'translateX(-50%)',
                pointerEvents: 'none',
                zIndex: 30,
              }}
            >
              <div
                className="px-4 py-2 rounded-lg shadow-2xl text-sm whitespace-nowrap bg-opacity-90 backdrop-blur-md"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: `2px solid ${hoveredThreshold.type === 'CASS' ? '#10b981' : '#f59e0b'}`,
                  color: 'var(--color-text-primary)',
                }}
              >
                <div className="font-bold text-sm uppercase tracking-wider">{hoveredThreshold.label}</div>
                <div className="text-base font-mono mt-1">
                  {formatCurrency(convertFromRON(hoveredThreshold.value, chartCurrency), chartCurrency)}
                </div>
              </div>
            </div>
          )}

          {/* Data Point Tooltip */}
          {hoveredDataPoint && !hoveredThreshold && (
            <ChartTooltip
              income={hoveredDataPoint.point.income}
              effectiveRate={hoveredDataPoint.point.effectiveRate}
              total={hoveredDataPoint.point.total}
              formatCurrency={formatCurrency}
              currency={chartCurrency}
              x={hoveredDataPoint.cssX}
              y={hoveredDataPoint.cssY}
              containerWidth={containerRef.current?.getBoundingClientRect().width || 0}
            />
          )}
        </div>

        {currentInput.grossIncome > 0 &&
          currentInput.grossIncome < thresholds.cass.minThreshold &&
          !currentInput.isEmployee &&
          !currentInput.isPensioner && (
            <div
              className="mt-6 p-4 rounded-xl text-sm bg-opacity-50 backdrop-blur-sm border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
            >
              <span className="font-bold" style={{ color: '#10b981' }}>{t('home.chart.note.prefix')}</span>{' '}
              {t('home.chart.note.text', {
                amount: formatCurrency(convertFromRON(thresholds.cass.minThreshold, chartCurrency), chartCurrency),
                cassMin: formatCurrency(convertFromRON(thresholds.cass.minThreshold * 0.1, chartCurrency), chartCurrency),
              })}
            </div>
          )}
      </div>
    </div >
  );
};
