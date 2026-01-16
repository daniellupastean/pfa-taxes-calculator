import { Money } from './money';

export class Threshold {
  private readonly multiplier: number;
  private readonly minimumWage: Money;

  private constructor(multiplier: number, minimumWage: Money) {
    if (multiplier < 0) {
      throw new Error('Threshold multiplier cannot be negative');
    }
    this.multiplier = multiplier;
    this.minimumWage = minimumWage;
  }

  static from(multiplier: number, minimumWage: Money): Threshold {
    return new Threshold(multiplier, minimumWage);
  }

  toMoney(): Money {
    return this.minimumWage.multiply(this.multiplier);
  }

  getMultiplier(): number {
    return this.multiplier;
  }

  isExceededBy(amount: Money): boolean {
    return amount.isGreaterThanOrEqual(this.toMoney());
  }

  isBelowBy(amount: Money): boolean {
    return amount.isLessThan(this.toMoney());
  }

  toString(): string {
    return `${this.multiplier} minimum wages (${this.toMoney().toString()} RON)`;
  }

  equals(other: Threshold): boolean {
    return this.multiplier === other.multiplier && this.minimumWage.equals(other.minimumWage);
  }
}

export class ThresholdRange {
  private readonly lower: Threshold;
  private readonly upper: Threshold | null;

  private constructor(lower: Threshold, upper: Threshold | null) {
    this.lower = lower;
    this.upper = upper;
  }

  static between(lower: Threshold, upper: Threshold | null = null): ThresholdRange {
    return new ThresholdRange(lower, upper);
  }

  contains(amount: Money): boolean {
    const aboveLower = this.lower.isExceededBy(amount);
    const belowUpper = this.upper === null || this.upper.isBelowBy(amount);
    return aboveLower && belowUpper;
  }

  getLowerAmount(): Money {
    return this.lower.toMoney();
  }

  getUpperAmount(): Money | null {
    return this.upper?.toMoney() ?? null;
  }

  toString(): string {
    if (this.upper === null) {
      return `Above ${this.lower.toString()}`;
    }
    return `Between ${this.lower.toString()} and ${this.upper.toString()}`;
  }
}
