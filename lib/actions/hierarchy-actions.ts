"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { Zone, Division, Station } from "@/models";
import { revalidatePath } from "next/cache";
import {
  zoneSchema,
  createZoneSchema,
  DivisionFormData,
  StationFormData,
} from "@/lib/validation";

// Zone CRUD operations
export async function createZone(formData: FormData) {
  try {
    await connectToDatabase();

    // Extract form data
    const rawZoneData = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      region: formData.get("region") as string,
      headOffice: formData.get("headquarters") as string, // Map to correct field name
      contactPerson: formData.get("contactPerson") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
      status: "active",
    };

    // Validate with Zod
    const zoneData = createZoneSchema.parse(rawZoneData);

    const newZone = new Zone(zoneData);
    await newZone.save();

    revalidatePath("/admin/zones");

    return { success: true, zone: newZone };
  } catch (error) {
    console.error("Error creating zone:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create zone",
    };
  }
}

export async function updateZone(zoneId: string, formData: FormData) {
  try {
    await connectToDatabase();

    // Extract form data
    const rawUpdateData = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      region: formData.get("region") as string,
      headOffice: formData.get("headquarters") as string, // Map to correct field name
      contactPerson: formData.get("contactPerson") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
    };

    // Validate with Zod partial schema (allowing partial updates)
    const updateData = zoneSchema.partial().parse(rawUpdateData);

    const updatedZone = await Zone.findByIdAndUpdate(
      zoneId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedZone) {
      return { success: false, error: "Zone not found" };
    }

    revalidatePath("/admin/zones");
    revalidatePath(`/admin/zones/${zoneId}`);

    return { success: true, zone: updatedZone };
  } catch (error) {
    console.error("Error updating zone:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update zone",
    };
  }
}

export async function deleteZone(zoneId: string) {
  try {
    await connectToDatabase();

    // Check if zone has divisions
    const divisionsCount = await Division.countDocuments({ zoneId });
    if (divisionsCount > 0) {
      return {
        success: false,
        error: `Cannot delete zone with ${divisionsCount} divisions. Delete divisions first.`,
      };
    }

    const deletedZone = await Zone.findByIdAndDelete(zoneId);

    if (!deletedZone) {
      return { success: false, error: "Zone not found" };
    }

    revalidatePath("/admin/zones");

    return { success: true };
  } catch (error) {
    console.error("Error deleting zone:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete zone",
    };
  }
}

export async function getZones() {
  try {
    await connectToDatabase();

    const zones = await Zone.find({}).sort({ name: 1 }).lean();

    return { success: true, zones: JSON.parse(JSON.stringify(zones)) };
  } catch (error) {
    console.error("Error fetching zones:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch zones",
    };
  }
}

export async function getZoneById(zoneId: string) {
  try {
    await connectToDatabase();

    const zone = await Zone.findById(zoneId).lean();

    if (!zone) {
      return { success: false, error: "Zone not found" };
    }

    return { success: true, zone: JSON.parse(JSON.stringify(zone)) };
  } catch (error) {
    console.error("Error fetching zone:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch zone",
    };
  }
}

// Division CRUD operations
export async function createDivision(formData: FormData) {
  try {
    await connectToDatabase();

    const divisionData: Partial<DivisionFormData> = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      zoneId: formData.get("zoneId") as string,
      headquarters: formData.get("headquarters") as string,
      contactPerson: formData.get("contactPerson") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
    };

    // Get zone details
    const zone = await Zone.findById(divisionData.zoneId).lean();
    if (!zone) {
      return { success: false, error: "Zone not found" };
    }

    // Add zone details to division
    const newDivision = new Division({
      ...divisionData,
      zoneName: zone.name,
      zoneCode: zone.code,
    });

    await newDivision.save();

    // Update zone's division count
    await Zone.findByIdAndUpdate(divisionData.zoneId, {
      $inc: { totalDivisions: 1 },
    });

    revalidatePath("/admin/divisions");
    revalidatePath(`/admin/zones/${divisionData.zoneId}`);

    return { success: true, division: newDivision };
  } catch (error) {
    console.error("Error creating division:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create division",
    };
  }
}

export async function updateDivision(divisionId: string, formData: FormData) {
  try {
    await connectToDatabase();

    const divisionData: Partial<DivisionFormData> = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      zoneId: formData.get("zoneId") as string,
      headquarters: formData.get("headquarters") as string,
      contactPerson: formData.get("contactPerson") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
    };

    const existingDivision = await Division.findById(divisionId);
    if (!existingDivision) {
      return { success: false, error: "Division not found" };
    }

    // Check if zone has changed
    const zoneChanged =
      divisionData.zoneId &&
      existingDivision.zoneId.toString() !== divisionData.zoneId;

    if (zoneChanged) {
      // Get new zone details
      const zone = await Zone.findById(divisionData.zoneId).lean();
      if (!zone) {
        return { success: false, error: "New zone not found" };
      }

      // Update zone references
      divisionData.zoneName = zone.name;
      divisionData.zoneCode = zone.code;

      // Update zone counts
      await Promise.all([
        // Decrement old zone count
        Zone.findByIdAndUpdate(existingDivision.zoneId, {
          $inc: { totalDivisions: -1 },
        }),
        // Increment new zone count
        Zone.findByIdAndUpdate(divisionData.zoneId, {
          $inc: { totalDivisions: 1 },
        }),
      ]);

      // Update all stations that reference this division
      await Station.updateMany(
        { divisionId },
        {
          $set: {
            zoneId: divisionData.zoneId,
            zoneName: zone.name,
            zoneCode: zone.code,
          },
        }
      );
    }

    const updatedDivision = await Division.findByIdAndUpdate(
      divisionId,
      { $set: divisionData },
      { new: true, runValidators: true }
    );

    revalidatePath("/admin/divisions");
    revalidatePath(`/admin/divisions/${divisionId}`);

    if (zoneChanged) {
      revalidatePath(`/admin/zones/${existingDivision.zoneId}`);
      revalidatePath(`/admin/zones/${divisionData.zoneId}`);
    }

    return { success: true, division: updatedDivision };
  } catch (error) {
    console.error("Error updating division:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update division",
    };
  }
}

export async function deleteDivision(divisionId: string) {
  try {
    await connectToDatabase();

    // Check if division has stations
    const stationsCount = await Station.countDocuments({ divisionId });
    if (stationsCount > 0) {
      return {
        success: false,
        error: `Cannot delete division with ${stationsCount} stations. Delete stations first.`,
      };
    }

    const division = await Division.findById(divisionId);
    if (!division) {
      return { success: false, error: "Division not found" };
    }

    const zoneId = division.zoneId;

    await Division.findByIdAndDelete(divisionId);

    // Update zone's division count
    await Zone.findByIdAndUpdate(zoneId, { $inc: { totalDivisions: -1 } });

    revalidatePath("/admin/divisions");
    revalidatePath(`/admin/zones/${zoneId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting division:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete division",
    };
  }
}

export async function getDivisions(filter?: { zoneId?: string }) {
  try {
    await connectToDatabase();

    let query = {};
    if (filter?.zoneId) {
      query = { zoneId: filter.zoneId };
    }

    const divisions = await Division.find(query).sort({ name: 1 }).lean();

    return { success: true, divisions: JSON.parse(JSON.stringify(divisions)) };
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch divisions",
    };
  }
}

export async function getDivisionById(divisionId: string) {
  try {
    await connectToDatabase();

    const division = await Division.findById(divisionId).lean();

    if (!division) {
      return { success: false, error: "Division not found" };
    }

    return { success: true, division: JSON.parse(JSON.stringify(division)) };
  } catch (error) {
    console.error("Error fetching division:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch division",
    };
  }
}

// Station CRUD operations
export async function createStation(formData: FormData) {
  try {
    await connectToDatabase();

    const stationData: Partial<StationFormData> = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      divisionId: formData.get("divisionId") as string,
      stationType: formData.get("stationType") as string,
      address: formData.get("address") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      contactPerson: formData.get("contactPerson") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
    };

    // Get division details
    const division = await Division.findById(stationData.divisionId).lean();
    if (!division) {
      return { success: false, error: "Division not found" };
    }

    // Add division and zone details to station
    const newStation = new Station({
      ...stationData,
      divisionName: division.name,
      divisionCode: division.code,
      zoneId: division.zoneId,
      zoneName: division.zoneName,
      zoneCode: division.zoneCode,
    });

    await newStation.save();

    // Update division's station count
    await Division.findByIdAndUpdate(stationData.divisionId, {
      $inc: { totalStations: 1 },
    });

    // Update zone's station count
    await Zone.findByIdAndUpdate(division.zoneId, {
      $inc: { totalStations: 1 },
    });

    revalidatePath("/admin/stations");
    revalidatePath(`/admin/divisions/${stationData.divisionId}`);
    revalidatePath(`/admin/zones/${division.zoneId}`);

    return { success: true, station: newStation };
  } catch (error) {
    console.error("Error creating station:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create station",
    };
  }
}

export async function updateStation(stationId: string, formData: FormData) {
  try {
    await connectToDatabase();

    const stationData: Partial<StationFormData> = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      divisionId: formData.get("divisionId") as string,
      stationType: formData.get("stationType") as string,
      address: formData.get("address") as string,
      latitude: parseFloat(formData.get("latitude") as string),
      longitude: parseFloat(formData.get("longitude") as string),
      contactPerson: formData.get("contactPerson") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
    };

    const existingStation = await Station.findById(stationId);
    if (!existingStation) {
      return { success: false, error: "Station not found" };
    }

    // Check if division has changed
    const divisionChanged =
      stationData.divisionId &&
      existingStation.divisionId.toString() !== stationData.divisionId;

    if (divisionChanged) {
      // Get new division details
      const division = await Division.findById(stationData.divisionId).lean();
      if (!division) {
        return { success: false, error: "New division not found" };
      }

      // Update division and zone references
      stationData.divisionName = division.name;
      stationData.divisionCode = division.code;
      stationData.zoneId = division.zoneId;
      stationData.zoneName = division.zoneName;
      stationData.zoneCode = division.zoneCode;

      const oldDivisionId = existingStation.divisionId;
      const oldZoneId = existingStation.zoneId;
      const newZoneId = division.zoneId;

      // Update division and zone counts
      if (oldDivisionId.toString() !== stationData.divisionId) {
        await Division.findByIdAndUpdate(oldDivisionId, {
          $inc: { totalStations: -1 },
        });

        await Division.findByIdAndUpdate(stationData.divisionId, {
          $inc: { totalStations: 1 },
        });
      }

      if (oldZoneId.toString() !== newZoneId.toString()) {
        await Zone.findByIdAndUpdate(oldZoneId, {
          $inc: { totalStations: -1 },
        });

        await Zone.findByIdAndUpdate(newZoneId, { $inc: { totalStations: 1 } });
      }
    }

    const updatedStation = await Station.findByIdAndUpdate(
      stationId,
      { $set: stationData },
      { new: true, runValidators: true }
    );

    revalidatePath("/admin/stations");
    revalidatePath(`/admin/stations/${stationId}`);

    if (divisionChanged) {
      revalidatePath(`/admin/divisions/${existingStation.divisionId}`);
      revalidatePath(`/admin/divisions/${stationData.divisionId}`);

      if (
        existingStation.zoneId.toString() !== stationData.zoneId!.toString()
      ) {
        revalidatePath(`/admin/zones/${existingStation.zoneId}`);
        revalidatePath(`/admin/zones/${stationData.zoneId}`);
      }
    }

    return { success: true, station: updatedStation };
  } catch (error) {
    console.error("Error updating station:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update station",
    };
  }
}

export async function deleteStation(stationId: string) {
  try {
    await connectToDatabase();

    // Check if station has sites
    // This would need to be implemented when you link sites to stations

    const station = await Station.findById(stationId);
    if (!station) {
      return { success: false, error: "Station not found" };
    }

    const divisionId = station.divisionId;
    const zoneId = station.zoneId;

    await Station.findByIdAndDelete(stationId);

    // Update division's station count
    await Division.findByIdAndUpdate(divisionId, {
      $inc: { totalStations: -1 },
    });

    // Update zone's station count
    await Zone.findByIdAndUpdate(zoneId, { $inc: { totalStations: -1 } });

    revalidatePath("/admin/stations");
    revalidatePath(`/admin/divisions/${divisionId}`);
    revalidatePath(`/admin/zones/${zoneId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting station:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete station",
    };
  }
}

export async function getStations(filter?: {
  divisionId?: string;
  zoneId?: string;
}) {
  try {
    await connectToDatabase();

    let query = {};
    if (filter?.divisionId) {
      query = { divisionId: filter.divisionId };
    } else if (filter?.zoneId) {
      query = { zoneId: filter.zoneId };
    }

    const stations = await Station.find(query).sort({ name: 1 }).lean();

    return { success: true, stations: JSON.parse(JSON.stringify(stations)) };
  } catch (error) {
    console.error("Error fetching stations:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch stations",
    };
  }
}

export async function getStationById(stationId: string) {
  try {
    await connectToDatabase();

    const station = await Station.findById(stationId).lean();

    if (!station) {
      return { success: false, error: "Station not found" };
    }

    return { success: true, station: JSON.parse(JSON.stringify(station)) };
  } catch (error) {
    console.error("Error fetching station:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch station",
    };
  }
}

// Hierarchical search and filtering
export async function searchHierarchy(searchTerm: string) {
  try {
    await connectToDatabase();

    const [zones, divisions, stations] = await Promise.all([
      Zone.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { code: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .limit(10)
        .lean(),

      Division.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { code: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .limit(10)
        .lean(),

      Station.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { code: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .limit(10)
        .lean(),
    ]);

    return {
      success: true,
      results: {
        zones: JSON.parse(JSON.stringify(zones)),
        divisions: JSON.parse(JSON.stringify(divisions)),
        stations: JSON.parse(JSON.stringify(stations)),
      },
    };
  } catch (error) {
    console.error("Error searching hierarchy:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to search hierarchy",
    };
  }
}

// AI-powered natural language search
export async function naturalLanguageSearch(query: string) {
  try {
    await connectToDatabase();

    // This would be integrated with an NLP service like OpenAI to parse the query
    // For now, we'll implement a simple keyword-based approach

    const queryLower = query.toLowerCase();

    // Extract potential filters from query
    const extractNumber = (text: string, pattern: RegExp): number | null => {
      const match = text.match(pattern);
      return match ? parseFloat(match[1]) : null;
    };

    // Sample filters (would be more sophisticated with NLP)
    const zoneMatch = queryLower.match(/zone\s+([a-z]+)/i);
    const divisionMatch = queryLower.match(
      /division\s+([a-z\s]+)(?:division|\b)/i
    );
    const stationMatch = queryLower.match(
      /station\s+([a-z\s]+)(?:station|\b)/i
    );
    const capacityGt = extractNumber(queryLower, /capacity\s*>\s*(\d+)/);
    const capacityLt = extractNumber(queryLower, /capacity\s*<\s*(\d+)/);

    // Build MongoDB query based on filters
    const query: Record<string, unknown> = {};

    if (zoneMatch?.[1]) {
      query["zoneName"] = { $regex: zoneMatch[1], $options: "i" };
    }

    if (divisionMatch?.[1]) {
      query["divisionName"] = {
        $regex: divisionMatch[1].trim(),
        $options: "i",
      };
    }

    if (stationMatch?.[1]) {
      query["stationName"] = { $regex: stationMatch[1].trim(), $options: "i" };
    }

    if (capacityGt !== null || capacityLt !== null) {
      query["feasibleCapacity"] = {};
      if (capacityGt !== null) {
        query["feasibleCapacity"]["$gt"] = capacityGt;
      }
      if (capacityLt !== null) {
        query["feasibleCapacity"]["$lt"] = capacityLt;
      }
    }

    // For a full implementation, this would query against the site data
    // and join with the hierarchy data as needed

    // Placeholder for now - would be updated with actual implementation
    return {
      success: true,
      parsedQuery: query,
      message:
        "Natural language search implemented. This is a placeholder for the actual NLP integration.",
    };
  } catch (error) {
    console.error("Error in natural language search:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process natural language search",
    };
  }
}
