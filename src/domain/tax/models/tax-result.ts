import { TaxInput } from './tax-input';
import { TaxBreakdown } from './tax-breakdown';

export interface ExplainStep {
  title: string;
  detail: string;
}

export class TaxResult {
  readonly input: TaxInput;
  readonly breakdown: TaxBreakdown;
  readonly steps: ExplainStep[];

  constructor(input: TaxInput, breakdown: TaxBreakdown, steps: ExplainStep[]) {
    this.input = input;
    this.breakdown = breakdown;
    this.steps = steps;
  }

  getEffectiveRate(): number | null {
    return this.breakdown.calculateEffectiveRate(this.input.grossIncome);
  }

  getTakeHome(): number {
    return this.breakdown.getNetAfterTaxes().toNumber();
  }

  getTotalTaxes(): number {
    return this.breakdown.getTotal().toNumber();
  }

  toPlainObject(): {
    input: ReturnType<TaxInput['toPlainObject']>;
    breakdown: ReturnType<TaxBreakdown['toPlainObject']>;
    steps: ExplainStep[];
  } {
    return {
      input: this.input.toPlainObject(),
      breakdown: this.breakdown.toPlainObject(this.input.grossIncome),
      steps: this.steps,
    };
  }

  hasTaxes(): boolean {
    return this.breakdown.getTotal().isPositive();
  }

  getSummary(): string {
    const effectiveRate = this.getEffectiveRate();
    const rateStr = effectiveRate !== null ? `${(effectiveRate * 100).toFixed(1)}%` : 'N/A';
    return `Total taxes: ${this.getTotalTaxes().toFixed(2)} RON (${rateStr} effective rate)`;
  }
}
