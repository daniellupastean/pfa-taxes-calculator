import { describe, it, expect } from 'vitest';
import { CIMCalculationService } from './cim-calculation.service';

describe('CIMCalculationService', () => {
  const service = new CIMCalculationService();

  describe('Personal Deduction (2025-2026 Rules)', () => {
    const minimumWage = 4050;

    it('should give 20% of minimum wage for salary at minimum wage (4,050 RON/month)', () => {
      const result = service.calculate({
        grossSalary: 48600, // 4,050 RON/month × 12
        year: 2025,
      });

      // 20% of 4,050 = 810 RON/month × 12 = 9,720 RON/year
      expect(result.personalDeduction.toNumber()).toBe(810 * 12);
    });

    it('should give 20% of minimum wage for salary below minimum wage', () => {
      const result = service.calculate({
        grossSalary: 36000, // 3,000 RON/month × 12
        year: 2025,
      });

      // 20% of 4,050 = 810 RON/month × 12 = 9,720 RON/year
      expect(result.personalDeduction.toNumber()).toBe(810 * 12);
    });

    it('should give partial deduction for salary between minimum wage and (minimum wage + 2,000)', () => {
      const result = service.calculate({
        grossSalary: 60000, // 5,000 RON/month × 12
        year: 2025,
      });

      // At 5,000 RON/month (minimum wage + 950):
      // Percentage = 20% - (950/2000 × 20%) = 20% - 9.5% = 10.5%
      // Deduction = 4,050 × 10.5% = 425.25 RON/month
      const expectedMonthly = minimumWage * 0.105;
      expect(result.personalDeduction.toNumber()).toBeCloseTo(expectedMonthly * 12, 0);
    });

    it('should give zero deduction for salary > (minimum wage + 2,000) = 6,050 RON/month', () => {
      const result = service.calculate({
        grossSalary: 84000, // 7,000 RON/month × 12
        year: 2025,
      });

      expect(result.personalDeduction.toNumber()).toBe(0);
    });

    it('should give zero deduction exactly at (minimum wage + 2,000) = 6,050 RON/month', () => {
      const result = service.calculate({
        grossSalary: 72600, // 6,050 RON/month × 12
        year: 2025,
      });

      expect(result.personalDeduction.toNumber()).toBeCloseTo(0, 0);
    });
  });

  describe('Tax Calculations', () => {
    it('should calculate correctly for minimum wage salary (4,050 RON/month)', () => {
      const result = service.calculate({
        grossSalary: 48600, // 4,050 RON/month × 12
        year: 2025,
      });

      const plain = service.toPlainObject(result);

      // CAS: 25% of 48,600 = 12,150
      expect(plain.cas).toBe(12150);

      // CASS: 10% of 48,600 = 4,860
      expect(plain.cass).toBe(4860);

      // Personal deduction: 810 × 12 = 9,720
      expect(plain.personalDeduction).toBe(9720);

      // Taxable income: 48,600 - 12,150 - 4,860 - 9,720 = 21,870
      expect(plain.taxableIncome).toBe(21870);

      // Income tax: 10% of 21,870 = 2,187
      expect(plain.incomeTax).toBe(2187);

      // Total taxes: 12,150 + 4,860 + 2,187 = 19,197
      expect(plain.totalTaxes).toBe(19197);

      // Net: 48,600 - 19,197 = 29,403
      expect(plain.netSalary).toBe(29403);

      // Effective rate: 19,197 / 48,600 = 39.5%
      expect(plain.effectiveRate).toBeCloseTo(0.395, 3);
    });

    it('should calculate correctly for medium salary (3,000 RON/month - below minimum wage)', () => {
      const result = service.calculate({
        grossSalary: 36000, // 3,000 RON/month × 12
        year: 2025,
      });

      const plain = service.toPlainObject(result);

      // CAS: 25% of 36,000 = 9,000
      expect(plain.cas).toBe(9000);

      // CASS: 10% of 36,000 = 3,600
      expect(plain.cass).toBe(3600);

      // Personal deduction: 810 × 12 = 9,720 (full deduction, below minimum wage)
      expect(plain.personalDeduction).toBe(9720);

      // Taxable income: 36,000 - 9,000 - 3,600 - 9,720 = 13,680
      expect(plain.taxableIncome).toBe(13680);

      // Income tax: 10% of 13,680 = 1,368
      expect(plain.incomeTax).toBe(1368);

      // Total taxes: 9,000 + 3,600 + 1,368 = 13,968
      expect(plain.totalTaxes).toBe(13968);

      // Net: 36,000 - 13,968 = 22,032
      expect(plain.netSalary).toBe(22032);

      // Effective rate: 13,968 / 36,000 = 38.8%
      expect(plain.effectiveRate).toBeCloseTo(0.388, 3);
    });

    it('should calculate correctly for high salary (no deduction)', () => {
      const result = service.calculate({
        grossSalary: 120000, // 10,000 RON/month
        year: 2025,
      });

      const plain = service.toPlainObject(result);

      // CAS: 25% of 120,000 = 30,000
      expect(plain.cas).toBe(30000);

      // CASS: 10% of 120,000 = 12,000
      expect(plain.cass).toBe(12000);

      // Personal deduction: 0
      expect(plain.personalDeduction).toBe(0);

      // Taxable income: 120,000 - 30,000 - 12,000 = 78,000
      expect(plain.taxableIncome).toBe(78000);

      // Income tax: 10% of 78,000 = 7,800
      expect(plain.incomeTax).toBe(7800);

      // Total taxes: 30,000 + 12,000 + 7,800 = 49,800
      expect(plain.totalTaxes).toBe(49800);

      // Net: 120,000 - 49,800 = 70,200
      expect(plain.netSalary).toBe(70200);

      // Effective rate: 49,800 / 120,000 = 41.5%
      expect(plain.effectiveRate).toBe(0.415);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero salary', () => {
      const result = service.calculate({
        grossSalary: 0,
        year: 2025,
      });

      const plain = service.toPlainObject(result);

      expect(plain.cas).toBe(0);
      expect(plain.cass).toBe(0);
      expect(plain.incomeTax).toBe(0);
      expect(plain.totalTaxes).toBe(0);
      expect(plain.netSalary).toBe(0);
      expect(plain.effectiveRate).toBe(0);
    });

    it('should not have negative taxable income', () => {
      const result = service.calculate({
        grossSalary: 1000, // Very low salary
        year: 2025,
      });

      const plain = service.toPlainObject(result);

      // Even if calculation would be negative, taxable income should be 0
      expect(plain.taxableIncome).toBeGreaterThanOrEqual(0);
      expect(plain.incomeTax).toBe(0);
    });
  });
});
