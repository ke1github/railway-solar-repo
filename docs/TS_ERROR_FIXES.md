# Railway Solar App - TS Error Fix Guide

## Overview of TypeScript Errors

The application has several TypeScript errors that need to be fixed:

1. **`any` type usage**

   - Replace all occurrences of the `any` type with more specific types
   - Most commonly found in utility files

2. **Unused variables and imports**

   - Remove or use variables that are declared but never used
   - Remove unused imports

3. **HTML link issues in Next.js**
   - Replace regular `<a>` tags with Next.js `<Link>` components

## Models Structure

The application has several models that form a hierarchy:

```
Zone → Division → Station → Site → SolarInstallation → EnergyProduction
```

Additional models:

- `RailwaySite` - Legacy model for railway sites
- `RailwaySiteExtended` - Extension with AI features
- `EPCProject` - For EPC project tracking
- `SolarProjectHierarchy` - For solar project management

## Recommendations

1. **Don't delete models yet** - The models are still referenced in action files:

   - `RailwaySiteExtended` is used in `ai-project-actions.ts`
   - `SolarProjectHierarchy` is used in `solar-project-actions.ts`

2. **Fix TypeScript errors**:

   - Replace `any` types with `unknown` or more specific types
   - Fix unused variable warnings by removing them
   - Replace HTML links with Next.js `<Link>` components

3. **Code organization improvements**:
   - Consider consolidating the model hierarchy
   - Document the relationship between models
   - Add appropriate TypeScript interfaces in global.d.ts

## Specific Files to Fix

1. **Components with TypeScript errors**:

   - `EnergyProductionChart.tsx`
   - `SolarInstallationList.tsx`

2. **Utility files with TypeScript errors**:

   - `data-validation.ts`
   - `notification-service.ts`

3. **Action files with TypeScript errors**:
   - `ai-project-actions.ts`
   - `hierarchy-actions.ts`
   - `solar-actions.ts`
   - `solar-project-actions.ts`
