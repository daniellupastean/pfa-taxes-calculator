import { useState, useMemo, useEffect } from 'react';
import {
  useCurrency,
  useSettings,
  useAdvancedConfig,
  type Currency,
} from '@shared/contexts';
import { TaxCalculationService, TaxInput } from '@domain';
import { getTaxRulesForYear } from '@data/tax-configurations';
import type { PlainTaxResult } from '@domain/tax/models';

export function useTaxCalculator() {
  const { selectedYear } = useSettings();
  const { inputCurrency, convertToRON, convertFromRON, convertBetweenCurrencies } = useCurrency();
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

  // Instantiate service
  const taxService = useMemo(() => new TaxCalculationService(), []);

  const [grossIncome, setGrossIncome] = useState<number | null>(null);
  const [deductibleExpenses, setDeductibleExpenses] = useState<number | null>(null);
  const [isEmployee, setIsEmployee] = useState<boolean>(false);
  const [isPensioner, setIsPensioner] = useState<boolean>(false);
  const [previousInputCurrency, setPreviousInputCurrency] = useState<Currency>(inputCurrency);

  const currentRules = useMemo(() => getTaxRulesForYear(selectedYear), [selectedYear]);

  useEffect(() => {
    resetToDefaults(selectedYear);
  }, [selectedYear, resetToDefaults]);

  useEffect(() => {
    if (previousInputCurrency !== inputCurrency) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGrossIncome((prevIncome) => {
        if (prevIncome === null) return null;
        const converted = convertBetweenCurrencies(
          prevIncome,
          previousInputCurrency,
          inputCurrency
        );
        return Math.round(converted);
      });

      setDeductibleExpenses((prevExpenses) => {
        if (prevExpenses === null) return null;
        const converted = convertBetweenCurrencies(
          prevExpenses,
          previousInputCurrency,
          inputCurrency
        );
        return Math.round(converted);
      });

      setPreviousInputCurrency(inputCurrency);
    }
  }, [inputCurrency, previousInputCurrency, convertBetweenCurrencies]);

  const taxResult = useMemo<PlainTaxResult>(() => {
    const grossIncomeRON = convertToRON(grossIncome ?? 0, inputCurrency);
    const deductibleExpensesRON = convertToRON(deductibleExpenses ?? 0, inputCurrency);

    const taxInput = TaxInput.create({
      year: selectedYear,
      grossIncome: grossIncomeRON,
      deductibleExpenses: deductibleExpensesRON,
      isVatPayer: false,
      isEmployee,
      isPensioner,
      configOverrides: {
        minimumWageMonthly: customMinWage,
        casThresholds: [customCasThreshold1, customCasThreshold2],
        cassThresholds: [customCassMinThreshold],
        cassMaxCap: customCassMaxCap,
      },
    });

    return taxService.calculate(taxInput, currentRules).toPlainObject();
  }, [
    selectedYear,
    grossIncome,
    deductibleExpenses,
    isEmployee,
    isPensioner,
    customMinWage,
    customCasThreshold1,
    customCasThreshold2,
    customCassMinThreshold,
    customCassMaxCap,
    currentRules,
    convertToRON,
    inputCurrency,
    taxService,
  ]);

  const handleLoadScenario = (result: PlainTaxResult) => {
    // Saved scenarios store values in RON - convert to current input currency
    const grossIncomeConverted =
      inputCurrency === 'RON'
        ? result.input.grossIncome
        : Math.round(convertFromRON(result.input.grossIncome, inputCurrency));
    const deductibleExpensesConverted =
      inputCurrency === 'RON'
        ? result.input.deductibleExpenses
        : Math.round(convertFromRON(result.input.deductibleExpenses, inputCurrency));

    setGrossIncome(grossIncomeConverted);
    setDeductibleExpenses(deductibleExpensesConverted);

    // Load employee/pensioner status
    setIsEmployee(result.input.isEmployee);
    setIsPensioner(result.input.isPensioner);

    if (result.input.configOverrides) {
      if (result.input.configOverrides.minimumWageMonthly) {
        setCustomMinWage(result.input.configOverrides.minimumWageMonthly);
      }
      if (result.input.configOverrides.casThresholds) {
        setCustomCasThreshold1(result.input.configOverrides.casThresholds[0]);
        setCustomCasThreshold2(result.input.configOverrides.casThresholds[1]);
      }
      if (result.input.configOverrides.cassThresholds) {
        setCustomCassMinThreshold(result.input.configOverrides.cassThresholds[0]);
      }
      if (result.input.configOverrides.cassMaxCap) {
        setCustomCassMaxCap(result.input.configOverrides.cassMaxCap);
      }
    }
  };

  return {
    inputs: {
      grossIncome,
      deductibleExpenses,
      isEmployee,
      isPensioner,
    },
    setters: {
      setGrossIncome,
      setDeductibleExpenses,
      setIsEmployee,
      setIsPensioner,
    },
    config: {
      customCassMinThreshold,
      customCassMaxCap,
    },
    result: taxResult,
    handlers: {
      handleLoadScenario,
    },
  };
}
