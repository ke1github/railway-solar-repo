# Data Architecture

This document outlines the data architecture of the Railway Solar application.

## Current Implementation

The application currently uses a mock data implementation with a flexible adapter pattern that will allow for easy integration with Appwrite or other backends in the future.

### Key Components

1. **Data Adapter (`lib/data-adapter.ts`)**

   - Provides a generic CRUD interface
   - Currently implemented with in-memory mock data
   - Will be swappable with an Appwrite adapter in the future

2. **Mock Data (`lib/mock-data.ts`)**

   - Contains sample data for development and testing
   - Simulates realistic railway site data with solar installations

3. **Data Service (`lib/data-service.ts`)**

   - Main service layer that application components should interact with
   - Abstracts the underlying data source
   - Provides domain-specific methods for each entity type

4. **Data Models (`types/data-models.ts`)**
   - TypeScript interfaces defining the shape of our data entities
   - Ensures consistent data structure throughout the application

## Usage

### Example: Working with Sites

```typescript
import { SiteService } from "../lib/data-service";

// Get all sites
const getAllSites = async () => {
  const sites = await SiteService.getAllSites();
  return sites;
};

// Get a specific site
const getSite = async (id: string) => {
  const site = await SiteService.getSiteById(id);
  return site;
};

// Create a new site
const createSite = async (siteData) => {
  const newSite = await SiteService.createSite(siteData);
  return newSite;
};

// Update a site
const updateSite = async (id: string, updateData) => {
  const updatedSite = await SiteService.updateSite(id, updateData);
  return updatedSite;
};

// Delete a site
const deleteSite = async (id: string) => {
  const success = await SiteService.deleteSite(id);
  return success;
};
```

### Example: Working with Energy Production Data

```typescript
import { EnergyProductionService } from "../lib/data-service";

// Get energy production for a specific installation
const getEnergyData = async (installationId: string) => {
  const data =
    await EnergyProductionService.getEnergyProductionByInstallationId(
      installationId
    );
  return data;
};

// Get energy production for a date range
const getEnergyForDateRange = async (
  installationId: string,
  startDate: string,
  endDate: string
) => {
  const data = await EnergyProductionService.getEnergyProductionByDateRange(
    installationId,
    startDate,
    endDate
  );
  return data;
};

// Get total energy produced by an installation
const getTotalEnergy = async (installationId: string) => {
  const total = await EnergyProductionService.getTotalEnergyProduction(
    installationId
  );
  return total;
};
```

## Future Appwrite Integration

When ready to integrate with Appwrite:

1. Create an Appwrite adapter that implements the same interface as the current data adapter
2. Update the data service to use the Appwrite adapter instead of the mock adapter
3. No changes will be needed in the components that use the data service

This architecture ensures a smooth transition from mock data to a real backend when needed.
