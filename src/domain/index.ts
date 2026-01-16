// Main domain exports
export * from './tax';

// Backward compatibility adapter
// This allows old code to continue working while we migrate
import { TaxCalculationService } from './tax';
import { TaxInput } from './tax';
import type { TaxRules } from '../tax-rules';

/**
 * Backward compatibility function
 * Wraps the new TaxCalculationService to match the old API
 */
export function computeTaxes(
  input: {
    year: number;
    grossIncome: number;
    deductibleExpenses: number;
    isVatPayer: boolean;
    isEmployee: boolean;
    isPensioner: boolean;
    configOverrides?: {
      minimumWageMonthly?: number;
      casThresholds?: number[];
      cassThresholds?: number[];
      cassMaxCap?: number;
    };
  },
  rules: TaxRules
): {
  input: ReturnType<TaxInput['toPlainObject']>;
  breakdown: {
    netIncome: number;
    taxableIncome: number;
    incomeTax: number;
    casBase: number;
    cas: number;
    cassBase: number;
    cass: number;
    total: number;
    effectiveRate: number | null;
  };
  steps: Array<{ title: string; detail: string }>;
} {
  const service = new TaxCalculationService();
  const taxInput = TaxInput.create(input);
  const result = service.calculate(taxInput, rules);
  return result.toPlainObject();
}
