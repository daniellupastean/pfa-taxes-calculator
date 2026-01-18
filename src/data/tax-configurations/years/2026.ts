/**
 * Tax rules for Romanian PFA 2026 (real taxation system)
 *
 * Note: Minimum wage increases to 4325 RON from July 1, 2026.
 */

import type { TaxRules } from '../types';

export const rules2026: TaxRules = {
  year: 2026,
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
