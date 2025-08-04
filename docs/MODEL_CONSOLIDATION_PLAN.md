# Model Consolidation Plan

## Current Model Landscape

### Core Hierarchical Structure

- **Zone → Division → Station → Site → SolarInstallation → EnergyProduction**

### Legacy Models

- **RailwaySite** - Older model for railway sites
- **RailwaySiteExtended** - Extension with AI features
- **SolarProjectHierarchy** - Monolithic project hierarchy

## Consolidation Goals

1. **Eliminate Redundancy** - Remove duplicate model definitions while maintaining functionality
2. **Standardize Schema Validation** - Use Zod schemas as the source of truth for validation
3. **Improve Type Safety** - Leverage TypeScript types generated from Zod schemas
4. **Maintain Data Integrity** - Ensure no data loss during migration

## Phase 1: Immediate Improvements (Current Sprint)

### 1. Error Handling System

- ✅ Create standardized error handling with ApiError class
- ✅ Support Zod validation errors
- ✅ Support Mongoose database errors

### 2. Schema Consolidation

- [ ] Move all Zod schemas to `/lib/schemas` directory
- [ ] Consolidate duplicated schemas in `validation.ts` and `hierarchy-schemas.ts`
- [ ] Generate TypeScript interfaces from Zod schemas

### 3. Model Type Safety

- [ ] Update model files to use TypeScript interfaces derived from schemas
- [ ] Fix all `any` type usage across the codebase

## Phase 2: Model Transition (Next Sprint)

### 1. Add Migration Utilities

- [ ] Create migration scripts from legacy models to new models
- [ ] Add adapter functions between old and new data structures

### 2. Begin Legacy Model Deprecation

- [ ] Mark legacy models with `@deprecated` JSDoc comments
- [ ] Add warning logs when legacy models are accessed

## Phase 3: Full Consolidation (Future Sprint)

### 1. Complete Legacy Model Removal

- [ ] RailwaySite → Site
- [ ] RailwaySiteExtended → Site + AIExtension
- [ ] SolarProjectHierarchy → SolarProject, Phase, Task, etc.

### 2. Documentation Update

- [ ] Create comprehensive model documentation
- [ ] Update API documentation to reflect new model structure

## Legacy Models to Keep (For Now)

Some models must be retained in the short term due to their dependencies:

1. **RailwaySiteExtended** - Used extensively in `ai-project-actions.ts`
2. **SolarProjectHierarchy** - Used in `solar-project-actions.ts`

These will be migrated in Phase 2 and removed in Phase 3.

## Type Safety Improvements

The global.d.ts file has been updated with common type definitions:

- `ApiResponse<T>` for standardized API responses
- `GeoLocation` for location coordinates
- `DateRange` for time periods
- Various enum types for status, units, etc.
