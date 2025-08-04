// lib/schemas/index.ts
import { z } from "zod";
import * as validationSchemas from "../validation";
import * as hierarchySchemas from "./hierarchy-schemas";

/**
 * Consolidated schema exports
 * This file serves as the central point for all validation schemas
 */

// Re-export all schemas from validation.ts
export const {
  // Base schemas
  coordinatesSchema,
  contactSchema,

  // Entity schemas
  zoneSchema,
  divisionSchema,
  stationSchema,
  siteSchema,

  // Form schemas
  zoneFormSchema,
  divisionFormSchema,
  stationFormSchema,
  siteFormSchema,

  // Create schemas
  createZoneSchema,
  createDivisionSchema,
  createStationSchema,
  createSiteSchema,
} = validationSchemas;

// Re-export solar schemas from hierarchy-schemas.ts
export const { solarInstallationSchema, energyProductionSchema } =
  hierarchySchemas;

// Define additional schemas not included in the main validation file

/**
 * API pagination parameters schema
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("asc"),
});

/**
 * Date range schema
 */
export const dateRangeSchema = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

/**
 * Location search schema
 */
export const locationSearchSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(0).max(1000), // radius in kilometers
});

/**
 * Generate TypeScript type definitions from schemas
 */
export type Coordinates = z.infer<typeof coordinatesSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type Zone = z.infer<typeof zoneSchema>;
export type Division = z.infer<typeof divisionSchema>;
export type Station = z.infer<typeof stationSchema>;
export type Site = z.infer<typeof siteSchema>;
export type SolarInstallation = z.infer<typeof solarInstallationSchema>;
export type EnergyProduction = z.infer<typeof energyProductionSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type LocationSearch = z.infer<typeof locationSearchSchema>;

/**
 * Partial types for form data
 */
export type ZoneFormData = z.infer<typeof zoneFormSchema>;
export type DivisionFormData = z.infer<typeof divisionFormSchema>;
export type StationFormData = z.infer<typeof stationFormSchema>;
export type SiteFormData = z.infer<typeof siteFormSchema>;

/**
 * Create operation types
 */
export type CreateZoneData = z.infer<typeof createZoneSchema>;
export type CreateDivisionData = z.infer<typeof createDivisionSchema>;
export type CreateStationData = z.infer<typeof createStationSchema>;
export type CreateSiteData = z.infer<typeof createSiteSchema>;
