import { Money, TaxRate, Threshold } from '../value-objects';
import { CASSThresholdPolicy, type ThresholdSelection } from '../policies';

export interface CASSCalculationResult {
  base: Money;
  amount: Money;
  isExempt: boolean;
  exemptionReason: string | null;
  selection: ThresholdSelection;
}

export class CASSCalculationService {
  private readonly thresholdPolicy: CASSThresholdPolicy;

  constructor() {
    this.thresholdPolicy = new CASSThresholdPolicy();
  }

  calculate(
    netIncome: Money,
    isEmployee: boolean,
    isPensioner: boolean,
    thresholds: number[],
    maxCap: number,
    minimumWage: Money,
    rate: TaxRate
  ): CASSCalculationResult {
    const thresholdObjects = thresholds.map((t) => Threshold.from(t, minimumWage));
    const maxCapThreshold = Threshold.from(maxCap, minimumWage);
    const minThreshold = thresholdObjects[0];

    if (this.thresholdPolicy.isExempt(isEmployee, isPensioner, netIncome, minThreshold)) {
      return {
        base: Money.zero(),
        amount: Money.zero(),
        isExempt: true,
        exemptionReason: this.thresholdPolicy.getExemptionReason(
          isEmployee,
          isPensioner,
          netIncome,
          minThreshold
        ),
        selection: {
          selectedBase: Money.zero(),
          thresholdIndex: -1,
          thresholdInMinWages: null,
          cappedByMax: false,
        },
      };
    }

    const selection = this.thresholdPolicy.selectCalculationBase(
      netIncome,
      isEmployee,
      isPensioner,
      thresholdObjects,
      maxCapThreshold
    );

    const amount = rate.applyTo(selection.selectedBase).round();

    return {
      base: selection.selectedBase,
      amount,
      isExempt: false,
      exemptionReason: null,
      selection,
    };
  }

  explain(result: CASSCalculationResult, isEmployee: boolean, isPensioner: boolean): string {
    if (result.isExempt) {
      return result.exemptionReason || 'Exempt from CASS';
    }

    const status = isPensioner ? 'pensioner' : isEmployee ? 'employee' : 'non-employee';
    let explanation = `CASS (${status}): `;

    if (result.selection.cappedByMax) {
      explanation += `Income capped at maximum (${result.base.toString()} RON)`;
    } else if (result.selection.thresholdInMinWages !== null) {
      explanation += `Based on ${result.selection.thresholdInMinWages} minimum wages threshold`;
    } else {
      explanation += `Based on actual income`;
    }

    explanation += ` = ${result.amount.toString()} RON`;

    return explanation;
  }
}
