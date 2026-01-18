import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getTaxRulesForYear } from '@/data/tax-configurations';
import { TaxCalculationService, TaxInput } from '@/domain';
import type { PlainTaxInput, PlainTaxResult } from '@/domain/tax/models';
import { CurrencySelectorInline } from '@/shared/components/ui';
import {
  useAdvancedConfig,
  useCurrency,
  useSettings,
  type Currency,
} from '@/shared/contexts';
import { useTaxChartData, useTaxChartScale } from '../hooks';
import type { HoveredDataPoint, HoveredThreshold } from '../types';
import { ChartAxes } from './ChartAxes';
import { ChartCurrentPoint } from './ChartCurrentPoint';
import { ChartThresholdLine } from './ChartThresholdLine';
import { ChartThresholdTooltip } from './ChartThresholdTooltip';
import { ChartTooltip } from './ChartTooltip';
import { ChartZoneBackground } from './ChartZoneBackground';

interface TaxRateChartProps {
  currentInput: PlainTaxInput;
}

export const TaxRateChart: React.FC<TaxRateChartProps> = ({ currentInput }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
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

  const currentRules = useMemo(() => getTaxRulesForYear(selectedYear), [selectedYear]);
  const thresholds = useMemo(
    () => ({
      cass: {
        minThreshold: currentRules.cassThresholds[0] * currentRules.minimumWageMonthly,
        maxCap: currentRules.cassMaxCap * currentRules.minimumWageMonthly,
      },
      cas: {
        threshold1: currentRules.casThresholds[0] * currentRules.minimumWageMonthly,
        threshold2: currentRules.casThresholds[1] * currentRules.minimumWageMonthly,
      },
    }),
    [currentRules]
  );
  const { maxIncome } = useTaxChartScale({
    currentIncome: currentInput.grossIncome,
    defaultMaxIncome: 500000,
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
  const [hoveredDataPoint, setHoveredDataPoint] = useState<HoveredDataPoint | null>(null);
  const [chartCurrency, setChartCurrency] = useState<Currency>('RON');
  const [hoveredThreshold, setHoveredThreshold] = useState<HoveredThreshold | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateWidth = () => {
      setContainerWidth(element.getBoundingClientRect().width);
    };

    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => updateWidth());
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

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
  const minIncomeForScale = Math.max(customMinWage * customCassMinThreshold, 1);

  const width = 900;
  const height = 600;
  const effectiveContainerWidth = containerWidth || width;
  const padding = { top: 40, right: 60, bottom: 70, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxRate = useMemo(() => {
    let max = 60; // Default visualization limit
    const shouldScaleFromCurrent = currentInput.grossIncome >= minIncomeForScale;

    // Only scale up if the CURRENT rate is higher than default and in a stable range.
    // We intentionally ignore spikes at very low income to keep the chart readable.
    if (shouldScaleFromCurrent && currentEffectiveRate > max) {
      max = currentEffectiveRate;
    }

    // Never scale beyond 150%
    max = Math.min(max, 150);

    return Math.ceil(max / 10) * 10;
  }, [currentEffectiveRate, currentInput.grossIncome, minIncomeForScale]);

  const scaleX = useCallback(
    (incomeRON: number) => (incomeRON / maxIncome) * chartWidth,
    [maxIncome, chartWidth]
  );
  const scaleY = useCallback(
    (rate: number) => chartHeight - (rate / maxRate) * chartHeight,
    [chartHeight, maxRate]
  );

  const linePath = chartData
    .map(
      (point, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(point.income)} ${scaleY(point.effectiveRate)}`
    )
    .join(' ');

  const fillLinePath = chartData
    .map((point, i) => {
      const clampedRate = Math.min(point.effectiveRate, maxRate);
      return `${i === 0 ? 'M' : 'L'} ${scaleX(point.income)} ${scaleY(clampedRate)}`;
    })
    .join(' ');

  const areaPath = `${fillLinePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

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

    if (chartX < 0 || chartX > chartWidth || chartY < 0 || chartY > chartHeight) {
      setHoveredDataPoint(null);
      return;
    }

    const incomeThreshold = (chartX / chartWidth) * maxIncome;
    const closestPoint = chartData.reduce((prev, curr) =>
      Math.abs(curr.income - incomeThreshold) < Math.abs(prev.income - incomeThreshold)
        ? curr
        : prev
    );

    const pointX = scaleX(closestPoint.income);
    const pointY = scaleY(closestPoint.effectiveRate);

    // Euclidean distance check to ensure we are close to the line (e.g. within 20px)
    const dist = Math.sqrt(Math.pow(chartX - pointX, 2) + Math.pow(chartY - pointY, 2));

    if (dist > 15) {
      setHoveredDataPoint(null);
      return;
    }

    // Get CSS coordinates for tooltip
    const rect = containerRef.current.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    setHoveredDataPoint({
      point: closestPoint,
      x: pointX + padding.left, // SVG x for circle
      y: pointY + padding.top, // SVG y for circle
      cssX, // CSS x for tooltip
      cssY, // CSS y for tooltip
    });
  };

  const zones = useMemo(
    () => [
      {
        start: 0,
        end: thresholds.cass.minThreshold,
        color: '#10b981',
        opacity: 0.1,
        label: t('home.chart.zones.cassOptional'),
      },
      {
        start: thresholds.cass.minThreshold,
        end: thresholds.cas.threshold1,
        color: '#34d399',
        opacity: 0.2,
        label: t('home.chart.zones.cassRequired'),
      },
      {
        start: thresholds.cas.threshold1,
        end: thresholds.cas.threshold2,
        color: '#fbbf24',
        opacity: 0.2,
        label: t('home.chart.zones.casRequired'),
      },
      {
        start: thresholds.cas.threshold2,
        end: thresholds.cass.maxCap,
        color: '#f87171',
        opacity: 0.2,
        label: t('home.chart.zones.cassFull'),
      },
      {
        start: thresholds.cass.maxCap,
        end: maxIncome,
        color: '#10b981',
        opacity: 0.1,
        label: t('home.chart.zones.cassCapped'),
      },
    ],
    [thresholds, maxIncome, t]
  );

  return (
    <div
      className="rounded-xl p-6 border-glow card-hover animate-fade-up relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-panel)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Standard Header: Consistent with TaxForm */}
      <div className="flex flex-col md:flex-row items-start md:items-start justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold gradient-text">{t('home.chart.title')}</h2>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <CurrencySelectorInline value={chartCurrency} onChange={setChartCurrency} />
        </div>
      </div>

      <div ref={containerRef} className="relative w-full overflow-visible">
        <div className="relative w-full overflow-visible">
          <svg
            className={`w-full h-auto block select-none ${
              hoveredThreshold || hoveredDataPoint ? 'cursor-pointer' : 'cursor-default'
            }`}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredDataPoint(null)}
          >
            <defs>
              <linearGradient
                id="areaGradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2={chartHeight}
              >
                <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.9" />
                <stop offset="30%" stopColor="var(--color-accent-primary)" stopOpacity="0.5" />
                <stop offset="70%" stopColor="var(--color-accent-primary)" stopOpacity="0.15" />
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
              {Array.from({ length: Math.floor(maxRate / 10) + 1 }, (_, i) => i * 10).map(
                (rate) => (
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
                      fontSize="14"
                      fontWeight="500"
                    >
                      {rate}%
                    </text>
                  </g>
                )
              )}

              {/* Grid lines X */}
              {Array.from({ length: 6 }, (_, i) => (i * maxIncome) / 5).map((incomeRON) => (
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
                    y={chartHeight + 25}
                    textAnchor="middle"
                    fill="var(--color-text-muted)"
                    fontSize="14"
                    fontWeight="500"
                  >
                    {formatCurrency(convertFromRON(incomeRON, chartCurrency), chartCurrency, {
                      compact: true,
                    })}
                  </text>
                </g>
              ))}

              {/* PFA Area & Line */}
              <path
                d={areaPath}
                fill="url(#areaGradient)"
                clipPath="url(#chartClip)"
                opacity="0.6"
              />
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-accent-primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                clipPath="url(#chartClip)"
              />
              {/* Interactive area for tooltip with pointer cursor */}
              <path
                d={linePath}
                fill="none"
                strokeWidth="20"
                stroke="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                pointerEvents="stroke"
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
              />

              {/* Axes */}
              <ChartAxes chartWidth={chartWidth} chartHeight={chartHeight} />

              {/* Current point */}
              <ChartCurrentPoint
                currentX={currentX}
                currentY={currentY}
                chartHeight={chartHeight}
                currentEffectiveRate={currentEffectiveRate}
                maxIncome={maxIncome}
                grossIncome={currentInput.grossIncome}
              />

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
            </g>
          </svg>

          {/* Threshold Tooltip */}
          {hoveredThreshold && (
            <ChartThresholdTooltip
              hoveredThreshold={hoveredThreshold}
              width={width}
              effectiveContainerWidth={effectiveContainerWidth}
              formatCurrency={formatCurrency}
              convertFromRON={convertFromRON}
              chartCurrency={chartCurrency}
              t={t}
            />
          )}

          {/* Data Point Tooltip */}
          {hoveredDataPoint && !hoveredThreshold && (
            <ChartTooltip
              income={hoveredDataPoint.point.income}
              effectiveRate={hoveredDataPoint.point.effectiveRate}
              formatCurrency={formatCurrency}
              currency={chartCurrency}
              x={hoveredDataPoint.cssX}
              y={hoveredDataPoint.cssY}
              containerWidth={effectiveContainerWidth}
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
              <span className="font-bold" style={{ color: '#10b981' }}>
                {t('home.chart.note.prefix')}
              </span>{' '}
              {t('home.chart.note.text', {
                amount: formatCurrency(
                  convertFromRON(thresholds.cass.minThreshold, chartCurrency),
                  chartCurrency
                ),
                cassMin: formatCurrency(
                  convertFromRON(thresholds.cass.minThreshold * 0.1, chartCurrency),
                  chartCurrency
                ),
              })}
            </div>
          )}
      </div>
    </div>
  );
};
