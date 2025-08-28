// types/data-models.ts
import { Entity } from "../lib/data-adapter";

// Site Model
export interface Site extends Entity {
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  status: "active" | "inactive" | "planned" | "under_construction";
  siteType: "station" | "depot" | "maintenance" | "office" | "other";
  area?: number; // in square meters
  createdAt: string;
  updatedAt: string;
  images?: string[];
  description?: string;
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, unknown>;
}

// EPC Project Model
export interface EPCProject extends Entity {
  name: string;
  siteId: string;
  status: "planned" | "in_progress" | "completed" | "cancelled" | "on_hold";
  startDate?: string;
  endDate?: string;
  budget?: number;
  actualCost?: number;
  description?: string;
  contractor?: string;
  projectManager?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: {
    id: string;
    name: string;
    status: "pending" | "in_progress" | "completed";
    dueDate?: string;
    assignee?: string;
  }[];
  documents?: {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }[];
  metadata?: Record<string, unknown>;
}

// Solar Installation Model
export interface SolarInstallation extends Entity {
  siteId: string;
  projectId?: string;
  capacity: number; // in kW
  panelType: string;
  panelCount: number;
  installedDate?: string;
  lastMaintenanceDate?: string;
  status:
    | "planned"
    | "installing"
    | "operational"
    | "maintenance"
    | "decommissioned";
  efficiency?: number; // percentage
  orientation?: string;
  tilt?: number; // in degrees
  inverterType?: string;
  inverterCount?: number;
  createdAt: string;
  updatedAt: string;
  installerInfo?: {
    company: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
  };
  metadata?: Record<string, unknown>;
}

// Energy Production Model
export interface EnergyProduction extends Entity {
  installationId: string;
  date: string;
  productionKWh: number;
  peakOutputKW?: number;
  weather?: {
    condition: string; // e.g., "sunny", "cloudy", "rainy"
    temperature?: number; // in Celsius
    precipitation?: number; // in mm
    windSpeed?: number; // in km/h
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}
