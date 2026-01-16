import { Money, TaxRate, Threshold } from '../value-objects';
import { CASExemptionPolicy } from '../policies';

export interface CASCalculationResult {
  base: Money;
  amount: Money;
  isExempt: boolean;
  exemptionReason: string | null;
}

export class CASCalculationService {
  private readonly exemptionPolicy: CASExemptionPolicy;

  constructor() {
    this.exemptionPolicy = new CASExemptionPolicy();
  }

  calculate(
    netIncome: Money,
    isPensioner: boolean,
    thresholds: number[],
    minimumWage: Money,
    rate: TaxRate
  ): CASCalculationResult {
    const threshold1 = Threshold.from(thresholds[0], minimumWage);
    const threshold2 = Threshold.from(thresholds[1], minimumWage);

    if (this.exemptionPolicy.isExempt(isPensioner, netIncome, threshold1)) {
      return {
        base: Money.zero(),
        amount: Money.zero(),
        isExempt: true,
        exemptionReason: this.exemptionPolicy.getExemptionReason(
          isPensioner,
          netIncome,
          threshold1
        ),
      };
    }

    let base: Money;
    if (netIncome.isLessThan(threshold2.toMoney())) {
      base = threshold1.toMoney();
    } else {
      base = threshold2.toMoney();
    }

    const amount = rate.applyTo(base).round();

    return {
      base,
      amount,
      isExempt: false,
      exemptionReason: null,
    };
  }

  explain(result: CASCalculationResult): string {
    if (result.isExempt) {
      return result.exemptionReason || 'Exempt from CAS';
    }

    return `CAS calculated on base of ${result.base.toString()} RON = ${result.amount.toString()} RON`;
  }
}
