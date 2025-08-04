// lib/schemas/hierarchy-schemas.ts
import { z } from "zod";

// Base location schema with common fields
const baseLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  location: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Zone Schema
export const zoneSchema = baseLocationSchema.extend({
  region: z.string().min(1, "Region is required"),
  headQuarters: z.string().optional(),
});

// Division Schema
export const divisionSchema = baseLocationSchema.extend({
  zoneId: z.string().min(1, "Zone is required"),
  divisionType: z
    .enum(["operations", "commercial", "engineering"])
    .default("operations"),
});

// Station Schema
export const stationSchema = baseLocationSchema.extend({
  divisionId: z.string().min(1, "Division is required"),
  stationType: z.enum(["major", "minor", "halt"]).default("minor"),
  amenities: z.array(z.string()).optional(),
  platforms: z.number().int().min(0).default(1),
  tracks: z.number().int().min(1).default(1),
});

// Solar Installation Schema
export const solarInstallationSchema = z.object({
  stationId: z.string().min(1, "Station is required"),
  capacity: z.number().positive("Capacity must be positive"),
  installationDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  panelType: z.string().min(1, "Panel type is required"),
  numberOfPanels: z
    .number()
    .int()
    .positive("Number of panels must be positive"),
  installedArea: z.number().positive("Installed area must be positive"),
  contractor: z.string().optional(),
  maintenanceSchedule: z
    .enum(["monthly", "quarterly", "biannually", "annually"])
    .default("quarterly"),
  lastMaintenance: z.string().optional(),
  expectedLifespan: z
    .number()
    .int()
    .positive("Lifespan must be positive")
    .default(25),
});

// Energy Production Schema
export const energyProductionSchema = z.object({
  installationId: z.string().min(1, "Installation ID is required"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  energyProduced: z.number().positive("Energy production must be positive"),
  peakOutput: z.number().positive("Peak output must be positive"),
  sunHours: z.number().nonnegative("Sun hours cannot be negative"),
  weatherConditions: z
    .enum(["sunny", "partly cloudy", "cloudy", "rainy"])
    .default("sunny"),
  temperature: z.number().optional(),
  notes: z.string().optional(),
});

// Search Params Schema
export const searchParamsSchema = z.object({
  zoneId: z.string().optional(),
  divisionId: z.string().optional(),
  stationId: z.string().optional(),
  status: z.enum(["active", "inactive", "all"]).default("all"),
  sortBy: z.enum(["name", "code", "createdAt", "updatedAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  query: z.string().optional(),
});

// Export types derived from schemas
export type Zone = z.infer<typeof zoneSchema>;
export type Division = z.infer<typeof divisionSchema>;
export type Station = z.infer<typeof stationSchema>;
export type SolarInstallation = z.infer<typeof solarInstallationSchema>;
export type EnergyProduction = z.infer<typeof energyProductionSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
