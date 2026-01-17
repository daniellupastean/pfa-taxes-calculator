import { describe, it, expect } from 'vitest';
import { TaxCalculationService } from './tax-calculation.service';
import { TaxInput } from '../models';
import { rules2026 } from '../../../data/tax-configurations/2026';

describe('TaxCalculationService', () => {
  const service = new TaxCalculationService();

  it('should calculate taxes correctly for basic case', () => {
    const input = TaxInput.create({
      year: 2026,
      grossIncome: 100000,
      deductibleExpenses: 20000,
      isVatPayer: false,
      isEmployee: false,
      isPensioner: false,
    });

    const result = service.calculate(input, rules2026);

    expect(result.breakdown.netIncome.toNumber()).toBe(80000);
    expect(result.breakdown.getTotal().isPositive()).toBe(true);
    expect(result.steps.length).toBeGreaterThan(0);
  });

  it('should handle zero income', () => {
    const input = TaxInput.create({
      year: 2026,
      grossIncome: 0,
      deductibleExpenses: 0,
      isVatPayer: false,
      isEmployee: false,
      isPensioner: false,
    });

    const result = service.calculate(input, rules2026);

    expect(result.breakdown.netIncome.isZero()).toBe(true);
    expect(result.breakdown.getTotal().isZero()).toBe(true);
  });

  it('should exempt pensioners from CAS', () => {
    const input = TaxInput.create({
      year: 2026,
      grossIncome: 100000,
      deductibleExpenses: 0,
      isVatPayer: false,
      isEmployee: false,
      isPensioner: true,
    });

    const result = service.calculate(input, rules2026);

    expect(result.breakdown.cas.isZero()).toBe(true);
  });

  it('should return TaxResult with all required fields', () => {
    const input = TaxInput.create({
      year: 2026,
      grossIncome: 50000,
      deductibleExpenses: 10000,
      isVatPayer: false,
      isEmployee: false,
      isPensioner: false,
    });

    const result = service.calculate(input, rules2026);

    expect(result.input).toBeDefined();
    expect(result.breakdown).toBeDefined();
    expect(result.steps).toBeDefined();
    expect(result.getEffectiveRate()).toBeDefined();
  });

  it('should handle config overrides', () => {
    const input = TaxInput.create({
      year: 2026,
      grossIncome: 100000,
      deductibleExpenses: 0,
      isVatPayer: false,
      isEmployee: false,
      isPensioner: false,
      configOverrides: {
        minimumWageMonthly: 5000,
      },
    });

    const result = service.calculate(input, rules2026);

    expect(result.breakdown).toBeDefined();
  });

  it('should convert to plain object for backward compatibility', () => {
    const input = TaxInput.create({
      year: 2026,
      grossIncome: 100000,
      deductibleExpenses: 20000,
      isVatPayer: false,
      isEmployee: false,
      isPensioner: false,
    });

    const result = service.calculate(input, rules2026);
    const plain = result.toPlainObject();

    expect(typeof plain.breakdown.netIncome).toBe('number');
    expect(typeof plain.breakdown.total).toBe('number');
    expect(Array.isArray(plain.steps)).toBe(true);
  });
});
