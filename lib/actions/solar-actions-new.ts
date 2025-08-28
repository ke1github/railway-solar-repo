// lib/actions/solar-actions-new.ts
"use server";

import { revalidatePath } from "next/cache";
import {
  SolarInstallationService,
  EnergyProductionService,
} from "../data-service";
import { z } from "zod";
import { EnergyProduction, SolarInstallation } from "../../types/data-models";

// Schema for solar installation form data validation
const solarInstallationFormSchema = z.object({
  id: z.string().optional(),
  siteId: z.string(),
  projectId: z.string().optional(),
  capacity: z.number().positive(),
  panelType: z.string(),
  panelCount: z.number().int().positive(),
  installedDate: z.string().optional(),
  status: z.enum([
    "planned",
    "installing",
    "operational",
    "maintenance",
    "decommissioned",
  ]),
  efficiency: z.number().min(0).max(100).optional(),
  orientation: z.string().optional(),
  tilt: z.number().min(0).max(90).optional(),
  inverterType: z.string().optional(),
  inverterCount: z.number().int().min(0).optional(),
  installerCompany: z.string().optional(),
  installerContactName: z.string().optional(),
  installerContactEmail: z.string().email().optional(),
  installerContactPhone: z.string().optional(),
});

/**
 * Create a new solar installation
 */
export async function createSolarInstallation(formData: FormData) {
  try {
    // Parse and validate form data
    const rawData = Object.fromEntries(formData.entries());

    // Convert string values to appropriate types
    const parsedData = {
      siteId: String(rawData.siteId || ""),
      projectId: rawData.projectId ? String(rawData.projectId) : undefined,
      capacity: parseFloat(String(rawData.capacity || "0")),
      panelType: String(rawData.panelType || ""),
      panelCount: parseInt(String(rawData.panelCount || "0"), 10),
      installedDate: rawData.installedDate
        ? String(rawData.installedDate)
        : undefined,
      status: String(rawData.status || "planned") as z.infer<
        typeof solarInstallationFormSchema
      >["status"],
      efficiency: rawData.efficiency
        ? parseFloat(String(rawData.efficiency))
        : undefined,
      orientation: rawData.orientation
        ? String(rawData.orientation)
        : undefined,
      tilt: rawData.tilt ? parseFloat(String(rawData.tilt)) : undefined,
      inverterType: rawData.inverterType
        ? String(rawData.inverterType)
        : undefined,
      inverterCount: rawData.inverterCount
        ? parseInt(String(rawData.inverterCount), 10)
        : undefined,
      installerCompany: rawData.installerCompany
        ? String(rawData.installerCompany)
        : undefined,
      installerContactName: rawData.installerContactName
        ? String(rawData.installerContactName)
        : undefined,
      installerContactEmail: rawData.installerContactEmail
        ? String(rawData.installerContactEmail)
        : undefined,
      installerContactPhone: rawData.installerContactPhone
        ? String(rawData.installerContactPhone)
        : undefined,
    };

    // Validate the data
    const validatedData = solarInstallationFormSchema.parse(parsedData);

    // Create installation data for the service
    const installationData = {
      siteId: validatedData.siteId,
      projectId: validatedData.projectId,
      capacity: validatedData.capacity,
      panelType: validatedData.panelType,
      panelCount: validatedData.panelCount,
      installedDate: validatedData.installedDate,
      status: validatedData.status,
      efficiency: validatedData.efficiency,
      orientation: validatedData.orientation,
      tilt: validatedData.tilt,
      inverterType: validatedData.inverterType,
      inverterCount: validatedData.inverterCount,
      installerInfo: validatedData.installerCompany
        ? {
            company: validatedData.installerCompany,
            contactName: validatedData.installerContactName,
            contactEmail: validatedData.installerContactEmail,
            contactPhone: validatedData.installerContactPhone,
          }
        : undefined,
    };

    // Create the installation using our data service
    const installation = await SolarInstallationService.createInstallation(
      installationData
    );

    revalidatePath("/solar/installations");
    revalidatePath(`/sites/${validatedData.siteId}`);

    return { success: true, installation };
  } catch (error) {
    console.error("Error creating solar installation:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.format(),
      };
    }
    return { success: false, error: "Failed to create solar installation" };
  }
}

/**
 * Update an existing solar installation
 */
export async function updateSolarInstallation(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) {
      return { success: false, error: "Installation ID is required" };
    }

    // Parse and validate form data
    const rawData = Object.fromEntries(formData.entries());

    // Convert string values to appropriate types
    const parsedData = {
      id,
      siteId: String(rawData.siteId || ""),
      projectId: rawData.projectId ? String(rawData.projectId) : undefined,
      capacity: parseFloat(String(rawData.capacity || "0")),
      panelType: String(rawData.panelType || ""),
      panelCount: parseInt(String(rawData.panelCount || "0"), 10),
      installedDate: rawData.installedDate
        ? String(rawData.installedDate)
        : undefined,
      status: String(rawData.status || "planned") as z.infer<
        typeof solarInstallationFormSchema
      >["status"],
      efficiency: rawData.efficiency
        ? parseFloat(String(rawData.efficiency))
        : undefined,
      orientation: rawData.orientation
        ? String(rawData.orientation)
        : undefined,
      tilt: rawData.tilt ? parseFloat(String(rawData.tilt)) : undefined,
      inverterType: rawData.inverterType
        ? String(rawData.inverterType)
        : undefined,
      inverterCount: rawData.inverterCount
        ? parseInt(String(rawData.inverterCount), 10)
        : undefined,
      installerCompany: rawData.installerCompany
        ? String(rawData.installerCompany)
        : undefined,
      installerContactName: rawData.installerContactName
        ? String(rawData.installerContactName)
        : undefined,
      installerContactEmail: rawData.installerContactEmail
        ? String(rawData.installerContactEmail)
        : undefined,
      installerContactPhone: rawData.installerContactPhone
        ? String(rawData.installerContactPhone)
        : undefined,
    };

    // Validate the data
    const validatedData = solarInstallationFormSchema.parse(parsedData);

    // Create installation data for the service
    const installationData = {
      siteId: validatedData.siteId,
      projectId: validatedData.projectId,
      capacity: validatedData.capacity,
      panelType: validatedData.panelType,
      panelCount: validatedData.panelCount,
      installedDate: validatedData.installedDate,
      status: validatedData.status,
      efficiency: validatedData.efficiency,
      orientation: validatedData.orientation,
      tilt: validatedData.tilt,
      inverterType: validatedData.inverterType,
      inverterCount: validatedData.inverterCount,
      installerInfo: validatedData.installerCompany
        ? {
            company: validatedData.installerCompany,
            contactName: validatedData.installerContactName,
            contactEmail: validatedData.installerContactEmail,
            contactPhone: validatedData.installerContactPhone,
          }
        : undefined,
    };

    // Update the installation using our data service
    const installation = await SolarInstallationService.updateInstallation(
      id,
      installationData
    );

    if (!installation) {
      return { success: false, error: "Installation not found" };
    }

    revalidatePath("/solar/installations");
    revalidatePath(`/solar/installations/${id}`);
    revalidatePath(`/sites/${validatedData.siteId}`);

    return { success: true, installation };
  } catch (error) {
    console.error("Error updating solar installation:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.format(),
      };
    }
    return { success: false, error: "Failed to update solar installation" };
  }
}

/**
 * Delete a solar installation
 */
export async function deleteSolarInstallation(id: string) {
  try {
    const installation = await SolarInstallationService.getInstallationById(id);
    if (!installation) {
      return { success: false, error: "Installation not found" };
    }

    await SolarInstallationService.deleteInstallation(id);

    revalidatePath("/solar/installations");
    revalidatePath(`/sites/${installation.siteId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting solar installation:", error);
    return { success: false, error: "Failed to delete solar installation" };
  }
}

/**
 * Get a solar installation by ID
 */
export async function getSolarInstallation(id: string) {
  try {
    const installation = await SolarInstallationService.getInstallationById(id);

    if (!installation) {
      return { success: false, error: "Installation not found" };
    }

    return { success: true, installation };
  } catch (error) {
    console.error("Error fetching solar installation:", error);
    return { success: false, error: "Failed to fetch solar installation" };
  }
}

/**
 * Get all solar installations with optional filtering
 */
export async function getAllSolarInstallations(queryString?: string) {
  try {
    const installations = await SolarInstallationService.getAllInstallations(
      queryString
    );
    return { success: true, installations };
  } catch (error) {
    console.error("Error fetching solar installations:", error);
    return { success: false, error: "Failed to fetch solar installations" };
  }
}

/**
 * Add energy production data for a solar installation
 */
export async function addEnergyProductionData(formData: FormData) {
  try {
    const installationId = formData.get("installationId") as string;
    if (!installationId) {
      return { success: false, error: "Installation ID is required" };
    }

    // Check if installation exists
    const installation = await SolarInstallationService.getInstallationById(
      installationId
    );
    if (!installation) {
      return { success: false, error: "Installation not found" };
    }

    const date = formData.get("date") as string;
    const productionKWh = parseFloat(formData.get("productionKWh") as string);
    const peakOutputKW = parseFloat(formData.get("peakOutputKW") as string);
    const weatherCondition = formData.get("weatherCondition") as string;
    const temperature = parseFloat(formData.get("temperature") as string);
    const notes = formData.get("notes") as string;

    // Create energy production data
    const productionData = {
      installationId,
      date,
      productionKWh,
      peakOutputKW,
      weather: {
        condition: weatherCondition,
        temperature,
      },
      notes,
    };

    // Add energy production data
    const production = await EnergyProductionService.createEnergyProduction(
      productionData
    );

    revalidatePath(`/solar/installations/${installationId}`);
    revalidatePath(`/solar/dashboard`);

    return { success: true, production };
  } catch (error) {
    console.error("Error adding energy production data:", error);
    return { success: false, error: "Failed to add energy production data" };
  }
}

/**
 * Get energy production data for a solar installation
 */
export async function getEnergyProductionData(
  installationId: string,
  period?: string
) {
  try {
    const productionData =
      await EnergyProductionService.getEnergyProductionByInstallationId(
        installationId
      );

    // Filter by period if provided
    let filteredData = productionData;
    if (period) {
      const today = new Date();
      const startDate = new Date();

      switch (period) {
        case "week":
          startDate.setDate(today.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(today.getMonth() - 1);
          break;
        case "quarter":
          startDate.setMonth(today.getMonth() - 3);
          break;
        case "year":
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }

      filteredData = productionData.filter(
        (item: EnergyProduction) =>
          new Date(item.date) >= startDate && new Date(item.date) <= today
      );
    }

    return { success: true, productionData: filteredData };
  } catch (error) {
    console.error("Error fetching energy production data:", error);
    return { success: false, error: "Failed to fetch energy production data" };
  }
}

/**
 * Get solar dashboard statistics
 */
export async function getSolarDashboardStats() {
  try {
    const installations = await SolarInstallationService.getAllInstallations();

    // Calculate statistics
    const totalInstallations = installations.length;
    const totalCapacity = installations.reduce(
      (sum, installation) => sum + installation.capacity,
      0
    );

    const installationsByStatus = installations.reduce(
      (acc: Record<string, number>, installation) => {
        const status = installation.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    // Get operational installations
    const operationalInstallations = installations.filter(
      (installation: SolarInstallation) => installation.status === "operational"
    );

    // Get recent energy production data
    const recentProduction = [];
    for (const installation of operationalInstallations.slice(0, 5)) {
      const productionData =
        await EnergyProductionService.getEnergyProductionByInstallationId(
          installation.id
        );

      if (productionData.length > 0) {
        // Get the most recent production entry
        const latestProduction = productionData.sort(
          (a: EnergyProduction, b: EnergyProduction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        recentProduction.push({
          installationId: installation.id,
          siteId: installation.siteId,
          capacity: installation.capacity,
          date: latestProduction.date,
          productionKWh: latestProduction.productionKWh,
        });
      }
    }

    return {
      success: true,
      stats: {
        totalInstallations,
        totalCapacity,
        installationsByStatus,
        recentProduction,
      },
    };
  } catch (error) {
    console.error("Error fetching solar dashboard stats:", error);
    return { success: false, error: "Failed to fetch solar dashboard stats" };
  }
}
