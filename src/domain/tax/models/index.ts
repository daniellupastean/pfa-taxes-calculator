export { TaxInput, type TaxConfigOverrides } from './tax-input';
export { TaxBreakdown } from './tax-breakdown';
export { TaxResult, type ExplainStep } from './tax-result';

import type { TaxInput } from './tax-input';
import type { ExplainStep } from './tax-result';

export type PlainTaxInput = ReturnType<TaxInput['toPlainObject']>;
export type PlainTaxBreakdown = {
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
export type PlainTaxResult = {
  input: PlainTaxInput;
  breakdown: PlainTaxBreakdown;
  steps: ExplainStep[];
};
