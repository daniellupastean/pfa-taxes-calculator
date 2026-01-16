/**
 * Index for all Romanian PFA tax rules
 */

import { rules2024 } from './2024';
import { rules2025 } from './2025';
import { rules2026 } from './2026';
import { rules2027 } from './2027';
import type { TaxRules } from './types';

export type { TaxRules };

export const taxRulesByYear: Record<number, TaxRules> = {
  2024: rules2024,
  2025: rules2025,
  2026: rules2026,
  2027: rules2027,
};

export const availableYears = Object.keys(taxRulesByYear).map(Number).sort();
export const defaultYear = 2026;

export function getTaxRulesForYear(year: number): TaxRules {
  const rules = taxRulesByYear[year];
  if (!rules) {
    throw new Error(
      `No tax rules available for year ${year}. Available years: ${availableYears.join(', ')}`
    );
  }
  return rules;
}

export { rules2024, rules2025, rules2026, rules2027 };
