// lib/validation.ts
import { z } from "zod";

// Base validation schemas - these are used in other schemas
export const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// Zone validation schema
export const zoneSchema = z.object({
  code: z.string().trim().min(1).max(10).toUpperCase(),
  name: z.string().trim().min(1).max(100),
  description: z.string().optional(),
  region: z.string().trim().optional(),
  headOffice: z.string().trim().optional(),
  establishedYear: z
    .number()
    .int()
    .min(1850)
    .max(new Date().getFullYear())
    .optional(),
  contactPerson: z.string().trim().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().trim().optional(),
  totalStations: z.number().int().min(0).optional(),
  totalDivisions: z.number().int().min(0).optional(),
  status: z.enum(["active", "inactive", "planned"]).default("active"),
});

// Division validation schema
export const divisionSchema = z.object({
  code: z.string().trim().min(1).max(10).toUpperCase(),
  name: z.string().trim().min(1).max(100),
  zoneId: z.string().trim().min(1),
  zoneCode: z.string().trim().toUpperCase(),
  description: z.string().optional(),
  headquarter: z.string().trim().optional(),
  establishedYear: z
    .number()
    .int()
    .min(1850)
    .max(new Date().getFullYear())
    .optional(),
  area: z.number().min(0).optional(),
  totalStations: z.number().int().min(0).optional(),
  divisionType: z
    .enum(["operational", "commercial", "administrative", "mixed"])
    .default("mixed"),
  contactPerson: z.string().trim().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().trim().optional(),
  status: z.enum(["active", "inactive", "planned", "merged"]).default("active"),
  annualBudget: z.number().min(0).optional(),
  budgetCurrency: z.string().trim().toUpperCase().default("INR"),
});

// Station validation schema
export const stationSchema = z.object({
  code: z.string().trim().min(1).max(10).toUpperCase(),
  name: z.string().trim().min(1).max(100),
  divisionId: z.string().trim().min(1),
  divisionCode: z.string().trim().toUpperCase(),
  zoneId: z.string().trim().min(1),
  zoneCode: z.string().trim().toUpperCase(),
  stationType: z
    .enum(["major", "minor", "halt", "junction", "terminal"])
    .default("minor"),
  category: z.enum(["A1", "A", "B", "C", "D", "E", "F"]).default("D"),
  address: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  elevation: z.number().optional(),
  platforms: z.number().int().min(1).optional(),
  tracks: z.number().int().min(1).optional(),
  establishedYear: z
    .number()
    .int()
    .min(1850)
    .max(new Date().getFullYear())
    .optional(),
  annualFootfall: z.number().min(0).optional(),
  amenities: z.array(z.string().trim()).optional(),
  nearbyLandmarks: z.array(z.string().trim()).optional(),
  status: z
    .enum(["operational", "under-construction", "closed", "planned"])
    .default("operational"),
  hasWifi: z.boolean().default(false),
  hasFoodCourt: z.boolean().default(false),
  hasElectricityMeters: z.boolean().default(true),
  electricityConnectionDetails: z
    .object({
      consumerNumber: z.string().trim().optional(),
      sanctionedLoad: z.number().min(0).optional(),
      loadUnit: z.enum(["kW", "MW", "kVA", "MVA"]).default("kW"),
      connectionType: z.string().trim().optional(),
      supplier: z.string().trim().optional(),
    })
    .optional(),
  rooftopArea: z.number().min(0).optional(),
  parkingArea: z.number().min(0).optional(),
  landArea: z.number().min(0).optional(),
});

// Photo validation schema
const photoSchema = z.object({
  url: z.string().url(),
  caption: z.string().trim().optional(),
  date: z.date().default(() => new Date()),
  category: z
    .enum(["site", "roof", "equipment", "obstacle", "other"])
    .default("site"),
});

// Document validation schema
const documentSchema = z.object({
  title: z.string().trim().min(1),
  url: z.string().url(),
  type: z.string().trim().optional(),
  uploadDate: z.date().default(() => new Date()),
});

// Site validation schema
export const siteSchema = z.object({
  siteCode: z.string().trim().min(1).max(20).toUpperCase(),
  name: z.string().trim().min(1).max(100),
  stationId: z.string().trim().min(1),
  stationCode: z.string().trim().toUpperCase(),
  divisionId: z.string().trim().min(1),
  divisionCode: z.string().trim().toUpperCase(),
  zoneId: z.string().trim().min(1),
  zoneCode: z.string().trim().toUpperCase(),
  siteType: z
    .enum(["rooftop", "land", "carport", "hybrid", "other"])
    .default("rooftop"),
  address: z.string().trim().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  area: z.number().min(0),
  feasibleArea: z.number().min(0),
  feasibleCapacity: z.number().min(0),
  sanctionedLoad: z.number().min(0),
  sanctionedLoadUnit: z.enum(["kW", "MW", "kVA", "MVA"]).default("kW"),
  electricityConsumerNumber: z.string().trim().optional(),
  electricitySupplier: z.string().trim().optional(),
  electricityTariff: z.number().min(0).optional(),
  annualConsumption: z.number().min(0).optional(),
  peakDemand: z.number().min(0).optional(),
  shadingPercentage: z.number().min(0).max(100).optional(),
  tiltAngle: z.number().min(0).max(90).optional(),
  azimuthAngle: z.number().min(0).max(360).optional(),
  structureType: z.enum(["RCC", "metal", "hybrid", "other"]).optional(),
  structureAge: z.number().min(0).optional(),
  structuralAssessment: z
    .enum(["suitable", "needs-reinforcement", "unsuitable"])
    .optional(),
  accessibilityRating: z.enum(["easy", "moderate", "difficult"]).optional(),
  nearestRoad: z.number().min(0).optional(),
  interconnectionPoint: z.string().trim().optional(),
  distanceToInterconnection: z.number().min(0).optional(),
  waterSource: z.boolean().default(false),
  security: z.string().trim().optional(),
  permitStatus: z
    .enum(["not-required", "pending", "approved", "rejected"])
    .default("not-required"),
  environmentalClearance: z.boolean().default(true),
  siteSurveyDate: z.date().optional(),
  surveyedBy: z.string().trim().optional(),
  obstaclesNearby: z.array(z.string().trim()).optional(),
  notes: z.string().trim().optional(),
  photos: z.array(photoSchema).optional(),
  documents: z.array(documentSchema).optional(),
  suitabilityScore: z.number().min(0).max(100).optional(),
  status: z
    .enum([
      "identified",
      "surveyed",
      "approved",
      "rejected",
      "in-progress",
      "completed",
    ])
    .default("identified"),
  projectPhase: z
    .enum([
      "planning",
      "survey",
      "design",
      "procurement",
      "construction",
      "commissioning",
      "operational",
      "maintenance",
    ])
    .default("planning"),
  expectedAnnualGeneration: z.number().min(0).optional(),
  expectedPRRatio: z.number().min(0).max(1).optional(),
  constructionStartDate: z.date().optional(),
  commissioningDate: z.date().optional(),
});

// For form submissions with partial data
export const zoneFormSchema = zoneSchema.partial();
export const divisionFormSchema = divisionSchema.partial();
export const stationFormSchema = stationSchema.partial();
export const siteFormSchema = siteSchema.partial();

// For create operations - requiring minimum necessary fields
export const createZoneSchema = zoneSchema.pick({
  code: true,
  name: true,
  region: true,
  status: true,
});

export const createDivisionSchema = divisionSchema.pick({
  code: true,
  name: true,
  zoneId: true,
  zoneCode: true,
  divisionType: true,
  status: true,
});

export const createStationSchema = stationSchema.pick({
  code: true,
  name: true,
  divisionId: true,
  divisionCode: true,
  zoneId: true,
  zoneCode: true,
  stationType: true,
  category: true,
  address: true,
  status: true,
});

export const createSiteSchema = siteSchema.pick({
  siteCode: true,
  name: true,
  stationId: true,
  stationCode: true,
  divisionId: true,
  divisionCode: true,
  zoneId: true,
  zoneCode: true,
  siteType: true,
  address: true,
  latitude: true,
  longitude: true,
  area: true,
  feasibleArea: true,
  feasibleCapacity: true,
  sanctionedLoad: true,
  sanctionedLoadUnit: true,
  status: true,
  projectPhase: true,
});

// Type definitions from Zod schemas
export type ZoneFormData = z.infer<typeof zoneFormSchema>;
export type DivisionFormData = z.infer<typeof divisionFormSchema>;
export type StationFormData = z.infer<typeof stationFormSchema>;
export type SiteFormData = z.infer<typeof siteFormSchema>;

export type CreateZoneData = z.infer<typeof createZoneSchema>;
export type CreateDivisionData = z.infer<typeof createDivisionSchema>;
export type CreateStationData = z.infer<typeof createStationSchema>;
export type CreateSiteData = z.infer<typeof createSiteSchema>;
