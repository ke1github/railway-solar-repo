// lib/actions/appwrite-site-actions.ts
"use server";

import { appwriteService, COLLECTION_IDS } from "@/lib/appwrite";
import { revalidatePath } from "next/cache";
import { Site } from "@/types/appwrite-models";
import { Query } from "appwrite";

/**
 * Fetch all sites with optional filtering
 * @param queryString Query parameters for filtering results
 */
export async function getAllSites(queryString?: string): Promise<Site[]> {
  try {
    const queries: string[] = [];

    if (queryString) {
      const params = new URLSearchParams(queryString);

      // Apply division filter if provided
      if (params.get("division")) {
        queries.push(Query.equal("division", params.get("division")!));
      }

      // Apply zone filter if provided
      if (params.get("zone")) {
        queries.push(Query.equal("zone", params.get("zone")!));
      }

      // Apply type filter if provided
      if (params.get("type") && params.get("type") !== "all") {
        queries.push(Query.equal("type", params.get("type")!));
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
      const sortField = params.get("sortField") || "name";
      const sortDirection =
        params.get("sortDirection") === "desc" ? "desc" : "asc";

      if (sortDirection === "desc") {
        queries.push(Query.orderDesc(sortField));
      } else {
        queries.push(Query.orderAsc(sortField));
      }
    } else {
      // Default sorting by name
      queries.push(Query.orderAsc("name"));
    }

    const { documents } = await appwriteService.listDocuments<Site>(
      COLLECTION_IDS.SITES,
      queries
    );

    return documents;
  } catch (error) {
    console.error("Failed to fetch sites:", error);
    return [];
  }
}

/**
 * Fetch a single site by ID
 * @param id The ID of the site
 */
export async function getSiteById(id: string): Promise<Site | null> {
  try {
    const site = await appwriteService.getDocument<Site>(
      COLLECTION_IDS.SITES,
      id
    );
    return site;
  } catch (error) {
    console.error(`Failed to fetch site ${id}:`, error);
    return null;
  }
}

/**
 * Create a new site
 * @param data The site data
 */
export async function createSite(
  data: Omit<
    Site,
    keyof Omit<
      Site,
      | "$id"
      | "$createdAt"
      | "$updatedAt"
      | "$permissions"
      | "$collectionId"
      | "$databaseId"
    >
  >
): Promise<Site | null> {
  try {
    const site = await appwriteService.createDocument<Site>(
      COLLECTION_IDS.SITES,
      data
    );

    revalidatePath("/sites");
    return site;
  } catch (error) {
    console.error("Failed to create site:", error);
    return null;
  }
}

/**
 * Update an existing site
 * @param id The ID of the site
 * @param data The updated site data
 */
export async function updateSite(
  id: string,
  data: Partial<Site>
): Promise<Site | null> {
  try {
    const site = await appwriteService.updateDocument<Site>(
      COLLECTION_IDS.SITES,
      id,
      data
    );

    revalidatePath(`/sites/${id}`);
    revalidatePath("/sites");
    return site;
  } catch (error) {
    console.error(`Failed to update site ${id}:`, error);
    return null;
  }
}

/**
 * Delete a site
 * @param id The ID of the site to delete
 */
export async function deleteSite(id: string): Promise<boolean> {
  try {
    await appwriteService.deleteDocument(COLLECTION_IDS.SITES, id);

    revalidatePath("/sites");
    return true;
  } catch (error) {
    console.error(`Failed to delete site ${id}:`, error);
    return false;
  }
}

/**
 * Get site statistics
 * Returns summary statistics about sites
 */
export async function getSiteStatistics(): Promise<{
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  totalCapacity: number;
}> {
  try {
    const { documents, total } = await appwriteService.listDocuments<Site>(
      COLLECTION_IDS.SITES
    );

    // Calculate statistics
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let totalCapacity = 0;

    documents.forEach((site) => {
      // Count by status
      byStatus[site.status] = (byStatus[site.status] || 0) + 1;

      // Count by type
      byType[site.type] = (byType[site.type] || 0) + 1;

      // Sum capacity
      totalCapacity += site.capacity || 0;
    });

    return {
      total,
      byStatus,
      byType,
      totalCapacity,
    };
  } catch (error) {
    console.error("Failed to get site statistics:", error);
    return {
      total: 0,
      byStatus: {},
      byType: {},
      totalCapacity: 0,
    };
  }
}
