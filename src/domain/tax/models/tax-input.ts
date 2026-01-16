import { Money } from '../value-objects';

export interface TaxConfigOverrides {
  minimumWageMonthly?: number;
  casThresholds?: number[];
  cassThresholds?: number[];
  cassMaxCap?: number;
}

export class TaxInput {
  readonly year: number;
  readonly grossIncome: Money;
  readonly deductibleExpenses: Money;
  readonly isVatPayer: boolean;
  readonly isEmployee: boolean;
  readonly isPensioner: boolean;
  readonly configOverrides?: TaxConfigOverrides;

  private constructor(
    year: number,
    grossIncome: Money,
    deductibleExpenses: Money,
    isVatPayer: boolean,
    isEmployee: boolean,
    isPensioner: boolean,
    configOverrides?: TaxConfigOverrides
  ) {
    this.year = year;
    this.grossIncome = grossIncome;
    this.deductibleExpenses = deductibleExpenses;
    this.isVatPayer = isVatPayer;
    this.isEmployee = isEmployee;
    this.isPensioner = isPensioner;
    this.configOverrides = configOverrides;
    this.validate();
  }

  static create(params: {
    year: number;
    grossIncome: number;
    deductibleExpenses: number;
    isVatPayer: boolean;
    isEmployee: boolean;
    isPensioner: boolean;
    configOverrides?: TaxConfigOverrides;
  }): TaxInput {
    return new TaxInput(
      params.year,
      Money.from(params.grossIncome),
      Money.from(params.deductibleExpenses),
      params.isVatPayer,
      params.isEmployee,
      params.isPensioner,
      params.configOverrides
    );
  }

  calculateNetIncome(): Money {
    return this.grossIncome.subtract(this.deductibleExpenses);
  }

  hasConflictingStatus(): boolean {
    return this.isEmployee && this.isPensioner;
  }

  private validate(): void {
    if (this.year < 2024 || this.year > 2030) {
      throw new Error('Year must be between 2024 and 2030');
    }

    if (this.hasConflictingStatus()) {
      throw new Error('Cannot be both employee and pensioner');
    }
  }

  toPlainObject(): {
    year: number;
    grossIncome: number;
    deductibleExpenses: number;
    isVatPayer: boolean;
    isEmployee: boolean;
    isPensioner: boolean;
    configOverrides?: TaxConfigOverrides;
  } {
    return {
      year: this.year,
      grossIncome: this.grossIncome.toNumber(),
      deductibleExpenses: this.deductibleExpenses.toNumber(),
      isVatPayer: this.isVatPayer,
      isEmployee: this.isEmployee,
      isPensioner: this.isPensioner,
      configOverrides: this.configOverrides,
    };
  }

  with(
    changes: Partial<{
      year: number;
      grossIncome: number;
      deductibleExpenses: number;
      isVatPayer: boolean;
      isEmployee: boolean;
      isPensioner: boolean;
      configOverrides: TaxConfigOverrides;
    }>
  ): TaxInput {
    return new TaxInput(
      changes.year ?? this.year,
      changes.grossIncome !== undefined ? Money.from(changes.grossIncome) : this.grossIncome,
      changes.deductibleExpenses !== undefined
        ? Money.from(changes.deductibleExpenses)
        : this.deductibleExpenses,
      changes.isVatPayer ?? this.isVatPayer,
      changes.isEmployee ?? this.isEmployee,
      changes.isPensioner ?? this.isPensioner,
      changes.configOverrides ?? this.configOverrides
    );
  }
}
