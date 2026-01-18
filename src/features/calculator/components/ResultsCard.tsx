import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PlainTaxBreakdown } from '@/domain/tax/models';
import { Tooltip, CurrencySelectorInline, ToggleInline } from '@/shared/components/ui';
import { useCurrency, useSettings } from '@/shared/contexts';

interface ResultsCardProps {
  breakdown: PlainTaxBreakdown;
  cassMinThreshold?: number;
  cassMaxCap?: number;
  isEmployee?: boolean;
  isPensioner?: boolean;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  breakdown,
  cassMinThreshold = 6,
  cassMaxCap = 72,
  isEmployee = false,
  isPensioner = false,
}) => {
  const { t } = useTranslation();
  const { resultCurrency, setResultCurrency, convertFromRON, formatCurrency } = useCurrency();
  const { showMonthlyView, setShowMonthlyView } = useSettings();

  const format = (amount: number) =>
    formatCurrency(convertFromRON(amount, resultCurrency), resultCurrency);

  const cassTooltipContent = (
    <div className="space-y-1.5">
      <div className="font-semibold text-accent-primary">
        {t('home.results.cass.tooltip.title')}
      </div>
      {isEmployee || isPensioner ? (
        <>
          <div className="text-xs">{t('home.results.cass.tooltip.rulesEmployee')}</div>
          <div className="ml-2 space-y-0.5 text-xs">
            <div>
              • {t('common.below')} {cassMinThreshold} {t('common.salaries')} → 0{' '}
              {t('common.currency')} ({t('home.results.cass.tooltip.exempt')})
            </div>
            <div>
              • {t('common.above')} {cassMinThreshold} {t('common.salaries')} → 10%{' '}
              {t('common.fromRealNetIncome')}
            </div>
            <div>
              • {t('home.results.cass.tooltip.maxCap')}: {cassMaxCap} {t('common.minimumSalaries')}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-xs">{t('home.results.cass.tooltip.rulesNonEmployee')}</div>
          <div className="ml-2 space-y-0.5 text-xs">
            <div>
              • {t('common.below')} {cassMinThreshold} {t('common.salaries')} → {t('common.base')} ={' '}
              {cassMinThreshold} {t('common.salaries')} (minim fix)
            </div>
            <div>
              • {t('common.above')} {cassMinThreshold} {t('common.salaries')} → 10%{' '}
              {t('common.fromRealNetIncome')}
            </div>
            <div>
              • {t('home.results.cass.tooltip.maxCap')}: {cassMaxCap} {t('common.minimumSalaries')}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="rounded-xl p-6 mb-6 border-glow card-hover animate-fade-up bg-panel border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">{t('home.results.title')}</h2>
        <CurrencySelectorInline value={resultCurrency} onChange={setResultCurrency} />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Tooltip text={t('home.results.netIncome.tooltip')}>
            <span className="text-sm font-medium text-text-secondary">
              {t('home.results.netIncome.label')}
            </span>
          </Tooltip>
          <span className="font-mono font-semibold text-lg text-accent-primary">
            {format(breakdown.netIncome)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <Tooltip text={t('home.results.cas.tooltip')}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('home.results.cas.label')}
              {breakdown.casBase > 0 && (
                <span className="text-xs block font-mono mt-0.5 text-text-muted">
                  {t('home.results.cas.base')}: {format(breakdown.casBase)}
                </span>
              )}
            </span>
          </Tooltip>
          <span className="font-mono font-medium text-danger">{format(breakdown.cas)}</span>
        </div>

        <div className="flex justify-between items-center">
          <Tooltip content={cassTooltipContent}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('home.results.cass.label')}
              {breakdown.cassBase > 0 && (
                <span
                  className="text-xs block font-mono mt-0.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('home.results.cass.base')}: {format(breakdown.cassBase)}
                </span>
              )}
            </span>
          </Tooltip>
          <span className="font-mono font-medium" style={{ color: 'var(--color-danger)' }}>
            {format(breakdown.cass)}
          </span>
        </div>

        <div className="flex justify-between items-center pb-3 mt-2 border-b border-border">
          <Tooltip text={t('home.results.taxableIncome.tooltip')}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('home.results.taxableIncome.label')}
            </span>
          </Tooltip>
          <span className="font-mono font-semibold text-text-primary">
            {format(breakdown.taxableIncome)}
          </span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-border">
          <Tooltip text={t('home.results.incomeTax.tooltip')}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('home.results.incomeTax.label')}
            </span>
          </Tooltip>
          <span className="font-mono font-medium" style={{ color: 'var(--color-danger)' }}>
            {format(breakdown.incomeTax)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3">
          <Tooltip text={t('home.results.totalTaxes.tooltip')}>
            <span className="text-base font-semibold text-text-primary">
              {t('home.results.totalTaxes.label')}
            </span>
          </Tooltip>
          <span className="text-xl font-bold font-mono text-danger">{format(breakdown.total)}</span>
        </div>

        <div className="pt-2 mt-2 border-t-2 border-border" />

        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <Tooltip text={t('home.results.netAfterTaxes.tooltip')}>
              <span className="text-base font-semibold text-text-primary">
                {t('home.results.netAfterTaxes.label')}
              </span>
            </Tooltip>

            <ToggleInline
              value={showMonthlyView}
              onChange={setShowMonthlyView}
              options={[
                { value: false, label: t('home.results.viewToggle.annual') },
                { value: true, label: t('home.results.viewToggle.monthly') },
              ]}
            />
          </div>

          <div className="flex justify-between items-end">
            <span className="text-xs text-text-muted">
              {showMonthlyView
                ? t('home.results.netAfterTaxes.monthlyDescription')
                : t('home.results.netAfterTaxes.annualDescription')}
            </span>
            <span className="text-3xl font-bold font-mono text-success">
              {format(
                showMonthlyView
                  ? (breakdown.netIncome - breakdown.total) / 12
                  : breakdown.netIncome - breakdown.total
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
