import { useMemo } from 'react';

interface UseTaxChartScaleParams {
    currentIncome: number;
    defaultMaxIncome?: number;
}

export function useTaxChartScale({
    currentIncome,
    defaultMaxIncome = 500000,
}: UseTaxChartScaleParams) {
    // Calculate dynamic max income based on current income
    const maxIncome = useMemo(() => {
        // If current income is above 450k, extend dynamically
        if (currentIncome > 450000) {
            // Show current income + 20% buffer, rounded up to next 50k
            const targetMax = currentIncome * 1.2;
            return Math.ceil(targetMax / 50000) * 50000;
        }

        return defaultMaxIncome;
    }, [currentIncome, defaultMaxIncome]);

    return {
        maxIncome,
    };
}
