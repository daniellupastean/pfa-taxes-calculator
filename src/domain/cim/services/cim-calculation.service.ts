import { Money, TaxRate } from '../../tax/value-objects';

export interface CIMBreakdown {
  grossSalary: Money;
  cas: Money;
  cass: Money;
  personalDeduction: Money;
  taxableIncome: Money;
  incomeTax: Money;
  totalTaxes: Money;
  netSalary: Money;
}

export interface CIMCalculationInput {
  grossSalary: number; // Annual gross salary
  year: number;
}

export class CIMCalculationService {
  /**
   * Calculate personal deduction (deducere personală) for monthly salary
   * Rules for 2025-2026 (Ordonanța 16/2022):
   * - Only for salaries up to (Minimum Wage + 2,000 RON)
   * - Deduction = percentage of minimum wage based on salary level
   * - For simplicity, we use 20% of minimum wage for salaries at minimum wage level
   * - Decreases linearly to 0% for salaries at (minimum wage + 2,000)
   * - No deduction for salaries above (minimum wage + 2,000)
   */
  private calculateMonthlyPersonalDeduction(monthlySalary: Money): Money {
    const minimumWage = 4050; // 2025-2026 minimum wage
    const maxDeductionSalary = minimumWage + 2000; // 6,050 RON
    const amount = monthlySalary.toNumber();

    // No deduction for salaries above minimum wage + 2,000
    if (amount > maxDeductionSalary) {
      return Money.zero();
    }

    // For salaries at or below minimum wage: 20% of minimum wage
    if (amount <= minimumWage) {
      return Money.from(minimumWage * 0.2); // 810 RON for 4,050 minimum wage
    }

    // Linear decrease from 20% to 0% for salaries between minimum wage and (minimum wage + 2,000)
    // At minimum wage: 20% of minimum wage (810 RON)
    // At minimum wage + 2,000: 0% of minimum wage (0 RON)
    const excessOverMinimum = amount - minimumWage;
    const percentageDecrease = (excessOverMinimum / 2000) * 0.2; // Decrease from 20% to 0%
    const deductionPercentage = 0.2 - percentageDecrease;

    return Money.from(minimumWage * deductionPercentage);
  }

  /**
   * Calculate CIM (employee) taxes for annual gross salary
   */
  calculate(input: CIMCalculationInput): CIMBreakdown {
    const grossSalary = Money.from(input.grossSalary);
    const monthlySalary = Money.from(input.grossSalary / 12);

    // CAS: 25% of gross salary
    const casRate = TaxRate.fromDecimal(0.25);
    const cas = casRate.applyTo(grossSalary).round();

    // CASS: 10% of gross salary
    const cassRate = TaxRate.fromDecimal(0.1);
    const cass = cassRate.applyTo(grossSalary).round();

    // Personal deduction (monthly × 12)
    const monthlyDeduction = this.calculateMonthlyPersonalDeduction(monthlySalary);
    const personalDeduction = monthlyDeduction.multiply(12);

    // Taxable income = Gross - CAS - CASS - Personal Deduction
    const taxableIncome = grossSalary.subtract(cas).subtract(cass).subtract(personalDeduction);

    // Income tax: 10% of taxable income (cannot be negative)
    const incomeTaxRate = TaxRate.fromDecimal(0.1);
    const incomeTax = taxableIncome.isPositive()
      ? incomeTaxRate.applyTo(taxableIncome).round()
      : Money.zero();

    // Total taxes
    const totalTaxes = cas.add(cass).add(incomeTax);

    // Net salary
    const netSalary = grossSalary.subtract(totalTaxes);

    return {
      grossSalary,
      cas,
      cass,
      personalDeduction,
      taxableIncome: taxableIncome.isPositive() ? taxableIncome : Money.zero(),
      incomeTax,
      totalTaxes,
      netSalary,
    };
  }

  /**
   * Calculate effective tax rate
   */
  getEffectiveRate(breakdown: CIMBreakdown): number {
    if (breakdown.grossSalary.isZero()) {
      return 0;
    }

    return breakdown.totalTaxes.toNumber() / breakdown.grossSalary.toNumber();
  }

  /**
   * Convert breakdown to plain object for display
   */
  toPlainObject(breakdown: CIMBreakdown): {
    grossSalary: number;
    cas: number;
    cass: number;
    personalDeduction: number;
    taxableIncome: number;
    incomeTax: number;
    totalTaxes: number;
    netSalary: number;
    effectiveRate: number;
  } {
    return {
      grossSalary: breakdown.grossSalary.toNumber(),
      cas: breakdown.cas.toNumber(),
      cass: breakdown.cass.toNumber(),
      personalDeduction: breakdown.personalDeduction.toNumber(),
      taxableIncome: breakdown.taxableIncome.toNumber(),
      incomeTax: breakdown.incomeTax.toNumber(),
      totalTaxes: breakdown.totalTaxes.toNumber(),
      netSalary: breakdown.netSalary.toNumber(),
      effectiveRate: this.getEffectiveRate(breakdown),
    };
  }
}
