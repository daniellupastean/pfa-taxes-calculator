import { describe, it, expect } from 'vitest';
import { Money } from './money';

describe('Money', () => {
  describe('creation', () => {
    it('should create Money from positive number', () => {
      const money = Money.from(100);
      expect(money.toNumber()).toBe(100);
    });

    it('should clamp negative numbers to zero', () => {
      const money = Money.from(-50);
      expect(money.toNumber()).toBe(0);
    });

    it('should create zero Money', () => {
      const money = Money.zero();
      expect(money.toNumber()).toBe(0);
      expect(money.isZero()).toBe(true);
    });

    it('should throw on non-finite numbers', () => {
      expect(() => Money.from(NaN)).toThrow();
      expect(() => Money.from(Infinity)).toThrow();
    });
  });

  describe('operations', () => {
    it('should add two Money values', () => {
      const a = Money.from(100);
      const b = Money.from(50);
      const result = a.add(b);
      expect(result.toNumber()).toBe(150);
    });

    it('should subtract Money values', () => {
      const a = Money.from(100);
      const b = Money.from(30);
      const result = a.subtract(b);
      expect(result.toNumber()).toBe(70);
    });

    it('should clamp subtraction to zero', () => {
      const a = Money.from(50);
      const b = Money.from(100);
      const result = a.subtract(b);
      expect(result.toNumber()).toBe(0);
    });

    it('should multiply by factor', () => {
      const money = Money.from(100);
      const result = money.multiply(0.25);
      expect(result.toNumber()).toBe(25);
    });

    it('should divide by divisor', () => {
      const money = Money.from(100);
      const result = money.divide(4);
      expect(result.toNumber()).toBe(25);
    });

    it('should throw when dividing by zero', () => {
      const money = Money.from(100);
      expect(() => money.divide(0)).toThrow();
    });

    it('should round to specified decimals', () => {
      const money = Money.from(100.456);
      const rounded = money.round(2);
      expect(rounded.toNumber()).toBe(100.46);
    });
  });

  describe('comparisons', () => {
    it('should compare greater than', () => {
      const a = Money.from(100);
      const b = Money.from(50);
      expect(a.isGreaterThan(b)).toBe(true);
      expect(b.isGreaterThan(a)).toBe(false);
    });

    it('should compare less than', () => {
      const a = Money.from(50);
      const b = Money.from(100);
      expect(a.isLessThan(b)).toBe(true);
      expect(b.isLessThan(a)).toBe(false);
    });

    it('should check equality', () => {
      const a = Money.from(100);
      const b = Money.from(100);
      const c = Money.from(50);
      expect(a.equals(b)).toBe(true);
      expect(a.equals(c)).toBe(false);
    });

    it('should find minimum', () => {
      const a = Money.from(100);
      const b = Money.from(50);
      expect(a.min(b).toNumber()).toBe(50);
    });

    it('should find maximum', () => {
      const a = Money.from(100);
      const b = Money.from(50);
      expect(a.max(b).toNumber()).toBe(100);
    });
  });

  describe('immutability', () => {
    it('should not modify original when adding', () => {
      const original = Money.from(100);
      const result = original.add(Money.from(50));
      expect(original.toNumber()).toBe(100);
      expect(result.toNumber()).toBe(150);
    });

    it('should not modify original when subtracting', () => {
      const original = Money.from(100);
      const result = original.subtract(Money.from(30));
      expect(original.toNumber()).toBe(100);
      expect(result.toNumber()).toBe(70);
    });
  });
});
