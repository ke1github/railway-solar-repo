// lib/data-service.ts
/**
 * Data Service
 *
 * A unified service layer for data operations that abstracts the underlying data source.
 * Currently uses the mock data adapter, but can be switched to Appwrite or another
 * backend service in the future without changing the calling code.
 */

import { dataAdapter, queryToFilters } from "./data-adapter";
import { initializeMockData } from "./mock-data";
import {
  Site,
  EPCProject,
  SolarInstallation,
  EnergyProduction,
} from "../types/data-models";

// Initialize mock data
let dataInitialized = false;

// Site operations
export const SiteService = {
  // Get all sites with optional filtering
  async getAllSites(queryString?: string): Promise<Site[]> {
    await ensureDataInitialized();
    const filters = queryToFilters(queryString);
    return dataAdapter.getAll<Site>("sites", filters);
  },

  // Get a single site by ID
  async getSiteById(id: string): Promise<Site | null> {
    await ensureDataInitialized();
    return dataAdapter.getById<Site>("sites", id);
  },

  // Create a new site
  async createSite(
    siteData: Omit<Site, "id" | "createdAt" | "updatedAt">
  ): Promise<Site> {
    await ensureDataInitialized();
    return dataAdapter.create<Site>("sites", siteData);
  },

  // Update an existing site
  async updateSite(id: string, siteData: Partial<Site>): Promise<Site | null> {
    await ensureDataInitialized();
    return dataAdapter.update<Site>("sites", id, siteData);
  },

  // Delete a site
  async deleteSite(id: string): Promise<boolean> {
    await ensureDataInitialized();
    return dataAdapter.delete("sites", id);
  },
};

// EPC Project operations
export const EPCProjectService = {
  // Get all projects with optional filtering
  async getAllProjects(queryString?: string): Promise<EPCProject[]> {
    await ensureDataInitialized();
    const filters = queryToFilters(queryString);
    return dataAdapter.getAll<EPCProject>("epcProjects", filters);
  },

  // Get projects for a specific site
  async getProjectsBySiteId(siteId: string): Promise<EPCProject[]> {
    await ensureDataInitialized();
    return dataAdapter.getAll<EPCProject>("epcProjects", { siteId });
  },

  // Get a single project by ID
  async getProjectById(id: string): Promise<EPCProject | null> {
    await ensureDataInitialized();
    return dataAdapter.getById<EPCProject>("epcProjects", id);
  },

  // Create a new project
  async createProject(
    projectData: Omit<EPCProject, "id" | "createdAt" | "updatedAt">
  ): Promise<EPCProject> {
    await ensureDataInitialized();
    return dataAdapter.create<EPCProject>("epcProjects", projectData);
  },

  // Update an existing project
  async updateProject(
    id: string,
    projectData: Partial<EPCProject>
  ): Promise<EPCProject | null> {
    await ensureDataInitialized();
    return dataAdapter.update<EPCProject>("epcProjects", id, projectData);
  },

  // Delete a project
  async deleteProject(id: string): Promise<boolean> {
    await ensureDataInitialized();
    return dataAdapter.delete("epcProjects", id);
  },
};

// Solar Installation operations
export const SolarInstallationService = {
  // Get all installations with optional filtering
  async getAllInstallations(
    queryString?: string
  ): Promise<SolarInstallation[]> {
    await ensureDataInitialized();
    const filters = queryToFilters(queryString);
    return dataAdapter.getAll<SolarInstallation>("solarInstallations", filters);
  },

  // Get installations for a specific site
  async getInstallationsBySiteId(siteId: string): Promise<SolarInstallation[]> {
    await ensureDataInitialized();
    return dataAdapter.getAll<SolarInstallation>("solarInstallations", {
      siteId,
    });
  },

  // Get installations for a specific project
  async getInstallationsByProjectId(
    projectId: string
  ): Promise<SolarInstallation[]> {
    await ensureDataInitialized();
    return dataAdapter.getAll<SolarInstallation>("solarInstallations", {
      projectId,
    });
  },

  // Get a single installation by ID
  async getInstallationById(id: string): Promise<SolarInstallation | null> {
    await ensureDataInitialized();
    return dataAdapter.getById<SolarInstallation>("solarInstallations", id);
  },

  // Create a new installation
  async createInstallation(
    installationData: Omit<SolarInstallation, "id" | "createdAt" | "updatedAt">
  ): Promise<SolarInstallation> {
    await ensureDataInitialized();
    return dataAdapter.create<SolarInstallation>(
      "solarInstallations",
      installationData
    );
  },

  // Update an existing installation
  async updateInstallation(
    id: string,
    installationData: Partial<SolarInstallation>
  ): Promise<SolarInstallation | null> {
    await ensureDataInitialized();
    return dataAdapter.update<SolarInstallation>(
      "solarInstallations",
      id,
      installationData
    );
  },

  // Delete an installation
  async deleteInstallation(id: string): Promise<boolean> {
    await ensureDataInitialized();
    return dataAdapter.delete("solarInstallations", id);
  },
};

// Energy Production operations
export const EnergyProductionService = {
  // Get all energy production records with optional filtering
  async getAllEnergyProduction(
    queryString?: string
  ): Promise<EnergyProduction[]> {
    await ensureDataInitialized();
    const filters = queryToFilters(queryString);
    return dataAdapter.getAll<EnergyProduction>("energyProduction", filters);
  },

  // Get energy production for a specific installation
  async getEnergyProductionByInstallationId(
    installationId: string
  ): Promise<EnergyProduction[]> {
    await ensureDataInitialized();
    return dataAdapter.getAll<EnergyProduction>("energyProduction", {
      installationId,
    });
  },

  // Get energy production for a date range
  async getEnergyProductionByDateRange(
    installationId: string,
    startDate: string,
    endDate: string
  ): Promise<EnergyProduction[]> {
    await ensureDataInitialized();

    // Custom query to filter by date range
    return dataAdapter.query<EnergyProduction>("energyProduction", (items) => {
      return items
        .filter(
          (item) => (item as EnergyProduction).installationId === installationId
        )
        .filter((item) => {
          const date = (item as EnergyProduction).date;
          return date >= startDate && date <= endDate;
        })
        .sort((a, b) =>
          (a as EnergyProduction).date.localeCompare(
            (b as EnergyProduction).date
          )
        );
    });
  },

  // Get a single energy production record by ID
  async getEnergyProductionById(id: string): Promise<EnergyProduction | null> {
    await ensureDataInitialized();
    return dataAdapter.getById<EnergyProduction>("energyProduction", id);
  },

  // Create a new energy production record
  async createEnergyProduction(
    data: Omit<EnergyProduction, "id" | "createdAt" | "updatedAt">
  ): Promise<EnergyProduction> {
    await ensureDataInitialized();
    return dataAdapter.create<EnergyProduction>("energyProduction", data);
  },

  // Update an existing energy production record
  async updateEnergyProduction(
    id: string,
    data: Partial<EnergyProduction>
  ): Promise<EnergyProduction | null> {
    await ensureDataInitialized();
    return dataAdapter.update<EnergyProduction>("energyProduction", id, data);
  },

  // Delete an energy production record
  async deleteEnergyProduction(id: string): Promise<boolean> {
    await ensureDataInitialized();
    return dataAdapter.delete("energyProduction", id);
  },

  // Get total energy production for an installation
  async getTotalEnergyProduction(installationId: string): Promise<number> {
    await ensureDataInitialized();
    const records = await dataAdapter.getAll<EnergyProduction>(
      "energyProduction",
      { installationId }
    );
    return records.reduce((total, record) => total + record.productionKWh, 0);
  },
};

// Helper function to ensure data is initialized
async function ensureDataInitialized(): Promise<void> {
  if (!dataInitialized) {
    await initializeMockData();
    dataInitialized = true;
  }
}
