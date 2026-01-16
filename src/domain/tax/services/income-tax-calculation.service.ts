import { Money, TaxRate } from '../value-objects';

export interface IncomeTaxCalculationResult {
  taxableIncome: Money;
  amount: Money;
}

export class IncomeTaxCalculationService {
  calculate(netIncome: Money, cas: Money, cass: Money, rate: TaxRate): IncomeTaxCalculationResult {
    const taxableIncome = netIncome.subtract(cas).subtract(cass);
    const amount = rate.applyTo(taxableIncome).round();

    return {
      taxableIncome,
      amount,
    };
  }

  explain(result: IncomeTaxCalculationResult, rate: TaxRate): string {
    if (result.taxableIncome.isZero()) {
      return 'No taxable income - no income tax due';
    }

    return `Income tax: ${result.taxableIncome.toString()} RON × ${rate.toString()} = ${result.amount.toString()} RON`;
  }
}
