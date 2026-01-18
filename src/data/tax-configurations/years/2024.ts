/**
 * Tax rules for Romanian PFA 2024 (real taxation system)
 */

import type { TaxRules } from '../types';

export const rules2024: TaxRules = {
  year: 2024,
  minimumWageMonthly: 3300,

  rates: {
    incomeTax: 0.1,
    cas: 0.25,
    cass: 0.1,
  },

  casThresholds: [12, 24],
  cassThresholds: [6],
  cassMaxCap: 24,

  rounding: {
    internalDecimals: 2,
    displayRoundToLeu: true,
  },
};
