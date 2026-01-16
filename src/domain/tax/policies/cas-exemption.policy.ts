import { Money, Threshold } from '../value-objects';

export class CASExemptionPolicy {
  isExempt(isPensioner: boolean, netIncome: Money, threshold: Threshold): boolean {
    if (isPensioner) {
      return true;
    }

    if (threshold.isBelowBy(netIncome)) {
      return true;
    }

    return false;
  }

  getExemptionReason(isPensioner: boolean, netIncome: Money, threshold: Threshold): string | null {
    if (isPensioner) {
      return 'Pensioner - exempt from CAS';
    }

    if (threshold.isBelowBy(netIncome)) {
      return `Net income below ${threshold.toString()} - exempt from CAS`;
    }

    return null;
  }

  selectApplicableThreshold(netIncome: Money, thresholds: Threshold[]): Threshold | null {
    const sorted = [...thresholds].sort((a, b) => b.getMultiplier() - a.getMultiplier());

    for (const threshold of sorted) {
      if (threshold.isExceededBy(netIncome)) {
        return threshold;
      }
    }

    return null;
  }
}
