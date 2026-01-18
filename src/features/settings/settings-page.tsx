import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency, useSettings, useAdvancedConfig } from '@/shared/contexts';
import { availableYears, getTaxRulesForYear } from '@/data/tax-configurations';
import { ArrowLeft, RotateCcw, TrendingUp } from 'lucide-react';
import { MoneyInput, NumberInput, Select, IconButton } from '@/shared/components/ui';
import { TopNavigation, Footer } from '@/shared/components/layout';
import { formatLeiRounded } from '@/lib/format';

export const SettingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { rates, lastUpdate } = useCurrency();
  const { selectedYear, setSelectedYear } = useSettings();
  const {
    customMinWage,
    setCustomMinWage,
    customCasThreshold1,
    setCustomCasThreshold1,
    customCasThreshold2,
    setCustomCasThreshold2,
    customCassMinThreshold,
    setCustomCassMinThreshold,
    customCassMaxCap,
    setCustomCassMaxCap,
    resetToDefaults,
  } = useAdvancedConfig();

  const currentRules = getTaxRulesForYear(selectedYear);

  return (
    <div className="min-h-screen grid-overlay bg-void">
      <TopNavigation
        title={t('settings.title')}
        leftAction={<IconButton icon={<ArrowLeft />} onClick={() => navigate('/')} size={24} />}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Fiscal year selection */}
          <div className="rounded-xl p-6 border-glow bg-panel border border-border">
            <h2 className="text-xl font-bold mb-4 gradient-text">
              {t('settings.fiscalYear.title')}
            </h2>
            <Select
              label={t('settings.fiscalYear.label')}
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
              options={availableYears.map((year) => ({
                value: year,
                label: String(year),
              }))}
            />
          </div>

          {/* Exchange rates snapshot */}
          <div className="rounded-xl p-6 border-glow bg-panel border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold gradient-text">
                {t('settings.exchangeRates.title')}
              </h2>
              {lastUpdate && (
                <span className="text-xs text-text-muted">
                  {t('settings.exchangeRates.updated')}:{' '}
                  {new Date(lastUpdate).toLocaleDateString('ro-RO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg p-4 bg-surface border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">1 EUR =</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-text-primary">
                    {rates.EUR.toFixed(4)}
                  </span>
                  <span className="text-sm text-text-muted">RON</span>
                </div>
              </div>

              <div className="rounded-lg p-4 bg-surface border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-accent-primary" />
                  <span className="text-sm font-medium text-text-secondary">1 USD =</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-text-primary">
                    {rates.USD.toFixed(4)}
                  </span>
                  <span className="text-sm text-text-muted">RON</span>
                </div>
              </div>
            </div>

            {/* Exchange rate sources */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-center text-text-muted">
                {t('settings.exchangeRates.source')}:{' '}
                <a
                  href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors text-accent-secondary hover:text-accent-primary"
                  title={t('settings.exchangeRates.ecbTitle')}
                >
                  {t('settings.exchangeRates.ecbName')}
                </a>
                {' · '}
                via{' '}
                <a
                  href="https://www.frankfurter.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors text-accent-secondary hover:text-accent-primary"
                >
                  Frankfurter API
                </a>
              </p>
            </div>
          </div>

          {/* Advanced overrides */}
          <div className="rounded-xl p-6 border-glow bg-panel border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold gradient-text">{t('settings.advanced.title')}</h2>
              <button
                onClick={() => resetToDefaults(selectedYear)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-surface border border-border text-text-secondary hover:border-accent-secondary hover:text-accent-secondary hover:-translate-y-px hover:shadow-lg cursor-pointer"
                title={t('settings.advanced.resetTooltip')}
              >
                <RotateCcw size={16} />
                <span>{t('settings.advanced.resetButton')}</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Minimum wage override */}
              <div className="rounded-lg p-5 bg-surface border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 rounded-full bg-accent-primary" />
                  <h3 className="text-base font-semibold text-text-primary">
                    {t('settings.advanced.minimumWage.title')}{' '}
                    <span className="text-text-muted">
                      {t('settings.advanced.minimumWage.subtitle')}
                    </span>
                  </h3>
                </div>
                <MoneyInput
                  currency="fixed-RON"
                  label=""
                  value={customMinWage}
                  onChange={(value) => setCustomMinWage(value ?? currentRules.minimumWageMonthly)}
                  helperText={
                    t('settings.advanced.minimumWage.default', {
                      year: selectedYear,
                    }) + `: ${formatLeiRounded(currentRules.minimumWageMonthly)}`
                  }
                  placeholder={currentRules.minimumWageMonthly.toString()}
                />
              </div>

              {/* CAS thresholds override */}
              <div className="rounded-lg p-5 bg-surface border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 rounded-full bg-accent-secondary" />
                  <h3 className="text-base font-semibold text-text-primary">
                    {t('settings.advanced.cas.title')}
                  </h3>
                </div>
                <p className="text-xs mb-4 text-text-muted">
                  {t('settings.advanced.cas.description')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <NumberInput
                      label=""
                      value={customCasThreshold1}
                      onChange={(value) => setCustomCasThreshold1(value ?? 12)}
                      suffix={t('common.minimumSalaries')}
                      helperText={`${t('settings.advanced.cas.minimum')}: ${formatLeiRounded(customCasThreshold1 * customMinWage)}`}
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <NumberInput
                      label=""
                      value={customCasThreshold2}
                      onChange={(value) => setCustomCasThreshold2(value ?? 24)}
                      suffix={t('common.minimumSalaries')}
                      helperText={`${t('settings.advanced.cas.maximum')}: ${formatLeiRounded(customCasThreshold2 * customMinWage)}`}
                      placeholder="24"
                    />
                  </div>
                </div>
              </div>

              {/* CASS thresholds override */}
              <div className="rounded-lg p-5 bg-surface border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 rounded-full bg-emerald-500" />
                  <h3 className="text-base font-semibold text-text-primary">
                    {t('settings.advanced.cass.title')}
                  </h3>
                </div>
                <p className="text-xs mb-4 text-text-muted">
                  {t('settings.advanced.cass.description')}
                </p>

                {/* Minimum CASS threshold */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-text-secondary">
                      {t('settings.advanced.cass.minThreshold')}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <NumberInput
                    label=""
                    value={customCassMinThreshold}
                    onChange={(value) => setCustomCassMinThreshold(value ?? 6)}
                    suffix={t('common.minimumSalaries')}
                    helperText={`${t('settings.advanced.cass.minThresholdHelper')}: ${formatLeiRounded(customCassMinThreshold * customMinWage)}`}
                    placeholder="6"
                  />
                </div>

                {/* Maximum CASS cap */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-text-secondary">
                      {t('settings.advanced.cass.maxCap')}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <NumberInput
                    label=""
                    value={customCassMaxCap}
                    onChange={(value) => setCustomCassMaxCap(value ?? 72)}
                    suffix={t('common.minimumSalaries')}
                    helperText={`${t('settings.advanced.cass.limit')}: ${formatLeiRounded(customCassMaxCap * customMinWage)}`}
                    placeholder="72"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
