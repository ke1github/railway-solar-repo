// scripts/cleanup-mongodb-models.md

# Cleaning Up MongoDB Models

This document provides a step-by-step guide for removing the MongoDB models from the project and transitioning to the new data adapter pattern.

## Step 1: Make sure data-service is working

Before removing any models, verify that the new data service is working properly:

1. Visit the `/data-service-example` page to ensure it loads and displays data correctly
2. Test creating, updating, and deleting data through the example interface
3. Make sure all the mock data is initializing correctly on app startup

## Step 2: Update action files

The following action files need to be updated to use the new data service instead of MongoDB models:

- `lib/actions/site-actions.ts` → Replace with `site-actions-new.ts`
- `lib/actions/epc-actions.ts` → Create a new version using data service
- `lib/actions/hierarchy-actions.ts` → Create a new version using data service
- `lib/actions/solar-actions.ts` → Create a new version using data service
- `lib/actions/solar-project-actions.ts` → Create a new version using data service
- `lib/actions/ai-project-actions.ts` → Create a new version using data service

For each file:

1. Create a new version of the file that uses the data service
2. Test the new version thoroughly
3. Replace the old file with the new version

## Step 3: Update model adapter file

The `lib/adapters/model-adapters.ts` file is importing from the models directory. Update this file to use the new data models from `types/data-models.ts` instead.

## Step 4: Update component imports

Check and update any components that directly import from the models directory:

- `components/solar/SolarInstallationList.tsx` - Update to use types from data-models.ts

## Step 5: Remove models directory

Once all references to the MongoDB models have been updated, you can safely remove the models directory:

```bash
# Make sure all changes are committed first
git add .
git commit -m "Update code to use data adapter instead of MongoDB models"

# Then remove the models directory
rm -rf models/
```

## Step 6: Remove MongoDB dependency

If no longer needed, you can remove the MongoDB dependency:

```bash
npm uninstall mongodb mongoose
```

Update the `.env` file to remove any MongoDB connection strings.

## Step 7: Clean up remaining files

- Remove `lib/mongodb.ts` if it's no longer needed
- Update README.md to reflect the new architecture
- Make sure documentation is up to date

## Step 8: Final testing

Thoroughly test the application to make sure everything works correctly with the new data adapter pattern.

## References

For more information on the new data architecture, see:

- `docs/DATA_ARCHITECTURE.md` - Details on the new data adapter pattern
- `lib/data-adapter.ts` - The core adapter interface
- `lib/data-service.ts` - Domain-specific service layer
- `types/data-models.ts` - Type definitions for our data models
