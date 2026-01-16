# Domain Architecture - Tax Calculation

This document describes the Domain-Driven Design (DDD) architecture of the tax calculation domain.

## Overview

The tax calculation domain follows DDD principles with clear separation of concerns:

```
src/domain/tax/
├── models/           # Domain Models
├── value-objects/    # Value Objects (immutable)
├── services/         # Domain Services
├── policies/         # Business Policies
└── formatters/       # Output Formatters
```

## Architecture Layers

### 1. Value Objects (`value-objects/`)

Immutable objects that represent concepts with no identity, only value.

#### **Money**

- Represents monetary amounts
- Ensures non-negative values
- Provides arithmetic operations (add, subtract, multiply, divide)
- Immutable - all operations return new instances

```typescript
const amount = Money.from(100);
const tax = amount.multiply(0.25); // 25 RON
const total = amount.add(tax); // 125 RON
```

#### **TaxRate**

- Represents tax rates (0-1 range)
- Can be created from decimal (0.25) or percentage (25%)
- Provides `applyTo(Money)` method

```typescript
const rate = TaxRate.fromPercentage(25); // 25%
const tax = rate.applyTo(Money.from(100)); // 25 RON
```

#### **Threshold**

- Represents income thresholds in minimum wages
- Encapsulates threshold logic
- Provides comparison methods

```typescript
const threshold = Threshold.from(6, minimumWage);
const isAbove = threshold.isExceededBy(netIncome);
```

### 2. Models (`models/`)

Domain entities that represent core business concepts.

#### **TaxInput**

- Represents input data for tax calculation
- Validates input (year range, conflicting statuses)
- Provides factory method `TaxInput.create()`
- Immutable with `with()` method for modifications

#### **TaxBreakdown**

- Represents detailed tax calculation results
- Provides methods: `getTotal()`, `getNetAfterTaxes()`, `calculateEffectiveRate()`
- Converts to plain objects for backward compatibility

#### **TaxResult**

- Aggregates input, breakdown, and explanation steps
- Provides convenience methods: `getEffectiveRate()`, `getTakeHome()`

### 3. Policies (`policies/`)

Encapsulate business rules and decision logic.

#### **CASExemptionPolicy**

- Determines CAS (pension) exemptions
- Rules: pensioners exempt, below threshold exempt
- Selects applicable threshold based on income

#### **CASSThresholdPolicy**

- Determines CASS (health insurance) calculation base
- Different rules for employees/pensioners vs. non-employees
- Handles threshold selection and maximum caps

### 4. Services (`services/`)

Orchestrate domain logic and calculations.

#### **CASCalculationService**

- Calculates CAS (pension contribution)
- Uses CASExemptionPolicy for exemptions
- Returns structured result with base, amount, exemption info

#### **CASSCalculationService**

- Calculates CASS (health insurance contribution)
- Uses CASSThresholdPolicy for threshold selection
- Handles employee/pensioner special cases

#### **IncomeTaxCalculationService**

- Calculates income tax
- Simple: taxable income × rate

#### **TaxCalculationService** (Main Orchestrator)

- Coordinates all calculation services
- Applies tax rules
- Generates complete TaxResult

### 5. Formatters (`formatters/`)

Generate human-readable output.

#### **TaxExplainFormatter**

- Generates step-by-step explanations
- Formats amounts and percentages
- Provides context for each calculation step

## Usage Examples

### Basic Calculation

```typescript
import { TaxCalculationService, TaxInput } from '@/domain/tax';
import { rules2026 } from '@/tax-rules';

const service = new TaxCalculationService();

const input = TaxInput.create({
  year: 2026,
  grossIncome: 100000,
  deductibleExpenses: 20000,
  isVatPayer: false,
  isEmployee: false,
  isPensioner: false,
});

const result = service.calculate(input, rules2026);

console.log(result.getTakeHome()); // Net after taxes
console.log(result.getEffectiveRate()); // Effective tax rate
console.log(result.steps); // Explanation steps
```

### Using Value Objects

```typescript
import { Money, TaxRate } from '@/domain/tax';

const income = Money.from(100000);
const expenses = Money.from(20000);
const netIncome = income.subtract(expenses); // 80000 RON

const casRate = TaxRate.fromPercentage(25);
const cas = casRate.applyTo(netIncome); // 20000 RON
```

### Backward Compatibility

The old API is still supported through a compatibility layer:

```typescript
import { computeTaxes } from '@/domain';

const result = computeTaxes(
  {
    year: 2026,
    grossIncome: 100000,
    deductibleExpenses: 20000,
    // ... other fields
  },
  rules2026
);

// Returns plain object (not domain models)
console.log(result.breakdown.total);
```

## Benefits

### 1. **Single Responsibility**

Each service/policy has one clear responsibility

### 2. **Testability**

- Value objects are pure functions
- Services can be tested independently
- Policies can be tested in isolation

### 3. **Type Safety**

- `Money` instead of `number` prevents errors
- `TaxRate` ensures valid rates
- Domain models enforce business rules

### 4. **Extensibility**

- Easy to add new tax types
- New policies can be added without modifying existing code
- Open/Closed Principle

### 5. **Maintainability**

- Clear structure
- Business logic centralized in policies
- Easy to understand and modify

## Migration Guide

The old `domain/tax-engine` folder has been removed. All types are now exported from `domain/tax`.

To use the new architecture:

1. Import from the domain:

   ```typescript
   // Backward compatible API
   import { computeTaxes } from '@/domain';

   // New domain API
   import { TaxCalculationService, TaxInput } from '@/domain/tax';

   // Types
   import type { TaxResult, TaxBreakdown } from '@/domain/tax/models';
   ```

2. Use domain models:

   ```typescript
   const service = new TaxCalculationService();
   const input = TaxInput.create({
     /* ... */
   });
   const result = service.calculate(input, rules);
   ```

3. Access results through domain model methods:
   ```typescript
   result.getTakeHome();
   result.getEffectiveRate();
   result.breakdown.getTotal();
   ```
