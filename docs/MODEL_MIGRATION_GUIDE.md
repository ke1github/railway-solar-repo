# Model Migration Guide

This guide outlines the process for migrating from legacy models to the new consolidated models.

## Model Migration Path

### RailwaySite → Site

The RailwaySite model should be migrated to the Site model which provides more comprehensive features and better integration with the hierarchy.

```typescript
// Old approach
import { RailwaySite } from "@/models";

const railwaySite = await RailwaySite.findOne({ id: siteId });
```

```typescript
// New approach
import { Site } from "@/models";

const site = await Site.findOne({ siteCode: siteId });
```

### RailwaySiteExtended → Site + AI Extension

The AI functionality in RailwaySiteExtended should be migrated to use the Site model with AI-specific fields.

```typescript
// Old approach
import { RailwaySiteExtended } from "@/models";

const siteWithAI = await RailwaySiteExtended.findOne({ siteId });
```

```typescript
// New approach - Option 1: Use Site model with metadata field
import { Site } from "@/models";

const site = await Site.findOne({
  siteCode: siteId,
  "metadata.aiProcessed": true,
});

// New approach - Option 2: Use adapter to convert between models
import { extendedSiteToSite } from "@/lib/adapters/model-adapters";

const legacySite = await RailwaySiteExtended.findOne({ siteId });
logModelDeprecation("RailwaySiteExtended");
const siteData = extendedSiteToSite(legacySite);
```

### SolarProjectHierarchy → Specialized Models

The monolithic SolarProjectHierarchy model should be broken down into separate specialized models.

```typescript
// Old approach
import { SolarProject } from "@/models";

const project = await SolarProject.findById(projectId).populate("phases");
```

```typescript
// New approach
import { Project, Phase, WorkPackage, Task } from "@/models";

const project = await Project.findById(projectId);
const phases = await Phase.find({ projectId });
const workPackages = await WorkPackage.find({
  phaseId: { $in: phases.map((p) => p._id) },
});
```

## Using the Adapter Utilities

The model-adapters.ts file contains utilities to help with the migration:

```typescript
import {
  railwaySiteToSite,
  extendedSiteToSite,
  solarProjectToPhases,
  logModelDeprecation,
} from "@/lib/adapters/model-adapters";

// Log deprecation warnings when using legacy models
logModelDeprecation("RailwaySiteExtended");

// Convert between models
const site = railwaySiteToSite(railwaySite);
const extendedSite = extendedSiteToSite(railwaySiteExtended);
const phases = solarProjectToPhases(solarProject);
```

## Migration Strategy

1. **Add Deprecation Warnings**: Add deprecation warnings to legacy model usage
2. **Implement Adapters**: Use adapter functions to convert between model formats
3. **Migrate Features Incrementally**: Update one feature at a time to use the new models
4. **Data Migration**: Create scripts to migrate existing data from old to new models
5. **Remove Legacy Models**: Once all features are migrated, remove the legacy models

## Recommended Order of Migration

1. First migrate `RailwaySite` to `Site`
2. Then migrate `SolarProjectHierarchy` to specialized models
3. Finally migrate `RailwaySiteExtended` to `Site` with AI extensions

## Testing Migration

Each migration step should include:

1. Unit tests for the adapter functions
2. Integration tests for the new model implementation
3. Comparison tests to ensure data equivalence before and after migration
