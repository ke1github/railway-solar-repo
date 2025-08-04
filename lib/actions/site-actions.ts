// lib/actions/site-actions.ts
"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { RailwaySite } from "@/models";
import { revalidatePath } from "next/cache";

export interface SiteFormData {
  id: string;
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
    await connectToDatabase();

    const siteData: Partial<SiteFormData> = {
      id: formData.get("id") as string,
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

    // Generate serial number
    const lastSite = await RailwaySite.findOne().sort({ serialNumber: -1 });
    const serialNumber = lastSite ? lastSite.serialNumber + 1 : 1;

    const newSite = new RailwaySite({
      ...siteData,
      serialNumber,
      // Generate additional fields
      energyGenerated: Math.floor(Math.random() * 10000),
      efficiency: 85 + Math.floor(Math.random() * 10),
      monthlyEnergyTarget: siteData.feasibleCapacity
        ? siteData.feasibleCapacity * 4 * 30
        : 0,
      carbonOffsetKg: siteData.feasibleCapacity
        ? siteData.feasibleCapacity * 0.8 * 365
        : 0,
      maintenanceSchedule: "quarterly",
      installationDate: new Date(),
      lastMaintenanceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    });

    await newSite.save();

    revalidatePath("/sites");
    revalidatePath("/");

    return { success: true, site: newSite };
  } catch (error) {
    console.error("Error creating site:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create site",
    };
  }
}

export async function updateSite(siteId: string, formData: FormData) {
  try {
    await connectToDatabase();

    const updateData: Partial<SiteFormData> = {
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

    const updatedSite = await RailwaySite.findOneAndUpdate(
      { $or: [{ _id: siteId }, { id: siteId }] },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedSite) {
      return { success: false, error: "Site not found" };
    }

    revalidatePath("/sites");
    revalidatePath(`/sites/${siteId}`);
    revalidatePath("/");

    return { success: true, site: updatedSite };
  } catch (error) {
    console.error("Error updating site:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update site",
    };
  }
}

export async function deleteSite(siteId: string) {
  try {
    await connectToDatabase();

    const deletedSite = await RailwaySite.findOneAndDelete({
      $or: [{ _id: siteId }, { id: siteId }],
    });

    if (!deletedSite) {
      return { success: false, error: "Site not found" };
    }

    revalidatePath("/sites");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting site:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete site",
    };
  }
}

export async function getSites(
  page: number = 1,
  limit: number = 20,
  search?: string,
  cluster?: string
) {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { locationName: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
      ];
    }
    if (cluster) {
      filter.cluster = cluster;
    }

    const [sites, total] = await Promise.all([
      RailwaySite.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RailwaySite.countDocuments(filter),
    ]);

    return {
      success: true,
      sites: JSON.parse(JSON.stringify(sites)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching sites:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch sites",
      sites: [],
      pagination: { page: 1, limit: 20, total: 0, pages: 0 },
    };
  }
}

export async function getSiteById(siteId: string) {
  try {
    await connectToDatabase();

    const site = await RailwaySite.findOne({
      $or: [{ _id: siteId }, { id: siteId }],
    }).lean();

    if (!site) {
      return { success: false, error: "Site not found" };
    }

    return {
      success: true,
      site: JSON.parse(JSON.stringify(site)),
    };
  } catch (error) {
    console.error("Error fetching site:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch site",
    };
  }
}

export async function getDashboardStats() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return {
        success: false,
        error: "Database connection not available",
        stats: null,
      };
    }

    await connectToDatabase();

    // Project overview statistics
    const projectStats = await RailwaySite.aggregate([
      {
        $group: {
          _id: null,
          totalSites: { $sum: 1 },
          totalCapacity: { $sum: "$feasibleCapacity" },
          totalArea: { $sum: "$feasibleArea" },
          avgCapacity: { $avg: "$feasibleCapacity" },
          maxCapacity: { $max: "$feasibleCapacity" },
          totalEnergyGenerated: { $sum: "$energyGenerated" },
          avgEfficiency: { $avg: "$efficiency" },
        },
      },
    ]);

    // Cluster statistics
    const clusterStats = await RailwaySite.aggregate([
      {
        $group: {
          _id: "$cluster",
          count: { $sum: 1 },
          totalCapacity: { $sum: "$feasibleCapacity" },
          totalArea: { $sum: "$feasibleArea" },
          avgCapacity: { $avg: "$feasibleCapacity" },
          energyGenerated: { $sum: "$energyGenerated" },
        },
      },
      { $sort: { totalCapacity: -1 } },
    ]);

    // Status distribution
    const statusStats = await RailwaySite.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalCapacity: { $sum: "$feasibleCapacity" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Recent sites
    const recentSites = await RailwaySite.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("id address locationName status feasibleCapacity createdAt")
      .lean();

    return {
      success: true,
      stats: {
        project: projectStats[0] || {
          totalSites: 0,
          totalCapacity: 0,
          totalArea: 0,
          avgCapacity: 0,
          maxCapacity: 0,
          totalEnergyGenerated: 0,
          avgEfficiency: 0,
        },
        clusters: clusterStats,
        statuses: statusStats,
        recentSites: JSON.parse(JSON.stringify(recentSites)),
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard stats",
      stats: {
        project: {
          totalSites: 0,
          totalCapacity: 0,
          totalArea: 0,
          avgCapacity: 0,
          maxCapacity: 0,
          totalEnergyGenerated: 0,
          avgEfficiency: 0,
        },
        clusters: [],
        statuses: [],
        recentSites: [],
      },
    };
  }
}

export async function getSitesWithStats() {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return {
        success: false,
        error: "Database connection not available",
        sites: [],
        stats: { clusterStats: [], statusStats: [] },
      };
    }

    await connectToDatabase();

    // Get all sites
    const sites = await RailwaySite.find({}).lean();

    // Calculate cluster statistics
    const clusterStats = await RailwaySite.aggregate([
      {
        $group: {
          _id: "$cluster",
          count: { $sum: 1 },
          totalCapacity: { $sum: "$feasibleCapacity" },
          avgCapacity: { $avg: "$feasibleCapacity" },
        },
      },
      { $sort: { totalCapacity: -1 } },
    ]);

    // Calculate status statistics
    const statusStats = await RailwaySite.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          percentage: {
            $multiply: [{ $divide: ["$count", sites.length] }, 100],
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return {
      success: true,
      sites: JSON.parse(JSON.stringify(sites)),
      stats: {
        clusterStats: JSON.parse(JSON.stringify(clusterStats)),
        statusStats: JSON.parse(JSON.stringify(statusStats)),
      },
    };
  } catch (error) {
    console.error("Error fetching sites with stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch sites with stats",
      sites: [],
      stats: { clusterStats: [], statusStats: [] },
    };
  }
}
