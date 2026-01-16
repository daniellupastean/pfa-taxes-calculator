export class Money {
  private readonly amount: number;

  private constructor(amount: number) {
    if (!Number.isFinite(amount)) {
      throw new Error('Money amount must be a finite number');
    }
    this.amount = amount;
  }

  static from(amount: number): Money {
    return new Money(Math.max(0, amount));
  }

  static exact(amount: number): Money {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    return new Money(amount);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  subtract(other: Money): Money {
    return Money.from(this.amount - other.amount);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this.amount / divisor);
  }

  round(decimals: number = 2): Money {
    const factor = Math.pow(10, decimals);
    return new Money(Math.round(this.amount * factor) / factor);
  }

  toNumber(): number {
    return this.amount;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  isGreaterThan(other: Money): boolean {
    return this.amount > other.amount;
  }

  isGreaterThanOrEqual(other: Money): boolean {
    return this.amount >= other.amount;
  }

  isLessThan(other: Money): boolean {
    return this.amount < other.amount;
  }

  isLessThanOrEqual(other: Money): boolean {
    return this.amount <= other.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }

  min(other: Money): Money {
    return this.amount < other.amount ? this : other;
  }

  max(other: Money): Money {
    return this.amount > other.amount ? this : other;
  }

  toString(): string {
    return this.amount.toFixed(2);
  }
}
