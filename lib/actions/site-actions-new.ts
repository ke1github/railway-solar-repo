// lib/actions/site-actions-new.ts
"use server";

import { revalidatePath } from "next/cache";
import { SiteService } from "../data-service";

export interface SiteFormData {
  id?: string;
  address: string;
  latitude: number;
  longitude: number;
  sanctionedLoad: string;
  locationName: string;
  cluster: string;
  zone: string;
  consigneeDetails: string;
  rooftopArea: number;
  feasibleArea: number;
  feasibleCapacity: number;
  status:
    | "planning"
    | "survey"
    | "design"
    | "construction"
    | "operational"
    | "maintenance";
}

export async function createSite(formData: FormData) {
  try {
    const siteData: Partial<SiteFormData> = {
      address: formData.get("address") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      sanctionedLoad: formData.get("sanctionedLoad") as string,
      locationName: formData.get("locationName") as string,
      cluster: formData.get("cluster") as string,
      zone: formData.get("zone") as string,
      consigneeDetails: formData.get("consigneeDetails") as string,
      rooftopArea: parseFloat(formData.get("rooftopArea") as string),
      feasibleArea: parseFloat(formData.get("feasibleArea") as string),
      feasibleCapacity: parseFloat(formData.get("feasibleCapacity") as string),
      status: formData.get("status") as
        | "planning"
        | "survey"
        | "design"
        | "construction"
        | "operational"
        | "maintenance",
    };

    // Convert to our data model format
    const newSiteData = {
      name: siteData.locationName || "",
      location: {
        latitude: siteData.latitude ?? 0,
        longitude: siteData.longitude ?? 0,
        address: siteData.address || undefined,
        city: siteData.cluster || "",
        country: "United Kingdom",
      },
      status: mapStatus(siteData.status),
      siteType: "station",
      area: siteData.rooftopArea ?? undefined,
      description: `Sanctioned Load: ${
        siteData.sanctionedLoad || ""
      }, Consignee: ${siteData.consigneeDetails || ""}`,
      metadata: {
        zone: siteData.zone || "",
        feasibleArea: siteData.feasibleArea ?? 0,
        feasibleCapacity: siteData.feasibleCapacity ?? 0,
        originalStatus: siteData.status || "planning",
      },
    };

    // Create the site using our data service
    const site = await SiteService.createSite(newSiteData);

    revalidatePath("/sites");
    revalidatePath("/");

    return { success: true, site };
  } catch (error) {
    console.error("Error creating site:", error);
    return { success: false, error: "Failed to create site" };
  }
}

export async function updateSite(formData: FormData) {
  try {
    const siteId = formData.get("id") as string;

    const siteData: Partial<SiteFormData> = {
      address: formData.get("address") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      sanctionedLoad: formData.get("sanctionedLoad") as string,
      locationName: formData.get("locationName") as string,
      cluster: formData.get("cluster") as string,
      zone: formData.get("zone") as string,
      consigneeDetails: formData.get("consigneeDetails") as string,
      rooftopArea: parseFloat(formData.get("rooftopArea") as string),
      feasibleArea: parseFloat(formData.get("feasibleArea") as string),
      feasibleCapacity: parseFloat(formData.get("feasibleCapacity") as string),
      status: formData.get("status") as
        | "planning"
        | "survey"
        | "design"
        | "construction"
        | "operational"
        | "maintenance",
    };

    // Convert to our data model format
    const updatedSiteData = {
      name: siteData.locationName || "",
      location: {
        latitude: siteData.latitude ?? 0,
        longitude: siteData.longitude ?? 0,
        address: siteData.address || undefined,
        city: siteData.cluster || "",
        country: "United Kingdom",
      },
      status: mapStatus(siteData.status),
      area: siteData.rooftopArea ?? undefined,
      description: `Sanctioned Load: ${
        siteData.sanctionedLoad || ""
      }, Consignee: ${siteData.consigneeDetails || ""}`,
      metadata: {
        zone: siteData.zone || "",
        feasibleArea: siteData.feasibleArea ?? 0,
        feasibleCapacity: siteData.feasibleCapacity ?? 0,
        originalStatus: siteData.status || "planning",
      },
    };

    // Update the site using our data service
    const site = await SiteService.updateSite(siteId, updatedSiteData);

    revalidatePath(`/sites/${siteId}`);
    revalidatePath("/sites");
    revalidatePath("/");

    return { success: true, site };
  } catch (error) {
    console.error("Error updating site:", error);
    return { success: false, error: "Failed to update site" };
  }
}

export async function deleteSite(id: string) {
  try {
    await SiteService.deleteSite(id);

    revalidatePath("/sites");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting site:", error);
    return { success: false, error: "Failed to delete site" };
  }
}

export async function getSite(id: string) {
  try {
    const site = await SiteService.getSiteById(id);

    if (!site) {
      return { success: false, error: "Site not found" };
    }

    // Convert to SiteFormData format
    const siteFormData: SiteFormData = {
      id: site.id,
      address: site.location.address || "",
      latitude: site.location.latitude,
      longitude: site.location.longitude,
      sanctionedLoad:
        site.description?.split("Sanctioned Load: ")[1]?.split(",")[0] || "",
      locationName: site.name,
      cluster: site.location.city || "",
      zone: (site.metadata?.zone as string) || "",
      consigneeDetails: site.description?.split("Consignee: ")[1] || "",
      rooftopArea: site.area || 0,
      feasibleArea: (site.metadata?.feasibleArea as number) || 0,
      feasibleCapacity: (site.metadata?.feasibleCapacity as number) || 0,
      status:
        (site.metadata?.originalStatus as SiteFormData["status"]) || "planning",
    };

    return { success: true, site: siteFormData };
  } catch (error) {
    console.error("Error fetching site:", error);
    return { success: false, error: "Failed to fetch site" };
  }
}

export async function getAllSites() {
  try {
    const sites = await SiteService.getAllSites();
    return { success: true, sites };
  } catch (error) {
    console.error("Error fetching sites:", error);
    return { success: false, error: "Failed to fetch sites" };
  }
}

export async function getDashboardStats() {
  try {
    const sites = await SiteService.getAllSites();

    // Calculate statistics
    const totalSites = sites.length;
    const totalCapacity = sites.reduce(
      (sum, site) => sum + ((site.metadata?.feasibleCapacity as number) || 0),
      0
    );
    const sitesByStatus = sites.reduce((acc: Record<string, number>, site) => {
      const status = site.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Get recent sites
    const recentSites = sites
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((site) => ({
        id: site.id,
        locationName: site.name,
        address: site.location.address || "",
        feasibleCapacity: (site.metadata?.feasibleCapacity as number) || 0,
        status: site.status,
      }));

    return {
      success: true,
      stats: {
        totalSites,
        totalCapacity,
        sitesByStatus,
        recentSites,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

// Helper function to map status
function mapStatus(
  status: string | undefined
): "active" | "inactive" | "planned" | "under_construction" {
  if (!status) return "planned";

  switch (status) {
    case "operational":
    case "maintenance":
      return "active";
    case "construction":
      return "under_construction";
    case "planning":
    case "survey":
    case "design":
      return "planned";
    default:
      return "planned";
  }
}
