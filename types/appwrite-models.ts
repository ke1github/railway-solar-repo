// types/appwrite-models.ts

// Common types
export type AppwriteDocument = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
};

// Location type used across multiple models
export type Location = {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

// Site model
export interface Site extends AppwriteDocument {
  name: string;
  location: Location;
  type: "railway" | "commercial" | "utility" | "residential";
  capacity: number; // in kW
  status: "active" | "under-construction" | "planned" | "decommissioned";
  commissioned?: string; // ISO date string
  division?: string;
  zone?: string;
  description?: string;
  images?: string[]; // Array of storage file IDs
  tags?: string[];
  meta?: Record<string, any>;
}

// EPC Project model
export interface EPCProject extends AppwriteDocument {
  name: string;
  client: string;
  location: Location;
  status:
    | "planning"
    | "procurement"
    | "construction"
    | "testing"
    | "completed"
    | "cancelled";
  capacity: number; // in kW
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string;
  budget: number;
  contractValue: number;
  progress: number; // 0-100
  siteId?: string; // Reference to a site document
  contacts?: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
  }[];
  milestones?: {
    title: string;
    dueDate: string;
    completed: boolean;
    description?: string;
  }[];
}

// Solar Installation model
export interface SolarInstallation extends AppwriteDocument {
  name: string;
  siteId: string; // Reference to a site
  installationType: "roof-mounted" | "ground-mounted" | "canopy" | "floating";
  capacity: number; // in kW
  panels: number;
  efficiency: number; // percentage
  installationDate: string; // ISO date string
  lastMaintenance?: string; // ISO date string
  nextMaintenance?: string; // ISO date string
  status: "operational" | "maintenance" | "offline" | "degraded";
  manufacturer: string;
  modelNumber: string;
  warrantyEnd?: string; // ISO date string
  orientation?: string;
  tilt?: number;
  inverters?: {
    manufacturer: string;
    model: string;
    capacity: number;
    quantity: number;
  }[];
}

// Energy Production model
export interface EnergyProduction extends AppwriteDocument {
  installationId: string; // Reference to a solar installation
  date: string; // ISO date string
  energy: number; // kWh
  peakPower: number; // kW
  sunshine: number; // hours
  efficiency: number; // percentage
  co2Saved: number; // kg
  revenue?: number;
  weatherConditions?: {
    temperature: number;
    cloudCover: number;
    rainfall: number;
  };
}

// Railway Hierarchy model
export interface RailwayHierarchy extends AppwriteDocument {
  name: string;
  type: "division" | "zone" | "station";
  parentId?: string; // Reference to parent in hierarchy
  description?: string;
  code?: string;
  region?: string;
}

// Solar Project Hierarchy model
export interface SolarProjectHierarchy extends AppwriteDocument {
  name: string;
  type: "project" | "phase" | "workPackage" | "task";
  parentId?: string; // Reference to parent in hierarchy
  startDate?: string;
  endDate?: string;
  progress: number; // 0-100
  status: "planned" | "in-progress" | "completed" | "delayed" | "cancelled";
  assignedTo?: string[];
  description?: string;
  priority?: "low" | "medium" | "high" | "critical";
  dependencies?: string[]; // IDs of other items this depends on
}
