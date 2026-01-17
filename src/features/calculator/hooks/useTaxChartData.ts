import { useMemo } from 'react';
import { TaxCalculationService, TaxInput } from '../../../domain';
import type { TaxRules } from '../../../data/tax-configurations';
import type { PlainTaxInput } from '../../../domain/tax/models';

export interface ChartDataPoint {
    income: number;
    effectiveRate: number;
    total: number;
    cas: number;
    cass: number;
    incomeTax: number;
}

interface UseTaxChartDataParams {
    currentInput: PlainTaxInput;
    currentRules: TaxRules;
    maxIncome: number;
    thresholds: {
        cass: { minThreshold: number; maxCap: number };
        cas: { threshold1: number; threshold2: number };
    };
    customMinWage: number;
    customCasThreshold1: number;
    customCasThreshold2: number;
    customCassMinThreshold: number;
    customCassMaxCap: number;
    taxService: TaxCalculationService;
}

export function useTaxChartData({
    currentInput,
    currentRules,
    maxIncome,
    thresholds,
    customMinWage,
    customCasThreshold1,
    customCasThreshold2,
    customCassMinThreshold,
    customCassMaxCap,
    taxService,
}: UseTaxChartDataParams): ChartDataPoint[] {
    return useMemo(() => {
        const deductibleExpensesRate =
            currentInput.grossIncome > 0 ? currentInput.deductibleExpenses / currentInput.grossIncome : 0;

        // Generate critical points for better accuracy around thresholds
        const incomePoints: number[] = [];
        const criticalPoints = [
            0,
            thresholds.cass.minThreshold,
            thresholds.cas.threshold1,
            thresholds.cas.threshold2,
            thresholds.cass.maxCap,
            maxIncome,
        ].sort((a, b) => a - b);

        // Adaptive sampling: more points around critical thresholds
        for (let i = 0; i < criticalPoints.length - 1; i++) {
            const start = criticalPoints[i];
            const end = criticalPoints[i + 1];
            const intervalSize = end - start;

            // Determine number of points based on interval size
            let pointsInInterval;
            if (intervalSize < 50000) {
                pointsInInterval = 40; // More points for small intervals
            } else if (intervalSize < 100000) {
                pointsInInterval = 30;
            } else {
                pointsInInterval = 20; // Fewer points for large intervals
            }

            const step = intervalSize / pointsInInterval;

            for (let j = 0; j <= pointsInInterval; j++) {
                const income = start + j * step;
                if (!incomePoints.includes(income)) {
                    incomePoints.push(income);
                }
            }
        }

        const uniquePoints = Array.from(new Set(incomePoints)).sort((a, b) => a - b);

        return uniquePoints.map((income) => {
            const deductibleExpenses = income * deductibleExpensesRate;

            const taxInput = TaxInput.create({
                ...currentInput,
                grossIncome: income,
                deductibleExpenses: deductibleExpenses,
                configOverrides: {
                    minimumWageMonthly: customMinWage,
                    casThresholds: [customCasThreshold1, customCasThreshold2],
                    cassThresholds: [customCassMinThreshold],
                    cassMaxCap: customCassMaxCap,
                },
            });

            const result = taxService.calculate(taxInput, currentRules).toPlainObject();
            const effectiveRate = income > 0 ? (result.breakdown.total / income) * 100 : 0;

            return {
                income,
                effectiveRate,
                total: result.breakdown.total,
                cas: result.breakdown.cas,
                cass: result.breakdown.cass,
                incomeTax: result.breakdown.incomeTax,
            };
        });
    }, [
        currentInput,
        currentRules,
        maxIncome,
        thresholds,
        customMinWage,
        customCasThreshold1,
        customCasThreshold2,
        customCassMinThreshold,
        customCassMaxCap,
        taxService,
    ]);
}
