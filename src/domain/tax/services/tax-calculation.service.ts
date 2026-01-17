import type { TaxRules } from '../../../tax-rules';
import { Money, TaxRate } from '../value-objects';
import { TaxInput, TaxBreakdown, TaxResult } from '../models';
import {
  CASCalculationService,
  CASSCalculationService,
  IncomeTaxCalculationService,
} from './index';
import { TaxExplainFormatter } from '../formatters';

/**
 * Tax Calculation Service
 * Main orchestrator for tax calculations
 * Coordinates CAS, CASS, and Income Tax services
 */
export class TaxCalculationService {
  private readonly casService: CASCalculationService;
  private readonly cassService: CASSCalculationService;
  private readonly incomeTaxService: IncomeTaxCalculationService;
  private readonly explainFormatter: TaxExplainFormatter;

  constructor(
    casService: CASCalculationService = new CASCalculationService(),
    cassService: CASSCalculationService = new CASSCalculationService(),
    incomeTaxService: IncomeTaxCalculationService = new IncomeTaxCalculationService(),
    explainFormatter: TaxExplainFormatter = new TaxExplainFormatter()
  ) {
    this.casService = casService;
    this.cassService = cassService;
    this.incomeTaxService = incomeTaxService;
    this.explainFormatter = explainFormatter;
  }

  /**
   * Calculate taxes for given input and rules
   */
  calculate(input: TaxInput, rules: TaxRules): TaxResult {
    // Get effective configuration (with overrides)
    const effectiveMinWage = Money.from(
      input.configOverrides?.minimumWageMonthly ?? rules.minimumWageMonthly
    );
    const effectiveCasThresholds = input.configOverrides?.casThresholds ?? rules.casThresholds;
    const effectiveCassThresholds = input.configOverrides?.cassThresholds ?? rules.cassThresholds;
    const effectiveCassMaxCap = input.configOverrides?.cassMaxCap ?? rules.cassMaxCap;

    // Create tax rates
    const casRate = TaxRate.fromDecimal(rules.rates.cas);
    const cassRate = TaxRate.fromDecimal(rules.rates.cass);
    const incomeTaxRate = TaxRate.fromDecimal(rules.rates.incomeTax);

    // Calculate net income
    const netIncome = input.calculateNetIncome();

    // Calculate CAS
    const casResult = this.casService.calculate(
      netIncome,
      input.isPensioner,
      effectiveCasThresholds,
      effectiveMinWage,
      casRate
    );

    // Calculate CASS
    const cassResult = this.cassService.calculate(
      netIncome,
      input.isEmployee,
      input.isPensioner,
      effectiveCassThresholds,
      effectiveCassMaxCap,
      effectiveMinWage,
      cassRate
    );

    // Calculate Income Tax
    const incomeTaxResult = this.incomeTaxService.calculate(
      netIncome,
      casResult.amount,
      cassResult.amount,
      incomeTaxRate
    );

    // Create breakdown
    const breakdown = new TaxBreakdown(
      netIncome,
      incomeTaxResult.taxableIncome,
      incomeTaxResult.amount,
      casResult.base,
      casResult.amount,
      cassResult.base,
      cassResult.amount
    );

    // Generate explanation steps using formatter
    const steps = this.explainFormatter.format(input, rules, breakdown, cassResult.selection);

    return new TaxResult(input, breakdown, steps);
  }
}
