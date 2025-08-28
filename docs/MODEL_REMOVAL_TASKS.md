# MongoDB Models Removal Task List

## Data Service Implementation

- [x] Create data adapter interface
- [x] Implement mock data adapter
- [x] Define data models in types/data-models.ts
- [x] Create domain-specific data service
- [x] Initialize mock data on app startup
- [x] Create example page to demonstrate data service
- [x] Document new data architecture

## Server Action Files Migration

- [ ] site-actions.ts
  - [x] Create initial version (site-actions-new.ts)
  - [x] Fix type issues
  - [ ] Test thoroughly
  - [ ] Replace original file
- [ ] epc-actions.ts
  - [x] Create new version
  - [ ] Test thoroughly
  - [ ] Replace original file
- [ ] solar-actions.ts
  - [x] Create new version
  - [ ] Test thoroughly
  - [ ] Replace original file
- [ ] hierarchy-actions.ts
  - [ ] Create new version
  - [ ] Test thoroughly
  - [ ] Replace original file
- [ ] solar-project-actions.ts
  - [ ] Create new version
  - [ ] Test thoroughly
  - [ ] Replace original file
- [ ] ai-project-actions.ts
  - [ ] Create new version (if needed)
  - [ ] Test thoroughly
  - [ ] Replace original file

## Component Updates

- [ ] SolarInstallationList.tsx
  - [ ] Update to use types from data-models.ts
- [ ] Any other components using model imports
  - [ ] Identify and update as needed

## Clean Up

- [ ] Remove models directory
- [ ] Remove MongoDB dependencies
- [ ] Remove lib/mongodb.ts
- [ ] Update README.md
- [ ] Final testing

## Documentation

- [x] Create WHY_REMOVE_MODELS.md
- [x] Create cleanup-mongodb-models.md guide
- [x] Create action-files-migration-plan.md
- [ ] Update any other documentation as needed

## Future Appwrite Integration

- [x] Keep future-appwrite.ts and appwrite-models.ts for reference
- [ ] Plan for Appwrite adapter implementation when ready
