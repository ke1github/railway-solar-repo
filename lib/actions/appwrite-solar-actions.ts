// lib/actions/appwrite-solar-actions.ts
"use server";

import { appwriteService, COLLECTION_IDS } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";
import { SolarInstallation, EnergyProduction } from "@/types/appwrite-models";
import { Query } from "appwrite";

/**
 * Fetch all solar installations with optional filtering
 * @param queryString Query parameters for filtering results
 */
export async function getAllSolarInstallations(
  queryString?: string
): Promise<SolarInstallation[]> {
  try {
    const queries: string[] = [];

    if (queryString) {
      const params = new URLSearchParams(queryString);

      // Apply site filter if provided
      if (params.get("siteId")) {
        queries.push(Query.equal("siteId", params.get("siteId")!));
      }

      // Apply status filter if provided
      if (params.get("status") && params.get("status") !== "all") {
        queries.push(Query.equal("status", params.get("status")!));
      }

      // Apply search filter if provided
      if (params.get("search")) {
        const searchTerm = params.get("search")!;
        queries.push(Query.search("name", searchTerm));
      }

      // Apply sorting
      queries.push(Query.orderDesc("capacity"));
    }

    const { documents } =
      await appwriteService.listDocuments<SolarInstallation>(
        COLLECTION_IDS.SOLAR_INSTALLATIONS,
        queries
      );

    return documents;
  } catch (error) {
    console.error("Failed to fetch solar installations:", error);
    return [];
  }
}

/**
 * Fetch a single solar installation by ID
 * @param id The ID of the solar installation
 */
export async function getSolarInstallationById(
  id: string
): Promise<SolarInstallation | null> {
  try {
    const installation = await appwriteService.getDocument<SolarInstallation>(
      COLLECTION_IDS.SOLAR_INSTALLATIONS,
      id
    );
    return installation;
  } catch (error) {
    console.error(`Failed to fetch solar installation ${id}:`, error);
    return null;
  }
}

/**
 * Create a new solar installation
 * @param data The solar installation data
 */
export async function createSolarInstallation(
  data: Omit<
    SolarInstallation,
    keyof Omit<
      SolarInstallation,
      | "$id"
      | "$createdAt"
      | "$updatedAt"
      | "$permissions"
      | "$collectionId"
      | "$databaseId"
    >
  >
): Promise<SolarInstallation | null> {
  try {
    const installation =
      await appwriteService.createDocument<SolarInstallation>(
        COLLECTION_IDS.SOLAR_INSTALLATIONS,
        data
      );

    revalidatePath("/solar/installations");
    return installation;
  } catch (error) {
    console.error("Failed to create solar installation:", error);
    return null;
  }
}

/**
 * Update an existing solar installation
 * @param id The ID of the solar installation
 * @param data The updated solar installation data
 */
export async function updateSolarInstallation(
  id: string,
  data: Partial<SolarInstallation>
): Promise<SolarInstallation | null> {
  try {
    const installation =
      await appwriteService.updateDocument<SolarInstallation>(
        COLLECTION_IDS.SOLAR_INSTALLATIONS,
        id,
        data
      );

    revalidatePath(`/solar/installations/${id}`);
    revalidatePath("/solar/installations");
    return installation;
  } catch (error) {
    console.error(`Failed to update solar installation ${id}:`, error);
    return null;
  }
}

/**
 * Delete a solar installation
 * @param id The ID of the solar installation to delete
 */
export async function deleteSolarInstallation(id: string): Promise<boolean> {
  try {
    await appwriteService.deleteDocument(
      COLLECTION_IDS.SOLAR_INSTALLATIONS,
      id
    );

    revalidatePath("/solar/installations");
    return true;
  } catch (error) {
    console.error(`Failed to delete solar installation ${id}:`, error);
    return false;
  }
}

/**
 * Fetch energy production data for a solar installation
 * @param installationId The ID of the solar installation
 * @param startDate Optional start date for filtering
 * @param endDate Optional end date for filtering
 */
export async function getEnergyProductionData(
  installationId?: string,
  startDate?: string,
  endDate?: string
): Promise<EnergyProduction[]> {
  try {
    const queries: string[] = [];

    if (installationId) {
      queries.push(Query.equal("installationId", installationId));
    }

    if (startDate) {
      queries.push(Query.greaterThanEqual("date", startDate));
    }

    if (endDate) {
      queries.push(Query.lessThanEqual("date", endDate));
    }

    // Sort by date ascending
    queries.push(Query.orderAsc("date"));

    const { documents } = await appwriteService.listDocuments<EnergyProduction>(
      COLLECTION_IDS.ENERGY_PRODUCTION,
      queries
    );

    return documents;
  } catch (error) {
    console.error("Failed to fetch energy production data:", error);
    return [];
  }
}

/**
 * Create new energy production data
 * @param data The energy production data
 */
export async function createEnergyProduction(
  data: Omit<
    EnergyProduction,
    keyof Omit<
      EnergyProduction,
      | "$id"
      | "$createdAt"
      | "$updatedAt"
      | "$permissions"
      | "$collectionId"
      | "$databaseId"
    >
  >
): Promise<EnergyProduction | null> {
  try {
    const production = await appwriteService.createDocument<EnergyProduction>(
      COLLECTION_IDS.ENERGY_PRODUCTION,
      data
    );

    revalidatePath(`/solar/installations/${data.installationId}`);
    return production;
  } catch (error) {
    console.error("Failed to create energy production data:", error);
    return null;
  }
}

/**
 * Update energy production data
 * @param id The ID of the energy production record
 * @param data The updated energy production data
 */
export async function updateEnergyProduction(
  id: string,
  data: Partial<EnergyProduction>
): Promise<EnergyProduction | null> {
  try {
    const production = await appwriteService.updateDocument<EnergyProduction>(
      COLLECTION_IDS.ENERGY_PRODUCTION,
      id,
      data
    );

    if (production.installationId) {
      revalidatePath(`/solar/installations/${production.installationId}`);
    }

    return production;
  } catch (error) {
    console.error(`Failed to update energy production ${id}:`, error);
    return null;
  }
}

/**
 * Delete energy production data
 * @param id The ID of the energy production record to delete
 */
export async function deleteEnergyProduction(
  id: string,
  installationId?: string
): Promise<boolean> {
  try {
    await appwriteService.deleteDocument(COLLECTION_IDS.ENERGY_PRODUCTION, id);

    if (installationId) {
      revalidatePath(`/solar/installations/${installationId}`);
    }

    return true;
  } catch (error) {
    console.error(`Failed to delete energy production ${id}:`, error);
    return false;
  }
}
