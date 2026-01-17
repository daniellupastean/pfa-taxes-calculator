import { Money } from '../value-objects';

export class TaxBreakdown {
  readonly netIncome: Money;
  readonly taxableIncome: Money;
  readonly incomeTax: Money;
  readonly casBase: Money;
  readonly cas: Money;
  readonly cassBase: Money;
  readonly cass: Money;

  constructor(
    netIncome: Money,
    taxableIncome: Money,
    incomeTax: Money,
    casBase: Money,
    cas: Money,
    cassBase: Money,
    cass: Money
  ) {
    this.netIncome = netIncome;
    this.taxableIncome = taxableIncome;
    this.incomeTax = incomeTax;
    this.casBase = casBase;
    this.cas = cas;
    this.cassBase = cassBase;
    this.cass = cass;
  }

  getTotal(): Money {
    return this.incomeTax.add(this.cas).add(this.cass);
  }

  getNetAfterTaxes(): Money {
    return this.netIncome.subtract(this.getTotal());
  }

  calculateEffectiveRate(grossIncome: Money): number | null {
    if (grossIncome.isZero()) {
      return null;
    }
    const total = this.getTotal();
    return total.divide(grossIncome.toNumber()).toNumber();
  }

  toPlainObject(grossIncome: Money): {
    netIncome: number;
    taxableIncome: number;
    incomeTax: number;
    casBase: number;
    cas: number;
    cassBase: number;
    cass: number;
    total: number;
    effectiveRate: number | null;
  } {
    const effectiveRate = this.calculateEffectiveRate(grossIncome);
    return {
      netIncome: this.netIncome.toNumber(),
      taxableIncome: this.taxableIncome.toNumber(),
      incomeTax: this.incomeTax.toNumber(),
      casBase: this.casBase.toNumber(),
      cas: this.cas.toNumber(),
      cassBase: this.cassBase.toNumber(),
      cass: this.cass.toNumber(),
      total: this.getTotal().toNumber(),
      effectiveRate: effectiveRate,
    };
  }

  getSummary(): {
    totalContributions: Money;
    totalTaxes: Money;
    totalDeductions: Money;
    takeHome: Money;
  } {
    return {
      totalContributions: this.cas.add(this.cass),
      totalTaxes: this.incomeTax,
      totalDeductions: this.getTotal(),
      takeHome: this.getNetAfterTaxes(),
    };
  }
}
