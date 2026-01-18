import type { TaxRules } from './types';
import { rules2024 } from './years/2024';
import { rules2025 } from './years/2025';
import { rules2026 } from './years/2026';
import { rules2027 } from './years/2027';

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

export interface AdvancedConfig {
  customMinWage: number;
  customCasThreshold1: number;
  customCasThreshold2: number;
  customCassMinThreshold: number;
  customCassMaxCap: number;
}

export function getDefaultAdvancedConfig(year: number): AdvancedConfig {
  const rules = getTaxRulesForYear(year);
  if (rules.casThresholds.length < 2 || rules.cassThresholds.length < 1) {
    throw new Error(`Missing thresholds in tax rules for year ${year}.`);
  }

  return {
    customMinWage: rules.minimumWageMonthly,
    customCasThreshold1: rules.casThresholds[0],
    customCasThreshold2: rules.casThresholds[1],
    customCassMinThreshold: rules.cassThresholds[0],
    customCassMaxCap: rules.cassMaxCap,
  };
}
