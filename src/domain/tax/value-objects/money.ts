export class Money {
  private readonly cents: number;

  private constructor(cents: number) {
    if (!Number.isFinite(cents)) {
      throw new Error('Money amount must be a finite number');
    }
    // We strictly use integers for internal representation
    this.cents = Math.round(cents);
  }

  /**
   * Create Money from a standard amount (e.g. 10.50 RON)
   */
  static from(amount: number | null | undefined): Money {
    if (amount === null || amount === undefined) {
      return Money.zero();
    }
    return new Money(Math.max(0, amount * 100));
  }

  /**
   * Create Money from an exact amount, allowing negative values if needed (not recommended)
   */
  static exact(amount: number): Money {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    return new Money(amount * 100);
  }

  /**
   * Create Money from a cents value (integer)
   */
  static fromCents(cents: number): Money {
    return new Money(cents);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  subtract(other: Money): Money {
    return new Money(Math.max(0, this.cents - other.cents));
  }

  multiply(factor: number): Money {
    // Round after multiplication to keep integer cents
    return new Money(Math.round(this.cents * factor));
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    // Round after division to keep integer cents
    return new Money(Math.round(this.cents / divisor));
  }

  /**
   * Round to specified decimals (usually stays at 2 because we store cents)
   */
  round(decimals: number = 2): Money {
    if (decimals >= 2) return this;
    const factor = Math.pow(10, 2 - decimals);
    return new Money(Math.round(this.cents / factor) * factor);
  }

  /**
   * Returns the amount as a float (e.g. 10.5)
   */
  toNumber(): number {
    return this.cents / 100;
  }

  /**
   * Returns internal cents representation
   */
  toCents(): number {
    return this.cents;
  }

  isZero(): boolean {
    return this.cents === 0;
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  isGreaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  isGreaterThanOrEqual(other: Money): boolean {
    return this.cents >= other.cents;
  }

  isLessThan(other: Money): boolean {
    return this.cents < other.cents;
  }

  isLessThanOrEqual(other: Money): boolean {
    return this.cents <= other.cents;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  min(other: Money): Money {
    return this.cents < other.cents ? this : other;
  }

  max(other: Money): Money {
    return this.cents > other.cents ? this : other;
  }

  toString(): string {
    return (this.cents / 100).toFixed(2);
  }
}
