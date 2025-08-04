// Global type definitions for Railway Solar Management System

/**
 * Common API response structure
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | string[];
  message?: string;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

/**
 * Common geographic location structure
 */
interface GeoLocation {
  latitude: number;
  longitude: number;
}

/**
 * Common date range structure
 */
interface DateRange {
  startDate: Date | string;
  endDate: Date | string;
}

/**
 * Energy measurement units
 */
type EnergyUnit = "kW" | "MW" | "kWh" | "MWh" | "kWp" | "MWp";

/**
 * Status types used across the application
 */
type CommonStatusType = "active" | "inactive" | "pending" | "completed";

/**
 * Installation status types
 */
type InstallationStatusType =
  | "planned"
  | "under-installation"
  | "operational"
  | "maintenance"
  | "decommissioned";

/**
 * Site type definitions
 */
type SiteType = "rooftop" | "land" | "carport" | "hybrid" | "other";

/**
 * Maintenance schedule options
 */
type MaintenanceSchedule = "monthly" | "quarterly" | "biannually" | "annually";

/**
 * Standard metadata record type
 */
interface MetadataRecord {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Global error structure
 */
interface ValidationErrors {
  [field: string]: string[];
}

/**
 * Legacy model structures for migration support
 */
interface LegacyRailwaySite {
  id: string;
  serialNumber: number;
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

/**
 * Model adapter interfaces for migration support
 */
interface ModelAdapter<FromType, ToType> {
  convert(from: FromType): ToType;
  convertBatch(fromArray: FromType[]): ToType[];
}

/**
 * Migration helpers
 */
interface MigrationResult {
  success: boolean;
  migratedCount: number;
  failedCount: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
}
