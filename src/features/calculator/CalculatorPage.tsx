import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Settings, BookOpen } from 'lucide-react';
import { TopNavigation, Footer } from '@shared/components/layout';
import { IconButton } from '@shared/components/ui';
import { TaxForm, ResultsCard, ScenariosPanel } from './components';
import { TaxRateChart } from './chart';
import { useTaxCalculator } from './hooks/useTaxCalculator';

export const CalculatorPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { inputs, setters, config, result, handlers } = useTaxCalculator();

  return (
    <div className="min-h-screen grid-overlay flex flex-col bg-void">
      <TopNavigation
        title={t('navigation.title')}
        subtitle={t('navigation.subtitle')}
        rightActions={
          <>
            <IconButton
              icon={<BookOpen />}
              onClick={() => navigate('/blog')}
              title={t('navigation.blog')}
            />
            <IconButton
              icon={<Settings />}
              onClick={() => navigate('/settings')}
              title={t('navigation.settings')}
            />
          </>
        }
      />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TaxForm
              grossIncome={inputs.grossIncome}
              deductibleExpenses={inputs.deductibleExpenses}
              isEmployee={inputs.isEmployee}
              isPensioner={inputs.isPensioner}
              onGrossIncomeChange={setters.setGrossIncome}
              onDeductibleExpensesChange={setters.setDeductibleExpenses}
              onIsEmployeeChange={setters.setIsEmployee}
              onIsPensionerChange={setters.setIsPensioner}
            />

            <ScenariosPanel currentResult={result} onLoadScenario={handlers.handleLoadScenario} />
          </div>

          <div className="space-y-6">
            <ResultsCard
              breakdown={result.breakdown}
              cassMinThreshold={config.customCassMinThreshold}
              cassMaxCap={config.customCassMaxCap}
              isEmployee={inputs.isEmployee}
              isPensioner={inputs.isPensioner}
            />
            <TaxRateChart currentInput={result.input} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
