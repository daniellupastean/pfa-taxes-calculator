import { useMemo } from 'react';

interface UseTaxChartScaleParams {
  currentIncome: number;
  defaultMaxIncome?: number;
  bufferMultiplier?: number;
}

export function useTaxChartScale({
  currentIncome,
  defaultMaxIncome = 500000,
  bufferMultiplier = 1.2,
}: UseTaxChartScaleParams) {
  const getRoundingStep = (value: number) => {
    if (value <= 100000) return 10000;
    if (value <= 250000) return 25000;
    if (value <= 500000) return 50000;
    if (value <= 1000000) return 100000;
    return 250000;
  };

  // Calculate dynamic max income based on current income
  const maxIncome = useMemo(() => {
    if (currentIncome <= 0) {
      return defaultMaxIncome;
    }

    const targetMax = Math.max(defaultMaxIncome, currentIncome * bufferMultiplier);
    const step = getRoundingStep(targetMax);

    return Math.ceil(targetMax / step) * step;
  }, [currentIncome, defaultMaxIncome, bufferMultiplier]);

  return {
    maxIncome,
  };
}
