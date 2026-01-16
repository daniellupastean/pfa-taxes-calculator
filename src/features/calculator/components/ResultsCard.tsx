import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { PlainTaxBreakdown } from '../../../domain/tax/models';
import { Tooltip, CurrencySelectorInline, ToggleInline } from '../../../shared/components/ui';
import { useCurrency, useSettings } from '../../../shared/contexts';
import { CIMCalculationService } from '../../../domain/cim';

interface ResultsCardProps {
  breakdown: PlainTaxBreakdown;
  grossIncome: number;
  cassMinThreshold?: number;
  cassMaxCap?: number;
  isEmployee?: boolean;
  isPensioner?: boolean;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  breakdown,
  grossIncome,
  cassMinThreshold = 6,
  cassMaxCap = 72,
  isEmployee = false,
  isPensioner = false,
}) => {
  const { t } = useTranslation();
  const { resultCurrency, setResultCurrency, convertFromRON, formatCurrency } = useCurrency();
  const { showMonthlyView, setShowMonthlyView } = useSettings();
  const [showCIM, setShowCIM] = useState(false);

  // Calculate CIM breakdown for comparison
  const cimService = useMemo(() => new CIMCalculationService(), []);
  const cimBreakdown = useMemo(() => {
    const result = cimService.calculate({
      grossSalary: grossIncome,
      year: 2025,
    });
    return cimService.toPlainObject(result);
  }, [grossIncome, cimService]);

  const format = (amount: number) =>
    formatCurrency(convertFromRON(amount, resultCurrency), resultCurrency);

  const cassTooltipContent = (
    <div className="space-y-1.5">
      <div className="font-semibold" style={{ color: 'var(--color-accent-primary)' }}>
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
    <div
      className="rounded-xl p-6 mb-6 border-glow card-hover animate-fade-up"
      style={{ backgroundColor: 'var(--color-panel)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold gradient-text">{t('home.results.title')}</h2>
          <ToggleInline
            value={showCIM ? 'cim' : 'pfa'}
            onChange={(value) => setShowCIM(value === 'cim')}
            options={[
              { value: 'pfa', label: 'PFA' },
              { value: 'cim', label: 'CIM' },
            ]}
          />
        </div>
        <CurrencySelectorInline value={resultCurrency} onChange={setResultCurrency} />
      </div>

      <div className="space-y-4">
        {/* Net Income / Net Salary */}
        <div className="flex justify-between items-center">
          <Tooltip
            text={showCIM ? 'Salariu net după toate taxele' : t('home.results.netIncome.tooltip')}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {showCIM ? 'Salariu Net (CIM)' : t('home.results.netIncome.label')}
            </span>
          </Tooltip>
          <span
            className="font-mono font-semibold text-lg"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            {format(showCIM ? cimBreakdown.netSalary : breakdown.netIncome)}
          </span>
        </div>

        {/* CAS */}
        <div className="flex justify-between items-center">
          <Tooltip text={showCIM ? 'CAS: 25% din salariul brut' : t('home.results.cas.tooltip')}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('home.results.cas.label')}
              {!showCIM && breakdown.casBase > 0 && (
                <span
                  className="text-xs block font-mono mt-0.5"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t('home.results.cas.base')}: {format(breakdown.casBase)}
                </span>
              )}
            </span>
          </Tooltip>
          <span className="font-mono font-medium" style={{ color: 'var(--color-danger)' }}>
            {format(showCIM ? cimBreakdown.cas : breakdown.cas)}
          </span>
        </div>

        {/* CASS */}
        <div className="flex justify-between items-center">
          <Tooltip
            content={showCIM ? undefined : cassTooltipContent}
            text={showCIM ? 'CASS: 10% din salariul brut' : undefined}
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('home.results.cass.label')}
              {!showCIM && breakdown.cassBase > 0 && (
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
            {format(showCIM ? cimBreakdown.cass : breakdown.cass)}
          </span>
        </div>

        {/* Taxable Income / Personal Deduction (CIM only) */}
        {showCIM && (
          <div
            className="flex justify-between items-center pb-3 mt-2"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <Tooltip text="Deducere personală lunară × 12">
              <span
                className="text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Deducere Personală
              </span>
            </Tooltip>
            <span className="font-mono font-semibold" style={{ color: 'var(--color-success)' }}>
              {format(cimBreakdown.personalDeduction)}
            </span>
          </div>
        )}

        <div
          className="flex justify-between items-center pb-3 mt-2"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <Tooltip
            text={
              showCIM
                ? 'Bază impozabilă = Brut - CAS - CASS - Deducere personală'
                : t('home.results.taxableIncome.tooltip')
            }
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('home.results.taxableIncome.label')}
            </span>
          </Tooltip>
          <span className="font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {format(showCIM ? cimBreakdown.taxableIncome : breakdown.taxableIncome)}
          </span>
        </div>

        <div
          className="flex justify-between items-center pb-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <Tooltip text={t('home.results.incomeTax.tooltip')}>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              {t('home.results.incomeTax.label')}
            </span>
          </Tooltip>
          <span className="font-mono font-medium" style={{ color: 'var(--color-danger)' }}>
            {format(showCIM ? cimBreakdown.incomeTax : breakdown.incomeTax)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3">
          <Tooltip text={t('home.results.totalTaxes.tooltip')}>
            <span
              className="text-base font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {t('home.results.totalTaxes.label')}
            </span>
          </Tooltip>
          <span className="text-xl font-bold font-mono" style={{ color: 'var(--color-danger)' }}>
            {format(showCIM ? cimBreakdown.totalTaxes : breakdown.total)}
          </span>
        </div>

        <div className="pt-4 mt-4" style={{ borderTop: '2px solid var(--color-border)' }} />

        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <Tooltip text={t('home.results.netAfterTaxes.tooltip')}>
              <span
                className="text-base font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
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
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {showMonthlyView
                ? t('home.results.netAfterTaxes.monthlyDescription')
                : t('home.results.netAfterTaxes.annualDescription')}
            </span>
            <span
              className="text-3xl font-bold font-mono"
              style={{ color: 'var(--color-success)' }}
            >
              {format(
                showMonthlyView
                  ? (showCIM ? cimBreakdown.netSalary : breakdown.netIncome - breakdown.total) / 12
                  : showCIM
                    ? cimBreakdown.netSalary
                    : breakdown.netIncome - breakdown.total
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
