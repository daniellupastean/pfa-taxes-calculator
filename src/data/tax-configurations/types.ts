export interface TaxRules {
  year: number;
  minimumWageMonthly: number;
  rates: {
    incomeTax: number;
    cas: number;
    cass: number;
  };
  /** CAS thresholds in minimum wages (e.g., [12, 24]) */
  casThresholds: number[];
  /** CASS minimum threshold in minimum wages (e.g., [6]) */
  cassThresholds: number[];
  /** CASS maximum cap in minimum wages (e.g., 72) */
  cassMaxCap: number;
  rounding: {
    internalDecimals: number;
    displayRoundToLeu: boolean;
  };
}
