import { describe, it, expect } from 'vitest';
import { TaxCalculationService } from './tax-calculation.service';
import { TaxInput } from '../models';
import { Money } from '../value-objects';
import { rules2025 } from '../../../data/tax-configurations/2025';

describe('Effective Tax Rate - CASS Cap at 72 Minimum Wages', () => {
  const service = new TaxCalculationService();
  const minimumWage = rules2025.minimumWageMonthly; // 4050 RON

  it('should have correct effective rate below 6 minimum wages (CASS exemption)', () => {
    const testCases = [
      { minWages: 3, label: '3 salarii minime' },
      { minWages: 4, label: '4 salarii minime' },
      { minWages: 5, label: '5 salarii minime' },
      { minWages: 5.5, label: '5.5 salarii minime' },
      { minWages: 5.9, label: '5.9 salarii minime' },
      { minWages: 6, label: '6 salarii minime (la prag)' },
      { minWages: 7, label: '7 salarii minime (peste prag)' },
    ];

    console.log('\n=== Effective Tax Rate Below 6 Minimum Wages (Employee) ===');
    console.log('Minimum Wage:', minimumWage, 'RON');
    console.log('CASS Exemption Threshold: 6 minimum wages =', 6 * minimumWage, 'RON\n');

    const results = testCases.map(({ minWages, label }) => {
      const grossIncomeAmount = minWages * minimumWage;
      const input = TaxInput.create({
        year: 2025,
        grossIncome: grossIncomeAmount,
        deductibleExpenses: 0,
        isVatPayer: false,
        isEmployee: true, // Employee - eligible for CASS exemption
        isPensioner: false,
      });

      const result = service.calculate(input, rules2025);
      const plainBreakdown = result.breakdown.toPlainObject(Money.from(grossIncomeAmount));

      console.log(`${label}:`);
      console.log(`  Gross Income: ${grossIncomeAmount.toLocaleString()} RON`);
      console.log(`  Net Income: ${plainBreakdown.netIncome.toLocaleString()} RON`);
      console.log(`  CASS Base: ${plainBreakdown.cassBase.toLocaleString()} RON`);
      console.log(`  CASS: ${plainBreakdown.cass.toLocaleString()} RON`);
      console.log(`  CAS: ${plainBreakdown.cas.toLocaleString()} RON`);
      console.log(`  Income Tax: ${plainBreakdown.incomeTax.toLocaleString()} RON`);
      console.log(`  Total Taxes: ${plainBreakdown.total.toLocaleString()} RON`);
      console.log(
        `  Effective Rate: ${plainBreakdown.effectiveRate !== null ? (plainBreakdown.effectiveRate * 100).toFixed(2) + '%' : 'N/A'}`
      );
      console.log('');

      return {
        minWages,
        label,
        grossIncome: grossIncomeAmount,
        cass: plainBreakdown.cass,
        total: plainBreakdown.total,
        effectiveRate: plainBreakdown.effectiveRate,
      };
    });

    // Below 6 minimum wages: CASS should be 0 (exempt)
    results.forEach((r) => {
      if (r.minWages < 6) {
        expect(r.cass).toBe(0);
        console.log(`✓ ${r.label}: CASS = 0 (exempt)`);
      } else {
        expect(r.cass).toBeGreaterThan(0);
        console.log(`✓ ${r.label}: CASS > 0 (not exempt)`);
      }
    });

    // Effective rate should jump when CASS kicks in at 6 minimum wages
    const at5 = results.find((r) => r.minWages === 5);
    const at6 = results.find((r) => r.minWages === 6);
    const at7 = results.find((r) => r.minWages === 7);

    if (at5 && at6 && at5.effectiveRate !== null && at6.effectiveRate !== null) {
      // At 6 min wages, CASS kicks in, so rate should jump up
      expect(at6.effectiveRate).toBeGreaterThan(at5.effectiveRate);
      console.log(
        `\n✓ Rate jumps when CASS kicks in: ${(at5.effectiveRate * 100).toFixed(2)}% → ${(at6.effectiveRate * 100).toFixed(2)}%`
      );
    }

    if (at6 && at7 && at6.effectiveRate !== null && at7.effectiveRate !== null) {
      // After 6, rate should be relatively stable
      expect(Math.abs(at7.effectiveRate - at6.effectiveRate)).toBeLessThan(0.02);
      console.log(
        `✓ Rate stable after 6 min wages: ${(at6.effectiveRate * 100).toFixed(2)}% → ${(at7.effectiveRate * 100).toFixed(2)}%`
      );
    }
  });

  it('should have correct effective rate below 12 minimum wages for non-employee', () => {
    const testCases = [
      { minWages: 1, label: '1 salariu minim' },
      { minWages: 2, label: '2 salarii minime' },
      { minWages: 3, label: '3 salarii minime' },
      { minWages: 4, label: '4 salarii minime' },
      { minWages: 5, label: '5 salarii minime' },
      { minWages: 6, label: '6 salarii minime (prag CASS)' },
      { minWages: 9, label: '9 salarii minime' },
      { minWages: 11, label: '11 salarii minime' },
      { minWages: 12, label: '12 salarii minime (prag CAS)' },
      { minWages: 13, label: '13 salarii minime' },
    ];

    console.log('\n=== Effective Tax Rate Below 12 Minimum Wages (Non-Employee) ===');
    console.log('Minimum Wage:', minimumWage, 'RON');
    console.log('CAS Threshold: 12 minimum wages =', 12 * minimumWage, 'RON\n');

    const results = testCases.map(({ minWages, label }) => {
      const grossIncomeAmount = minWages * minimumWage;
      const input = TaxInput.create({
        year: 2025,
        grossIncome: grossIncomeAmount,
        deductibleExpenses: 0,
        isVatPayer: false,
        isEmployee: false, // Non-employee - no CASS exemption
        isPensioner: false,
      });

      const result = service.calculate(input, rules2025);
      const plainBreakdown = result.breakdown.toPlainObject(Money.from(grossIncomeAmount));

      console.log(`${label}:`);
      console.log(`  Gross Income: ${grossIncomeAmount.toLocaleString()} RON`);
      console.log(`  Net Income: ${plainBreakdown.netIncome.toLocaleString()} RON`);
      console.log(`  CAS Base: ${plainBreakdown.casBase.toLocaleString()} RON`);
      console.log(`  CAS: ${plainBreakdown.cas.toLocaleString()} RON`);
      console.log(`  CASS Base: ${plainBreakdown.cassBase.toLocaleString()} RON`);
      console.log(`  CASS: ${plainBreakdown.cass.toLocaleString()} RON`);
      console.log(`  Income Tax: ${plainBreakdown.incomeTax.toLocaleString()} RON`);
      console.log(`  Total Taxes: ${plainBreakdown.total.toLocaleString()} RON`);
      console.log(
        `  Effective Rate: ${plainBreakdown.effectiveRate !== null ? (plainBreakdown.effectiveRate * 100).toFixed(2) + '%' : 'N/A'}`
      );
      console.log('');

      return {
        minWages,
        label,
        grossIncome: grossIncomeAmount,
        casBase: plainBreakdown.casBase,
        cas: plainBreakdown.cas,
        cassBase: plainBreakdown.cassBase,
        cass: plainBreakdown.cass,
        total: plainBreakdown.total,
        effectiveRate: plainBreakdown.effectiveRate,
      };
    });

    // Below 12 minimum wages: CAS should be 0 (exempt)
    results.forEach((r) => {
      if (r.minWages < 12) {
        expect(r.cas).toBe(0);
      } else {
        expect(r.cas).toBeGreaterThan(0);
      }
    });

    // CASS should always be calculated (no exemption for non-employees)
    results.forEach((r) => {
      expect(r.cass).toBeGreaterThan(0);
    });

    // Below 6 minimum wages: CASS should be on 6 minimum wages (fixed)
    const cassMinBase = 6 * minimumWage;
    results.forEach((r) => {
      if (r.minWages < 6) {
        expect(r.cassBase).toBe(cassMinBase);
        console.log(`✓ ${r.label}: CASS base = 6 min wages (${cassMinBase} RON)`);
      }
    });

    // Effective rate should decrease as income increases below 6 min wages
    // (because CASS is fixed at 6 min wages, but income increases)
    const at1 = results.find((r) => r.minWages === 1);
    const at2 = results.find((r) => r.minWages === 2);
    const at3 = results.find((r) => r.minWages === 3);
    const at6 = results.find((r) => r.minWages === 6);
    const at11 = results.find((r) => r.minWages === 11);
    const at12 = results.find((r) => r.minWages === 12);

    if (
      at1 &&
      at2 &&
      at3 &&
      at1.effectiveRate !== null &&
      at2.effectiveRate !== null &&
      at3.effectiveRate !== null
    ) {
      // Rate should decrease as income increases (CASS is fixed, income grows)
      expect(at2.effectiveRate).toBeLessThan(at1.effectiveRate);
      expect(at3.effectiveRate).toBeLessThan(at2.effectiveRate);
      console.log(`\n✓ Rate decreases as income grows (CASS fixed at 6 min wages):`);
      console.log(`  1 min wage: ${(at1.effectiveRate * 100).toFixed(2)}%`);
      console.log(`  2 min wages: ${(at2.effectiveRate * 100).toFixed(2)}%`);
      console.log(`  3 min wages: ${(at3.effectiveRate * 100).toFixed(2)}%`);
    }

    if (at3 && at6 && at3.effectiveRate !== null && at6.effectiveRate !== null) {
      expect(at6.effectiveRate).toBeLessThan(at3.effectiveRate);
      console.log(`  6 min wages: ${(at6.effectiveRate * 100).toFixed(2)}%`);
    }

    if (at11 && at12 && at11.effectiveRate !== null && at12.effectiveRate !== null) {
      // At 12, CAS kicks in (fixed amount), so rate should jump
      expect(at12.effectiveRate).toBeGreaterThan(at11.effectiveRate);
      console.log(
        `✓ Rate jumps when CAS kicks in: ${(at11.effectiveRate * 100).toFixed(2)}% → ${(at12.effectiveRate * 100).toFixed(2)}%`
      );
    }
  });

  it('should have consistent effective rate around 72 minimum wages threshold', () => {
    const testCases = [
      { minWages: 70, label: '70 salarii minime' },
      { minWages: 71, label: '71 salarii minime' },
      { minWages: 72, label: '72 salarii minime (la prag)' },
      { minWages: 73, label: '73 salarii minime (peste prag)' },
      { minWages: 74, label: '74 salarii minime' },
      { minWages: 75, label: '75 salarii minime' },
    ];

    const results = testCases.map(({ minWages, label }) => {
      const grossIncomeAmount = minWages * minimumWage;
      const input = TaxInput.create({
        year: 2025,
        grossIncome: grossIncomeAmount,
        deductibleExpenses: 0,
        isVatPayer: false,
        isEmployee: false,
        isPensioner: false,
      });

      const result = service.calculate(input, rules2025);
      const plainBreakdown = result.breakdown.toPlainObject(Money.from(grossIncomeAmount));

      return {
        minWages,
        label,
        grossIncome: grossIncomeAmount,
        netIncome: plainBreakdown.netIncome,
        cas: plainBreakdown.cas,
        cassBase: plainBreakdown.cassBase,
        cass: plainBreakdown.cass,
        incomeTax: plainBreakdown.incomeTax,
        total: plainBreakdown.total,
        effectiveRate: plainBreakdown.effectiveRate,
      };
    });

    // Print results for debugging
    console.log('\n=== Effective Tax Rate Analysis ===');
    console.log('Minimum Wage:', minimumWage, 'RON');
    console.log('CASS Cap:', 72, 'minimum wages =', 72 * minimumWage, 'RON\n');

    results.forEach((r) => {
      console.log(`${r.label}:`);
      console.log(`  Gross Income: ${r.grossIncome.toLocaleString()} RON`);
      console.log(`  Net Income: ${r.netIncome.toLocaleString()} RON`);
      console.log(`  CASS Base: ${r.cassBase.toLocaleString()} RON`);
      console.log(`  CASS: ${r.cass.toLocaleString()} RON`);
      console.log(`  CAS: ${r.cas.toLocaleString()} RON`);
      console.log(`  Income Tax: ${r.incomeTax.toLocaleString()} RON`);
      console.log(`  Total Taxes: ${r.total.toLocaleString()} RON`);
      console.log(
        `  Effective Rate: ${r.effectiveRate !== null ? (r.effectiveRate * 100).toFixed(2) + '%' : 'N/A'}`
      );
      console.log('');
    });

    // Verify CASS base is capped at 72 minimum wages
    const cassCapAmount = 72 * minimumWage;

    results.forEach((r) => {
      if (r.minWages <= 72) {
        // Below or at cap: CASS base should equal net income
        expect(r.cassBase).toBe(r.netIncome);
      } else {
        // Above cap: CASS base should be capped at 72 minimum wages
        expect(r.cassBase).toBe(cassCapAmount);
      }
    });

    // Verify effective rate behavior around the cap
    const at70 = results.find((r) => r.minWages === 70);
    const at71 = results.find((r) => r.minWages === 71);
    const at72 = results.find((r) => r.minWages === 72);
    const at73 = results.find((r) => r.minWages === 73);
    const at75 = results.find((r) => r.minWages === 75);

    // Before cap (70-72): rate should be stable (CASS on actual income)
    if (
      at70 &&
      at71 &&
      at72 &&
      at70.effectiveRate !== null &&
      at71.effectiveRate !== null &&
      at72.effectiveRate !== null
    ) {
      expect(at70.effectiveRate).toBeCloseTo(at71.effectiveRate, 2);
      expect(at71.effectiveRate).toBeCloseTo(at72.effectiveRate, 2);
      console.log(
        `\n✓ Before cap (70-72): rate stable at ${(at72.effectiveRate * 100).toFixed(2)}%`
      );
    }

    // After cap (73-75): rate should be stable but lower (CASS capped)
    if (at73 && at75 && at73.effectiveRate !== null && at75.effectiveRate !== null) {
      expect(at73.effectiveRate).toBeCloseTo(at75.effectiveRate, 2);
      console.log(`✓ After cap (73-75): rate stable at ${(at73.effectiveRate * 100).toFixed(2)}%`);
    }

    // Verify that after the cap, effective rate decreases (because CASS is capped)
    if (at72 && at73 && at72.effectiveRate !== null && at73.effectiveRate !== null) {
      expect(at73.effectiveRate).toBeLessThan(at72.effectiveRate);
      console.log(
        `✓ Rate correctly decreases at cap: ${(at72.effectiveRate * 100).toFixed(2)}% → ${(at73.effectiveRate * 100).toFixed(2)}%`
      );
    }
  });

  it('should calculate CASS correctly for employee at and above 72 minimum wages', () => {
    const testCases = [
      { minWages: 72, label: '72 salarii minime' },
      { minWages: 80, label: '80 salarii minime' },
      { minWages: 100, label: '100 salarii minime' },
    ];

    testCases.forEach(({ minWages, label }) => {
      const grossIncomeAmount = minWages * minimumWage;
      const input = TaxInput.create({
        year: 2025,
        grossIncome: grossIncomeAmount,
        deductibleExpenses: 0,
        isVatPayer: false,
        isEmployee: true, // Employee
        isPensioner: false,
      });

      const result = service.calculate(input, rules2025);
      const plainBreakdown = result.breakdown.toPlainObject(Money.from(grossIncomeAmount));

      console.log(`\n${label} (Employee):`);
      console.log(`  Net Income: ${plainBreakdown.netIncome.toLocaleString()} RON`);
      console.log(`  CASS Base: ${plainBreakdown.cassBase.toLocaleString()} RON`);
      console.log(`  CASS: ${plainBreakdown.cass.toLocaleString()} RON`);

      // CASS base should be capped at 72 minimum wages
      const expectedCassBase = Math.min(plainBreakdown.netIncome, 72 * minimumWage);
      expect(plainBreakdown.cassBase).toBe(expectedCassBase);

      // CASS should be 10% of capped base
      const expectedCass = Math.round(expectedCassBase * 0.1);
      expect(plainBreakdown.cass).toBe(expectedCass);
    });
  });
});
