import { Money } from './money';

export class TaxRate {
  private readonly rate: number;

  private constructor(rate: number) {
    if (rate < 0 || rate > 1) {
      throw new Error('Tax rate must be between 0 and 1');
    }
    this.rate = rate;
  }

  static fromDecimal(rate: number): TaxRate {
    return new TaxRate(rate);
  }

  static fromPercentage(percentage: number): TaxRate {
    return new TaxRate(percentage / 100);
  }

  applyTo(amount: Money): Money {
    return amount.multiply(this.rate);
  }

  toDecimal(): number {
    return this.rate;
  }

  toPercentage(): number {
    return this.rate * 100;
  }

  toString(): string {
    return `${this.toPercentage()}%`;
  }

  isZero(): boolean {
    return this.rate === 0;
  }

  equals(other: TaxRate): boolean {
    return this.rate === other.rate;
  }
}
