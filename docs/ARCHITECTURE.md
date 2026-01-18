# Architecture Guide

## Project Structure

Feature-based architecture with clear separation of concerns.

```
src/
├── app/                    # Application entry point
├── features/               # Feature modules (isolated, self-contained)
├── shared/                 # Shared resources (reusable across features)
├── domain/                 # Business logic (pure functions, no UI)
├── data/                   # Static data & tax configurations by year
├── i18n/                   # Internationalization (ro, en)
├── lib/                    # Utility functions
├── services/               # External services (API calls)
└── styles/                 # Global styles
```

---

## 🎯 Core Principles

### 1. **Feature-Based Organization**

Each feature is self-contained with its own components, hooks, and logic.

```
features/
├── calculator/
│   ├── components/         # Feature-specific components
│   ├── hooks/              # Feature-specific hooks
│   └── CalculatorPage.tsx  # Feature entry point
```

**Benefits:**

- Easy to locate related code
- Clear boundaries between features
- Scalable as the app grows

### 2. **Shared Resources**

Reusable code lives in `shared/` and is organized by type.

```
shared/
├── components/
│   ├── ui/                 # Reusable UI components
│   └── layout/             # Layout components
├── contexts/               # React contexts
└── hooks/                  # Reusable hooks
```

**Rule:** Only add to `shared/` if used by 2+ features.

### 3. **Domain Logic Separation**

Business logic is isolated from UI in `domain/`.

```
domain/
└── tax-engine/
    ├── compute.ts          # Pure functions
    ├── types.ts            # Type definitions
    └── explain.ts          # Business logic
```

**Benefits:**

- Testable without UI
- Reusable across different UIs
- Clear business rules

---

## 📦 Component Guidelines

### UI Components (`shared/components/ui/`)

**Purpose:** Reusable, presentational components

**Examples:**

- `IconButton` - Styled button with icon
- `Card` - Panel wrapper
- `MoneyInput` - Currency input field

**Rules:**

- No business logic
- Accept props for customization
- Export via barrel (`index.ts`)

### Feature Components (`features/*/components/`)

**Purpose:** Feature-specific, connected components

**Examples:**

- `TaxForm` - Calculator input form
- `ResultsCard` - Tax calculation results

**Rules:**

- Can use contexts and hooks
- Can contain business logic
- Only used within the feature

---

## 🪝 Hooks Guidelines

### Shared Hooks (`shared/hooks/`)

**Purpose:** Reusable logic across features

**Examples:**

- `useCurrency` - Currency conversion
- `useSettings` - App settings

### Feature Hooks (`features/*/hooks/`)

**Purpose:** Feature-specific logic

**Examples:**

- `useTaxCalculator` - Calculator state and logic

**Benefits:**

- Separates logic from UI
- Easier to test
- Reusable within feature

---

## 🎨 Import Patterns

### Barrel Exports

Use barrel exports (`index.ts`) for cleaner imports:

```typescript
// ✅ Good
import { IconButton, Card, MoneyInput } from '@/shared/components/ui';

// ❌ Avoid
import { IconButton } from '@/shared/components/ui/IconButton';
import { Card } from '@/shared/components/ui/Card';
import { MoneyInput } from '@/shared/components/ui/MoneyInput';
```

### Import Order

```typescript
// 1. External dependencies
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Shared resources
import { useCurrency } from '@/shared/contexts';
import { IconButton } from '@/shared/components/ui';

// 3. Feature resources
import { useTaxCalculator } from './hooks/useTaxCalculator';
import { TaxForm } from './components';

// 4. Domain logic
import { computeTaxes } from '@/domain';

// 5. Types
import type { TaxResult } from '@/domain/tax/models';
```

---

## 🧪 Testing Strategy

### Unit Tests

- Domain logic (`domain/`)
- Utility functions (`lib/`)
- Custom hooks

### Component Tests

- Shared UI components
- Feature components

### Integration Tests

- Feature pages
- User flows

---

## 📝 Naming Conventions

### Files

- Components: `PascalCase.tsx` (e.g., `TaxForm.tsx`)
- Hooks: `camelCase.ts` (e.g., `useTaxCalculator.ts`)
- Utils: `kebab-case.ts` (e.g., `format-currency.ts`)

### Components

- React components: `PascalCase`
- Props interfaces: `ComponentNameProps`

### Hooks

- Custom hooks: `use` prefix (e.g., `useTaxCalculator`)

---

## 🚀 Adding New Features

1. **Create feature directory**

   ```bash
   mkdir -p src/features/my-feature/{components,hooks}
   ```

2. **Create page component**

   ```typescript
   // src/features/my-feature/MyFeaturePage.tsx
   export const MyFeaturePage: React.FC = () => { ... }
   ```

3. **Add route**

   ```typescript
   // src/app/App.tsx
   <Route path="/my-feature" element={<MyFeaturePage />} />
   ```

4. **Create feature-specific components**

   ```bash
   src/features/my-feature/components/
   ```

5. **Extract logic to hooks**
   ```bash
   src/features/my-feature/hooks/
   ```

---

## 🎯 Best Practices

### ✅ Do

- Keep components small and focused
- Extract complex logic to hooks
- Use TypeScript for type safety
- Write meaningful prop interfaces
- Use barrel exports for cleaner imports

### ❌ Don't

- Mix business logic with UI
- Create circular dependencies
- Put everything in `shared/`
- Duplicate code across features
- Use inline styles (use CSS variables)

---

## 📚 Further Reading

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Feature-Sliced Design](https://feature-sliced.design/)
