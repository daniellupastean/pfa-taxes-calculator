/**
 * Tax rules for Romanian PFA 2025 (real taxation system)
 */

import type { TaxRules } from './types';

export const rules2025: TaxRules = {
  year: 2025,
  minimumWageMonthly: 4050,

  rates: {
    incomeTax: 0.1,
    cas: 0.25,
    cass: 0.1,
  },

  casThresholds: [12, 24],
  cassThresholds: [6],
  cassMaxCap: 72,

  rounding: {
    internalDecimals: 2,
    displayRoundToLeu: true,
  },
};
