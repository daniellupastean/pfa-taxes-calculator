import type { TaxRules } from '../../../tax-rules';
import type { ExplainStep } from '../models';
import { TaxInput, TaxBreakdown } from '../models';
import type { ThresholdSelection } from '../policies';
import { formatLei, formatPercent } from '../../../lib/format';

/**
 * Tax Explain Formatter
 * Generates human-readable explanations for tax calculations
 */
export class TaxExplainFormatter {
  /**
   * Generate explanation steps for tax calculation
   */
  format(
    input: TaxInput,
    rules: TaxRules,
    breakdown: TaxBreakdown,
    cassSelection: ThresholdSelection
  ): ExplainStep[] {
    const steps: ExplainStep[] = [];

    const effectiveMinWage = input.configOverrides?.minimumWageMonthly ?? rules.minimumWageMonthly;
    const effectiveCasThresholds = input.configOverrides?.casThresholds ?? rules.casThresholds;
    const effectiveCassThresholds = input.configOverrides?.cassThresholds ?? rules.cassThresholds;
    const effectiveCassMaxCap = input.configOverrides?.cassMaxCap ?? rules.cassMaxCap;
    const monthlyMinWage = effectiveMinWage;

    // Step 1: Net income
    steps.push(this.formatNetIncomeStep(input, breakdown));

    // Step 2: CAS
    steps.push(
      this.formatCASStep(
        breakdown,
        effectiveCasThresholds,
        monthlyMinWage,
        rules.rates.cas,
        input.isPensioner
      )
    );

    // Step 3: CASS
    steps.push(
      this.formatCASSStep(
        input,
        breakdown,
        effectiveCassThresholds,
        effectiveCassMaxCap,
        monthlyMinWage,
        rules.rates.cass,
        cassSelection
      )
    );

    // Step 4: Taxable income
    steps.push(this.formatTaxableIncomeStep(breakdown));

    // Step 5: Income tax
    steps.push(this.formatIncomeTaxStep(breakdown, rules.rates.incomeTax));

    // Step 6: Total
    steps.push(this.formatTotalStep(input, breakdown));

    return steps;
  }

  private formatNetIncomeStep(input: TaxInput, breakdown: TaxBreakdown): ExplainStep {
    const grossIncome = input.grossIncome.toNumber();
    const deductibleExpenses = input.deductibleExpenses.toNumber();
    const netIncome = breakdown.netIncome.toNumber();

    return {
      title: '1. Calcul venit net',
      detail: `Venit brut: ${formatLei(grossIncome)} - Cheltuieli deductibile: ${formatLei(deductibleExpenses)} = Venit net: ${formatLei(netIncome)}`,
    };
  }

  private formatCASStep(
    breakdown: TaxBreakdown,
    thresholds: number[],
    minWage: number,
    rate: number,
    isPensioner: boolean
  ): ExplainStep {
    const casBase = breakdown.casBase.toNumber();
    const cas = breakdown.cas.toNumber();
    const netIncome = breakdown.netIncome.toNumber();

    let detail = '';

    if (isPensioner) {
      detail = `Ești pensionar - scutit de CAS. CAS = 0 lei.`;
    } else if (casBase === 0) {
      detail = `Venitul net (${formatLei(netIncome)}) este sub pragul minim de ${thresholds[0]} salarii minime (${formatLei(thresholds[0] * minWage)}). CAS = 0 lei.`;
    } else if (casBase === thresholds[0] * minWage) {
      detail = `Venitul net este între ${thresholds[0]} și ${thresholds[1]} salarii minime. Bază de calcul: ${thresholds[0]} × ${formatLei(minWage)} = ${formatLei(casBase)}. CAS: ${formatLei(casBase)} × ${formatPercent(rate)} = ${formatLei(cas)}`;
    } else {
      detail = `Venitul net depășește ${thresholds[1]} salarii minime. Bază de calcul: ${thresholds[1]} × ${formatLei(minWage)} = ${formatLei(casBase)}. CAS: ${formatLei(casBase)} × ${formatPercent(rate)} = ${formatLei(cas)}`;
    }

    return {
      title: '2. Contribuție asigurări sociale - CAS (25%)',
      detail,
    };
  }

  private formatCASSStep(
    input: TaxInput,
    breakdown: TaxBreakdown,
    thresholds: number[],
    maxCap: number,
    minWage: number,
    rate: number,
    selection: ThresholdSelection
  ): ExplainStep {
    const cassBase = breakdown.cassBase.toNumber();
    const cass = breakdown.cass.toNumber();
    const netIncome = breakdown.netIncome.toNumber();

    let detail = '';

    if (cassBase === 0) {
      if (input.isEmployee || input.isPensioner) {
        detail = `Ești angajat/pensionar și venitul net (${formatLei(netIncome)}) este sub ${thresholds[0]} salarii minime (${formatLei(thresholds[0] * minWage)}). CASS = 0 lei (scutit).`;
      } else {
        detail = `Venitul net (${formatLei(netIncome)}) este sub pragul minim de ${thresholds[0]} salarii minime (${formatLei(thresholds[0] * minWage)}). CASS = 0 lei.`;
      }
    } else if (input.isEmployee || input.isPensioner) {
      const capText = selection.cappedByMax
        ? ` (plafonat la ${maxCap} salarii minime = ${formatLei(maxCap * minWage)})`
        : '';
      detail = `Ești angajat/pensioner cu venit >= ${thresholds[0]} salarii minime. Plătești 10% din venitul net real: ${formatLei(cassBase)}${capText} × ${formatPercent(rate)} = ${formatLei(cass)}`;
    } else {
      const thresholdText = selection.thresholdInMinWages
        ? `${selection.thresholdInMinWages} salarii minime`
        : '';
      const capText = selection.cappedByMax ? ` (plafonat la ${maxCap} salarii minime)` : '';
      detail = `Venitul net atinge pragul de ${thresholdText}. Bază de calcul: ${formatLei(cassBase)}${capText}. CASS: ${formatLei(cassBase)} × ${formatPercent(rate)} = ${formatLei(cass)}`;
    }

    return {
      title: '3. Contribuție asigurări sociale de sănătate - CASS (10%)',
      detail,
    };
  }

  private formatTaxableIncomeStep(breakdown: TaxBreakdown): ExplainStep {
    return {
      title: '4. Venit impozabil',
      detail: `Venit net: ${formatLei(breakdown.netIncome.toNumber())} - CAS: ${formatLei(breakdown.cas.toNumber())} - CASS: ${formatLei(breakdown.cass.toNumber())} = ${formatLei(breakdown.taxableIncome.toNumber())}`,
    };
  }

  private formatIncomeTaxStep(breakdown: TaxBreakdown, rate: number): ExplainStep {
    return {
      title: '5. Impozit pe venit (10%)',
      detail: `${formatLei(breakdown.taxableIncome.toNumber())} × ${formatPercent(rate)} = ${formatLei(breakdown.incomeTax.toNumber())}`,
    };
  }

  private formatTotalStep(input: TaxInput, breakdown: TaxBreakdown): ExplainStep {
    const total = breakdown.getTotal().toNumber();
    const effectiveRate = breakdown.calculateEffectiveRate(input.grossIncome);
    const effectiveRateText =
      effectiveRate !== null ? ` (rată efectivă: ${formatPercent(effectiveRate)})` : '';

    return {
      title: '6. Total taxe și contribuții',
      detail: `CAS: ${formatLei(breakdown.cas.toNumber())} + CASS: ${formatLei(breakdown.cass.toNumber())} + Impozit: ${formatLei(breakdown.incomeTax.toNumber())} = ${formatLei(total)}${effectiveRateText}`,
    };
  }
}
