import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings, useCurrency } from '../../../shared/contexts';
import { Card, MoneyInput, CurrencySelectorInline } from '../../../shared/components/ui';

interface TaxFormProps {
  grossIncome: number | null;
  deductibleExpenses: number | null;
  isEmployee: boolean;
  isPensioner: boolean;
  onGrossIncomeChange: (value: number | null) => void;
  onDeductibleExpensesChange: (value: number | null) => void;
  onIsEmployeeChange: (value: boolean) => void;
  onIsPensionerChange: (value: boolean) => void;
}

export const TaxForm: React.FC<TaxFormProps> = ({
  grossIncome,
  deductibleExpenses,
  isEmployee,
  isPensioner,
  onGrossIncomeChange,
  onDeductibleExpensesChange,
  onIsEmployeeChange,
  onIsPensionerChange,
}) => {
  const { t } = useTranslation();
  const { selectedYear } = useSettings();
  const { inputCurrency, setInputCurrency } = useCurrency();

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">{t('home.inputSection.title')}</h2>
        <CurrencySelectorInline value={inputCurrency} onChange={setInputCurrency} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MoneyInput
          label={t('home.inputSection.grossIncome.label')}
          value={grossIncome}
          onChange={onGrossIncomeChange}
          helperText={t('home.inputSection.grossIncome.helper', { year: selectedYear })}
        />

        <MoneyInput
          label={t('home.inputSection.deductibleExpenses.label')}
          value={deductibleExpenses}
          onChange={onDeductibleExpensesChange}
          helperText={t('home.inputSection.deductibleExpenses.helper')}
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEmployee}
            onChange={(e) => onIsEmployeeChange(e.target.checked)}
            className="mr-3 h-4 w-4 rounded"
            style={{
              accentColor: 'var(--color-accent-primary)',
            }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {t('home.inputSection.employee.label')}
          </span>
        </label>
        <p className="text-xs mt-1 ml-7" style={{ color: 'var(--color-text-muted)' }}>
          {t('home.inputSection.employee.helper', { threshold: 6 })}
        </p>
      </div>

      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPensioner}
            onChange={(e) => onIsPensionerChange(e.target.checked)}
            className="mr-3 h-4 w-4 rounded"
            style={{
              accentColor: 'var(--color-accent-primary)',
            }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {t('home.inputSection.pensioner.label')}
          </span>
        </label>
        <p className="text-xs mt-1 ml-7" style={{ color: 'var(--color-text-muted)' }}>
          {t('home.inputSection.pensioner.helper', { threshold: 6 })}
        </p>
      </div>
    </Card>
  );
};
