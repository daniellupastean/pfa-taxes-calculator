// Value Objects
export { Money, TaxRate, Threshold, ThresholdRange } from './value-objects';

// Models
export {
  TaxInput,
  TaxBreakdown,
  TaxResult,
  type TaxConfigOverrides,
  type ExplainStep,
  type PlainTaxInput,
  type PlainTaxBreakdown,
  type PlainTaxResult,
} from './models';

// Services
export { TaxCalculationService } from './services';

// Policies (exported for advanced usage)
export { CASExemptionPolicy, CASSThresholdPolicy, type ThresholdSelection } from './policies';

// Formatters (exported for advanced usage)
export { TaxExplainFormatter } from './formatters';
