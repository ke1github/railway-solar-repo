// scripts/action-files-migration-plan.md

# Action Files Migration Plan

This document outlines the plan for migrating each action file from using MongoDB models to using our new data adapter pattern.

## 1. site-actions.ts

**Status**: Initial version created as `site-actions-new.ts`

**Required Changes**:

- Fix type issues in the new file
- Test thoroughly
- Replace the old file with the new version

## 2. epc-actions.ts

**Status**: Needs migration

**Required Changes**:

- Create a new version using `EPCProjectService` from data-service.ts
- Convert between the API format and the data service format
- Implement all the necessary CRUD operations
- Handle any specific business logic from the original file

## 3. solar-actions.ts

**Status**: Needs migration

**Required Changes**:

- Create a new version using `SolarInstallationService` and `EnergyProductionService`
- Map between the original data format and the new data models
- Implement all required operations

## 4. hierarchy-actions.ts

**Status**: Needs migration

**Required Changes**:

- Create a separate service for hierarchy data if needed
- Implement zone, division, and station operations using the data adapter pattern
- Maintain compatibility with the existing API

## 5. solar-project-actions.ts

**Status**: Needs migration

**Required Changes**:

- Create a new version using the data service
- Update to use the new data models

## 6. ai-project-actions.ts

**Status**: Needs migration

**Required Changes**:

- Evaluate if this file needs to be preserved
- If needed, create a new version using the data service

## Implementation Strategy

For each action file:

1. Create a new file with `-new` suffix
2. Implement the necessary functionality using the data service
3. Test the new implementation thoroughly
4. Once verified, replace the original file with the new version

## Testing

For each migrated file:

- Test all CRUD operations
- Test any specialized business logic
- Ensure compatibility with existing frontend components
- Verify data formatting and validation
