/**
 * Tax rules for Romanian PFA 2027 (real taxation system)
 *
 * Note: Minimum wage increased by 275 RON from July 1, 2026.
 * For 2027, we use the value of 4325 RON.
 */

import type { TaxRules } from '../types';

export const rules2027: TaxRules = {
  year: 2027,
  minimumWageMonthly: 4325,

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
