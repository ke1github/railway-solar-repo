// lib/actions/solar-actions.ts
"use server";

import { connectToDatabase } from "@/lib/mongodb";
import SolarInstallation from "@/models/SolarInstallation";
import EnergyProduction from "@/models/EnergyProduction";
import { revalidatePath } from "next/cache";
import { ISolarInstallation } from "@/models/SolarInstallation";
import { IEnergyProduction } from "@/models/EnergyProduction";
import { z } from "zod";
import {
  solarInstallationSchema,
  energyProductionSchema,
} from "@/lib/schemas/hierarchy-schemas";
import mongoose from "mongoose";

/**
 * Fetch all solar installations with optional filtering
 * @param queryString Query parameters for filtering results
 */
export async function getAllSolarInstallations(
  queryString?: string
): Promise<ISolarInstallation[]> {
  try {
    await connectToDatabase();

    const query: Record<string, unknown> = {};
    const sort: Record<string, 1 | -1> = { capacity: -1 };

    if (queryString) {
      const params = new URLSearchParams(queryString);

      // Apply station filter if provided
      if (params.get("stationId")) {
        query.stationId = params.get("stationId");
      }

      // Apply status filter if provided
      if (params.get("status") && params.get("status") !== "all") {
        query.status = params.get("status");
      }

      // Apply search filter if provided
      if (params.get("search")) {
        const searchTerm = params.get("search");
        query.$or = [
          { stationCode: { $regex: searchTerm, $options: "i" } },
          { panelType: { $regex: searchTerm, $options: "i" } },
          { contractor: { $regex: searchTerm, $options: "i" } },
        ];
      }

      // Apply sorting if provided
      if (params.get("sortBy") && params.get("sortOrder")) {
        const sortField = params.get("sortBy") || "capacity";
        const sortOrder = params.get("sortOrder") === "asc" ? 1 : -1;
        sort[sortField] = sortOrder;
      }
    }

    // Execute query with optional population
    const installations = await SolarInstallation.find(query)
      .sort(sort)
      .populate("stationId", "name code")
      .lean();

    return JSON.parse(JSON.stringify(installations));
  } catch (error) {
    console.error("Error fetching solar installations:", error);
    throw new Error("Failed to fetch solar installations");
  }
}

/**
 * Fetch a single solar installation by ID
 * @param id The installation ID
 */
export async function getSolarInstallationById(
  id: string
): Promise<ISolarInstallation | null> {
  try {
    await connectToDatabase();

    const installation = await SolarInstallation.findById(id)
      .populate("stationId", "name code divisionId zoneId")
      .lean();

    if (!installation) return null;

    return JSON.parse(JSON.stringify(installation));
  } catch (error) {
    console.error(`Error fetching solar installation with ID ${id}:`, error);
    throw new Error("Failed to fetch solar installation");
  }
}

/**
 * Create a new solar installation
 * @param data The installation data
 */
export async function createSolarInstallation(formData: FormData) {
  try {
    await connectToDatabase();

    // Parse and validate the form data
    const rawData = Object.fromEntries(formData.entries());

    // Convert string numbers to actual numbers
    const parsedData = {
      ...rawData,
      capacity: parseFloat(rawData.capacity as string),
      numberOfPanels: parseInt(rawData.numberOfPanels as string),
      installedArea: parseFloat(rawData.installedArea as string),
      expectedLifespan: parseInt((rawData.expectedLifespan as string) || "25"),
    };

    // Validate using zod schema
    const validatedData = solarInstallationSchema.parse(parsedData);

    // Get the station code
    const stationId = validatedData.stationId;
    const station = await mongoose.model("Station").findById(stationId).lean();

    if (!station) {
      throw new Error("Station not found");
    }

    // Create the solar installation
    const installation = await SolarInstallation.create({
      ...validatedData,
      stationCode: station.code,
    });

    // Revalidate the relevant paths
    revalidatePath("/solar/installations");
    revalidatePath(`/stations/${stationId}`);

    return { success: true, data: installation };
  } catch (error) {
    console.error("Error creating solar installation:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors,
      };
    }
    return { success: false, error: "Failed to create solar installation" };
  }
}

/**
 * Update an existing solar installation
 * @param id The installation ID
 * @param data The updated installation data
 */
export async function updateSolarInstallation(id: string, formData: FormData) {
  try {
    await connectToDatabase();

    // Parse and validate the form data
    const rawData = Object.fromEntries(formData.entries());

    // Convert string numbers to actual numbers
    const parsedData = {
      ...rawData,
      capacity: parseFloat(rawData.capacity as string),
      numberOfPanels: parseInt(rawData.numberOfPanels as string),
      installedArea: parseFloat(rawData.installedArea as string),
      expectedLifespan: parseInt((rawData.expectedLifespan as string) || "25"),
    };

    // Validate using zod schema
    const validatedData = solarInstallationSchema.parse(parsedData);

    // Update the solar installation
    const updatedInstallation = await SolarInstallation.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!updatedInstallation) {
      return { success: false, error: "Solar installation not found" };
    }

    // Revalidate the relevant paths
    revalidatePath("/solar/installations");
    revalidatePath(`/solar/installations/${id}`);
    revalidatePath(`/stations/${updatedInstallation.stationId}`);

    return { success: true, data: updatedInstallation };
  } catch (error) {
    console.error(`Error updating solar installation with ID ${id}:`, error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors,
      };
    }
    return { success: false, error: "Failed to update solar installation" };
  }
}

/**
 * Delete a solar installation
 * @param id The installation ID
 */
export async function deleteSolarInstallation(id: string) {
  try {
    await connectToDatabase();

    // Find the installation to get the station ID
    const installation = await SolarInstallation.findById(id);

    if (!installation) {
      return { success: false, error: "Solar installation not found" };
    }

    const stationId = installation.stationId;

    // Delete the installation
    await SolarInstallation.findByIdAndDelete(id);

    // Also delete associated energy production data
    await EnergyProduction.deleteMany({ installationId: id });

    // Revalidate the relevant paths
    revalidatePath("/solar/installations");
    revalidatePath(`/stations/${stationId}`);

    return { success: true };
  } catch (error) {
    console.error(`Error deleting solar installation with ID ${id}:`, error);
    return { success: false, error: "Failed to delete solar installation" };
  }
}

/**
 * Record new energy production data
 * @param data The energy production data
 */
export async function recordEnergyProduction(formData: FormData) {
  try {
    await connectToDatabase();

    // Parse and validate the form data
    const rawData = Object.fromEntries(formData.entries());

    // Convert string values to appropriate types
    const parsedData = {
      ...rawData,
      energyProduced: parseFloat(rawData.energyProduced as string),
      peakOutput: parseFloat(rawData.peakOutput as string),
      sunHours: parseFloat(rawData.sunHours as string),
      temperature: rawData.temperature
        ? parseFloat(rawData.temperature as string)
        : undefined,
    };

    // Validate using zod schema
    const validatedData = energyProductionSchema.parse(parsedData);

    // Create the energy production record
    const production = await EnergyProduction.create(validatedData);

    // Update the installation's generation data
    await updateInstallationGenerationData(validatedData.installationId);

    // Revalidate the relevant paths
    revalidatePath(`/solar/installations/${validatedData.installationId}`);
    revalidatePath(
      `/solar/installations/${validatedData.installationId}/energy`
    );

    return { success: true, data: production };
  } catch (error) {
    console.error("Error recording energy production:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors,
      };
    }
    return { success: false, error: "Failed to record energy production" };
  }
}

/**
 * Get energy production data for a solar installation
 * @param installationId The installation ID
 * @param startDate Optional start date for filtering
 * @param endDate Optional end date for filtering
 */
export async function getEnergyProductionData(
  installationId: string,
  startDate?: string,
  endDate?: string
): Promise<IEnergyProduction[]> {
  try {
    await connectToDatabase();

    const query: Record<string, unknown> = { installationId };

    // Apply date filters if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const productionData = await EnergyProduction.find(query)
      .sort({ date: -1 })
      .lean();

    return JSON.parse(JSON.stringify(productionData));
  } catch (error) {
    console.error(
      `Error fetching energy production data for installation ${installationId}:`,
      error
    );
    throw new Error("Failed to fetch energy production data");
  }
}

/**
 * Get energy production statistics for a solar installation
 * @param installationId The installation ID
 */
export async function getProductionStatistics(installationId: string) {
  try {
    await connectToDatabase();

    // Get daily statistics for the past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyStats = await EnergyProduction.getDailyProductionStats(
      installationId,
      thirtyDaysAgo,
      new Date()
    );

    // Get monthly statistics for the current year
    const currentYear = new Date().getFullYear();
    const monthlyStats = await EnergyProduction.getMonthlyProductionStats(
      installationId,
      currentYear
    );

    // Get total lifetime production
    const totalProduction = await EnergyProduction.aggregate([
      {
        $match: { installationId: new mongoose.Types.ObjectId(installationId) },
      },
      {
        $group: {
          _id: null,
          totalEnergy: { $sum: "$energyProduced" },
          avgPeakOutput: { $avg: "$peakOutput" },
          avgSunHours: { $avg: "$sunHours" },
          daysCount: {
            $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEnergy: 1,
          avgPeakOutput: 1,
          avgSunHours: 1,
          daysCount: { $size: "$daysCount" },
        },
      },
    ]);

    return {
      dailyStats,
      monthlyStats,
      lifetimeStats: totalProduction[0] || {
        totalEnergy: 0,
        avgPeakOutput: 0,
        avgSunHours: 0,
        daysCount: 0,
      },
    };
  } catch (error) {
    console.error(
      `Error fetching production statistics for installation ${installationId}:`,
      error
    );
    throw new Error("Failed to fetch production statistics");
  }
}

/**
 * Helper function to update an installation's generation data
 * @param installationId The installation ID
 */
async function updateInstallationGenerationData(installationId: string) {
  // Get the total lifetime energy generation
  const lifetimeStats = await EnergyProduction.aggregate([
    { $match: { installationId: new mongoose.Types.ObjectId(installationId) } },
    {
      $group: {
        _id: null,
        totalEnergy: { $sum: "$energyProduced" },
        avgDailyEnergy: { $avg: "$energyProduced" },
        maxDailyEnergy: { $max: "$energyProduced" },
        maxEnergyDate: { $first: "$date" },
      },
    },
  ]);

  if (lifetimeStats.length > 0) {
    const stats = lifetimeStats[0];

    // Find the day with the best generation
    const bestDay = await EnergyProduction.find({ installationId })
      .sort({ energyProduced: -1 })
      .limit(1)
      .lean();

    // Update the installation
    await SolarInstallation.findByIdAndUpdate(installationId, {
      $set: {
        "generationData.lifetimeGeneration": stats.totalEnergy,
        "generationData.averageDailyGeneration": stats.avgDailyEnergy,
        "generationData.bestDayGeneration": bestDay[0]?.energyProduced || 0,
        "generationData.bestDayDate": bestDay[0]?.date || null,
      },
    });
  }
}

/**
 * Get statistics across all solar installations
 */
export async function getSolarSystemOverview() {
  try {
    await connectToDatabase();

    // Get total installed capacity and stats
    const totalCapacity = await SolarInstallation.aggregate([
      {
        $group: {
          _id: "$status",
          capacity: { $sum: "$capacity" },
          count: { $sum: 1 },
          totalArea: { $sum: "$installedArea" },
          totalPanels: { $sum: "$numberOfPanels" },
        },
      },
      {
        $project: {
          status: "$_id",
          capacity: 1,
          count: 1,
          totalArea: 1,
          totalPanels: 1,
          _id: 0,
        },
      },
    ]);

    // Get total energy production statistics
    const productionStats = await EnergyProduction.aggregate([
      {
        $group: {
          _id: null,
          totalEnergyProduced: { $sum: "$energyProduced" },
          avgDailyProduction: { $avg: "$energyProduced" },
          totalRecordings: { $sum: 1 },
          avgSunHours: { $avg: "$sunHours" },
        },
      },
      {
        $project: {
          _id: 0,
          totalEnergyProduced: 1,
          avgDailyProduction: 1,
          totalRecordings: 1,
          avgSunHours: 1,
        },
      },
    ]);

    // Get energy production by station
    const productionByStation = await SolarInstallation.aggregate([
      {
        $lookup: {
          from: "energyProduction",
          localField: "_id",
          foreignField: "installationId",
          as: "productionData",
        },
      },
      {
        $lookup: {
          from: "stations",
          localField: "stationId",
          foreignField: "_id",
          as: "station",
        },
      },
      {
        $unwind: {
          path: "$station",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          stationId: 1,
          stationCode: 1,
          stationName: "$station.name",
          capacity: 1,
          productionData: 1,
        },
      },
      {
        $group: {
          _id: "$stationId",
          stationCode: { $first: "$stationCode" },
          stationName: { $first: "$stationName" },
          totalCapacity: { $sum: "$capacity" },
          totalEnergyProduced: {
            $sum: {
              $reduce: {
                input: "$productionData",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.energyProduced"] },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          stationId: "$_id",
          stationCode: 1,
          stationName: 1,
          totalCapacity: 1,
          totalEnergyProduced: 1,
          efficiencyRatio: {
            $cond: {
              if: { $eq: ["$totalCapacity", 0] },
              then: 0,
              else: { $divide: ["$totalEnergyProduced", "$totalCapacity"] },
            },
          },
        },
      },
      {
        $sort: { totalCapacity: -1 },
      },
    ]);

    return {
      capacityStats: totalCapacity,
      productionStats: productionStats[0] || {
        totalEnergyProduced: 0,
        avgDailyProduction: 0,
        totalRecordings: 0,
        avgSunHours: 0,
      },
      productionByStation,
    };
  } catch (error) {
    console.error("Error fetching solar system overview:", error);
    throw new Error("Failed to fetch solar system overview");
  }
}
