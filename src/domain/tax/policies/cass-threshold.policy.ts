import { Money, Threshold } from '../value-objects';

export interface ThresholdSelection {
  selectedBase: Money;
  thresholdIndex: number;
  thresholdInMinWages: number | null;
  cappedByMax: boolean;
}

/**
 * CASS Threshold Policy
 *
 * Rules for CASS (Health Insurance Contribution):
 * 1. Employees/Pensioners below 6 minimum wages: EXEMPT (CASS = 0)
 * 2. Non-employees/Non-pensioners below 6 minimum wages: CASS on 6 minimum wages (fixed minimum)
 * 3. Everyone above 6 minimum wages: CASS on actual income (capped at 72 minimum wages)
 */
export class CASSThresholdPolicy {
  isExempt(
    isEmployee: boolean,
    isPensioner: boolean,
    netIncome: Money,
    minThreshold: Threshold
  ): boolean {
    if (!isEmployee && !isPensioner) {
      return false;
    }

    return minThreshold.isBelowBy(netIncome);
  }

  getExemptionReason(
    isEmployee: boolean,
    isPensioner: boolean,
    netIncome: Money,
    minThreshold: Threshold
  ): string | null {
    if (this.isExempt(isEmployee, isPensioner, netIncome, minThreshold)) {
      const status = isPensioner ? 'Pensioner' : 'Employee';
      return `${status} with income below ${minThreshold.toString()} - exempt from CASS`;
    }
    return null;
  }

  selectCalculationBase(
    netIncome: Money,
    isEmployee: boolean,
    isPensioner: boolean,
    thresholds: Threshold[],
    maxCap: Threshold | null
  ): ThresholdSelection {
    if (netIncome.isZero()) {
      return {
        selectedBase: Money.zero(),
        thresholdIndex: -1,
        thresholdInMinWages: null,
        cappedByMax: false,
      };
    }

    const minThreshold = thresholds[0];

    // Check if exempt (only employees/pensioners below minThreshold)
    if (this.isExempt(isEmployee, isPensioner, netIncome, minThreshold)) {
      return {
        selectedBase: Money.zero(),
        thresholdIndex: -1,
        thresholdInMinWages: null,
        cappedByMax: false,
      };
    }

    // For non-employees/non-pensioners below minThreshold:
    // CASS is calculated on the minThreshold (6 minimum wages), not actual income
    if (!isEmployee && !isPensioner && netIncome.isLessThan(minThreshold.toMoney())) {
      return {
        selectedBase: minThreshold.toMoney(),
        thresholdIndex: 0,
        thresholdInMinWages: minThreshold.getMultiplier(),
        cappedByMax: false,
      };
    }

    // For everyone else (or above minThreshold):
    // CASS is calculated on actual income (capped at maxCap)
    const cappedIncome = maxCap ? netIncome.min(maxCap.toMoney()) : netIncome;
    const isCapped = maxCap !== null && netIncome.isGreaterThan(maxCap.toMoney());

    return {
      selectedBase: cappedIncome,
      thresholdIndex: -1,
      thresholdInMinWages: null,
      cappedByMax: isCapped,
    };
  }
}
