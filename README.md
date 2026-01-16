# Romanian PFA Tax Calculator 2026

A single-page web application for estimating taxes and contributions for PFA (Authorized Individual) in Romania under the real taxation system for 2026.

## ⚠️ Important Disclaimer

**This application is only an estimation tool for financial planning.**

- Does not constitute fiscal or legal advice
- Values and thresholds are estimates and may differ from final 2026 legislation
- Minimum wage used in calculations is a placeholder and must be verified with official values
- Consult a tax specialist for specific situations
- Always verify current legislation

## 🚀 Features

- **Live calculation** of taxes and contributions (Income Tax 10%, CAS 25%, CASS 10%)
- **Dark/Light Mode** - Theme switching with persistence
- **Multi-Currency** - Support for RON, EUR, USD with automatic conversion
- **Monthly view** - Display available income monthly or annually
- **Settings page** - Centralized configuration for year, currency, theme
- **Improved year selector** - Year 2026 set as default
- **Step-by-step explanations** for each calculation
- **Saved scenarios** in localStorage (max 10) with comparison
- **JSON export** for scenarios
- **Responsive UI** with Tailwind CSS and modern design
- **Complete unit tests** for calculation logic

## 📦 Installation and Running

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview build
npm run preview
```

## 🎯 How to Use

1. **Configure settings:**
   - Click the ⚙️ (Settings) icon in the header
   - Select preferred theme (Dark/Light)
   - Choose fiscal year (2024-2027, default: 2026)
   - Select display currency (RON/EUR/USD)

2. **Enter data:**
   - Annual gross income (total receipts)
   - Annual deductible expenses
   - Check relevant options (employee, pensioner, etc.)
   - Enable "Show monthly available income" for monthly view

3. **View results:**
   - Results are calculated automatically (live)
   - See detailed breakdown: income tax, CAS, CASS
   - Consult step-by-step explanations
   - Values are displayed in selected currency

4. **Save scenarios:**
   - Enter a name for the scenario
   - Click "Save"
   - Compare up to 10 scenarios
   - Export scenarios as JSON

## 🔧 Modifying Tax Rules

Edit `src/tax-rules/2026.ts` to update values:

```typescript
export const rules2026: TaxRules = {
  year: 2026,
  minimumWageMonthly: 4050, // Update with official value
  rates: {
    incomeTax: 0.1,
    cas: 0.25,
    cass: 0.1,
  },
  casThresholds: [12, 24],
  cassThresholds: [6, 12, 24],
  cassMaxCap: 72,
  // ...
};
```

## 📝 Limitations

- **Not fiscal advice** - use only for estimates
- **Placeholder values** - verify official legislation for 2026
- **Simple real system** - does not cover all special cases
- **No backend** - all data is stored locally in browser
- **No complex validation** - assumes correct inputs

## 🧪 Tests

All tests pass successfully:

- ✅ 9 tests for calculation engine
- ✅ 5 tests for explanation generation
- ✅ 7 UI smoke tests

```bash
npm test
```

## 📊 Code Structure

The application uses a modern and scalable architecture:

```
src/
├── app/                    # Main application
├── features/              # Feature-based organization
│   ├── calculator/       # Tax calculator feature
│   ├── blog/            # Blog feature
│   └── settings/        # Settings page
├── shared/              # Shared code
│   ├── components/     # Reusable UI components
│   └── contexts/       # React contexts (theme, currency, settings)
├── domain/             # Business logic (DDD architecture)
│   └── tax/           # Tax domain
│       ├── models/        # Domain models (TaxInput, TaxResult, TaxBreakdown)
│       ├── value-objects/ # Value objects (Money, TaxRate, Threshold)
│       ├── services/      # Domain services (CAS, CASS, IncomeTax calculation)
│       ├── policies/      # Business policies (exemptions, thresholds)
│       └── formatters/    # Output formatters (explanations)
├── tax-rules/         # Tax rules by year (2024-2027)
├── i18n/              # Internationalization (ro, en)
└── lib/               # Utilities
```

**Principles:**

- **Pure functions** for calculation logic (testable)
- **Strict TypeScript** for safety
- **Clear separation** between domain logic and UI
- **Externalized configuration** for tax rules
- **Context API** for global state management
- **Kebab-case** for folders, **PascalCase** for components

---

**Built with React + TypeScript + Tailwind CSS**

_Open source project - contributions are welcome!_
