# AI Copilot Instructions for PFA Taxes Calculator

## Project Overview

Romanian PFA (Authorized Individual) tax calculator for 2024-2027. Single-page React/TypeScript app calculating income tax, CAS (pension), and CASS (health insurance) contributions. All calculations are deterministic, client-side, with no backend.

**Key stats:** Vite + React 19 + TypeScript, ~100KB bundle, fully tested domain logic, i18n (RO/EN), multi-currency support (RON/EUR/USD).

---

## Architecture: Domain-Driven Design (DDD)

### Core Principle: Domain Logic Isolated from UI

**Directory structure:**
```
src/domain/tax/              ← ALL business logic (no React imports)
  ├── value-objects/         ← Money, TaxRate, Threshold (immutable, tested)
  ├── models/                ← TaxInput, TaxBreakdown, TaxResult (domain entities)
  ├── services/              ← TaxCalculationService, CAS/CASS calculation (orchestrators)
  ├── policies/              ← CASExemptionPolicy, CASSThresholdPolicy (business rules)
  └── formatters/            ← TaxExplainFormatter (readable output generation)
```

**Critical rule:** Domain code never imports from `react`, `features/`, or `shared/contexts/`. It's 100% pure functions and classes—testable without rendering.

### Data Flow: How Tax Calculation Works

1. **User Input** (UI) → `TaxInput.create()` validates & creates domain entity
2. **Rules Lookup** → `getTaxRulesForYear(year)` fetches year-specific thresholds/rates
3. **Orchestration** → `TaxCalculationService.calculate(input, rules)`:
   - Calculates net income: `grossIncome - deductibleExpenses`
   - CAS calculation: `CASCalculationService` (applies exemptions for pensioners/below-threshold)
   - CASS calculation: `CASSCalculationService` (multi-tier thresholds, employee/pensioner rules)
   - Income tax: `IncomeTaxCalculationService` (simple: netIncome × rate)
4. **Result** → `TaxResult` object with breakdown + human-readable explanations
5. **UI Consumption** → Feature components convert to `PlainTaxResult` for rendering

**See:** `src/domain/tax/services/tax-calculation.service.ts` for orchestration; `src/features/calculator/hooks/useTaxCalculator.ts` for UI integration.

---

## Critical Patterns

### 1. Value Objects (Immutable, Type-Safe)

**Money** – All currency amounts use this, NOT raw numbers:
```typescript
const amount = Money.from(100.50);      // from standard amount
const tax = amount.multiply(0.1);       // returns new Money
const doubled = tax.add(amount);        // returns new Money
// amount remains 100.50 (immutable)
```
**Why:** Prevents rounding errors; cents stored as integers. Always use for money operations.

**TaxRate** – Encapsulates percentage/decimal conversion:
```typescript
const rate1 = TaxRate.fromDecimal(0.25);      // 25%
const rate2 = TaxRate.fromPercentage(25);     // same thing
const tax = rate1.applyTo(Money.from(100));   // 25 RON
```

**Threshold** – Encapsulates "minimum wage multiples" logic:
```typescript
const threshold = Threshold.from(6, minWage);  // 6× minimum wage
const isExceeded = threshold.isExceededBy(netIncome);
```

**Never use raw numbers for money/tax/threshold calculations.** Always wrap in value objects first.

### 2. TaxInput Validation & Factory

**Always create via factory, never constructor directly:**
```typescript
const input = TaxInput.create({
  year: 2026,
  grossIncome: 100000,
  deductibleExpenses: 20000,
  isVatPayer: false,
  isEmployee: true,
  isPensioner: false,
});
// Factory validates: year in range, mutually-exclusive statuses, non-negative amounts
```

### 3. Tax Rules by Year

**Rules are imported by year, not magic numbers:**
```typescript
import { getTaxRulesForYear } from '@/data/tax-configurations';

const rules = getTaxRulesForYear(2026);
// rules.minimumWageMonthly, rules.rates, rules.casThresholds, etc.
```

**To add new year:**
1. Create `src/data/tax-configurations/2028.ts` (copy 2027.ts)
2. Update thresholds/rates
3. Add to `src/data/tax-configurations/index.ts`: `import rules2028`, add to `taxRulesByYear`

### 4. Policies Encapsulate Business Rules

**CASExemptionPolicy** – When is CAS calculation skipped?
```typescript
// Exempted: pensioners OR income below threshold
// Uses threshold from rules
```

**CASSThresholdPolicy** – What base is used for CASS?
```typescript
// For employees/pensioners: special rules (different thresholds)
// For non-employees: standard tiered calculation with caps
```

**When adding new rule:** Create a new Policy class in `src/domain/tax/policies/`, inject into service.

### 5. React Context for App State

**Three global contexts (never mix domain logic here):**
- `SettingsContext` – selected year, monthly view toggle (persisted to localStorage)
- `CurrencyContext` – selected currency, exchange rates, conversion functions
- `AdvancedConfigContext` – override minimum wage / thresholds for "what-if" scenarios

**Pattern:** Each context has custom hook (`useSettings()`, `useCurrency()`, `useAdvancedConfig()`). Always use hooks, not `useContext()` directly.

### 6. Feature-Based Organization

**Calculator feature example:**
```
features/calculator/
  ├── components/               ← UI-only (TaxForm, ResultsCard, Chart, etc.)
  ├── hooks/useTaxCalculator.ts ← Bridges domain + contexts, manages form state
  └── CalculatorPage.tsx        ← Page entry point
```

**Rule:** Feature components import domain services directly; never share feature components across features (use `shared/` instead).

---

## Testing Strategy

**Test files colocated with source:**
```
src/domain/tax/value-objects/
  ├── money.ts
  ├── money.test.ts            ← Vitest unit tests
```

**Run tests:** `npm test` (Vitest in watch mode by default)

**Key pattern:** Domain logic heavily tested (>90% coverage), UI components lightly tested (snapshots + user interactions via `@testing-library/react`).

**Test utilities available:** `src/test/setup.ts` (jest-dom matchers).

---

## Development Commands

```bash
npm run dev        # Start Vite dev server (HMR enabled)
npm test           # Run Vitest with watch mode
npm run test:ui    # Visual test dashboard
npm run build      # Type-check + vite build → dist/
npm run lint       # ESLint check
npm run format     # Prettier format
```

---

## Build & Deployment

**Build process:** `tsc -b && vite build`
1. TypeScript strict mode check
2. Vite optimized bundle → `dist/`

**Type safety:** Strict tsconfig. All domain logic typed; UI props validated with Zod (forms).

---

## Internationalization (i18n)

**Two languages:** Romanian (ro) + English (en) auto-detected; settable via context.

**Files:** `src/i18n/en.json`, `src/i18n/ro.json` (key-value objects)

**Usage in components:**
```typescript
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
return <p>{t('tax.incomeTax')}</p>;
```

---

## Common Tasks & Patterns

### Adding a New Tax Threshold or Rate

1. Edit `src/data/tax-configurations/2026.ts` (or relevant year)
2. Update `rules` object; increment version if needed
3. No service changes needed—policies/services use `TaxRules` dynamically

### Modifying Calculation Logic

1. Edit relevant service in `src/domain/tax/services/`
2. Update tests immediately (colocated `.test.ts`)
3. Run `npm test` to verify
4. Check `useTaxCalculator()` in feature if UI needs adjustment

### Adding a New Explanation Step

1. Update `TaxExplainFormatter` in `src/domain/tax/formatters/tax-explain.formatter.ts`
2. Explanation strings live in `src/i18n/*.json`
3. Add translations for RO + EN

### Currency Conversion

**Use `useCurrency()` hook:**
```typescript
const { convertToRON, convertBetweenCurrencies } = useCurrency();
const ronAmount = convertToRON(userInput, fromCurrency);
```
Exchange rates fetched once; stale >1 day triggers refresh.

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/domain/tax/` | DDD domain model (no UI) |
| `src/features/calculator/` | Tax calculator page + form |
| `src/data/tax-configurations/` | Year-specific rules |
| `src/shared/contexts/` | Global state (settings, currency, config) |
| `src/i18n/` | Translations |
| `docs/ARCHITECTURE.md` | Detailed architecture |
| `docs/DOMAIN_ARCHITECTURE.md` | DDD structure details |

---

## Red Flags / Avoid

- ❌ Importing React into `domain/` files
- ❌ Using raw numbers instead of `Money`/`TaxRate`/`Threshold`
- ❌ Calling `TaxInput` constructor directly (use `.create()`)
- ❌ Mutating domain objects (all immutable)
- ❌ Hardcoding thresholds/rates (use `getTaxRulesForYear()`)
- ❌ Mixing domain logic into feature components (extract to service)
- ❌ Adding translations without updating both `en.json` + `ro.json`
