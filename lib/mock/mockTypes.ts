// lib/mock/mockTypes.ts
export interface SolarStation {
  id: string;
  name: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  division: string;
  zone: string;
  capacity: number;
  status: "operational" | "maintenance" | "construction" | "planned";
  installationDate: string; // ISO date string
  lastMaintenance: string; // ISO date string
  nextMaintenance: string; // ISO date string
  panelType: string;
  panelCount: number;
  efficiency: number;
  landArea: number; // in square meters
  batteryStorage: boolean;
  batteryCapacity?: number; // in kWh
  createdAt: string;
  updatedAt: string;
}

export interface EnergyData {
  id: string;
  stationId: string;
  timestamp: string; // ISO date string
  production: number; // in kWh
  consumption: number; // in kWh
  surplus: number; // in kWh
  weather: "sunny" | "partially_cloudy" | "cloudy" | "rainy";
  temperature: number; // in Celsius
  peakOutput: number; // in kW
  efficiency: number; // percentage
  gridExport: number; // in kWh
  batteryCharge?: number; // percentage
  co2Saved: number; // in kg
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  division: string;
  zone: string;
  startDate: string; // ISO date string
  targetCompletionDate: string; // ISO date string
  actualCompletionDate?: string; // ISO date string
  status:
    | "planning"
    | "approval"
    | "procurement"
    | "construction"
    | "testing"
    | "completed"
    | "cancelled";
  budget: number;
  expenditure: number;
  contractorId: string;
  projectManager: string;
  railwayContact: string;
  capacity: number; // in kW
  priority: "low" | "medium" | "high" | "critical";
  risksAndIssues: ProjectIssue[];
  milestones: Milestone[];
  tags: string[];
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectIssue {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved" | "closed";
  assignedTo: string;
  reportedBy: string;
  reportedDate: string; // ISO date string
  resolutionDate?: string; // ISO date string
  impact: string;
  mitigationPlan: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  completionDate?: string; // ISO date string
  status: "pending" | "in_progress" | "completed" | "delayed";
  dependencies: string[]; // IDs of other milestones
  assignedTo: string;
  weight: number; // Percentage contribution to overall project
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "document" | "video" | "other";
  size: number; // in bytes
  uploadedBy: string;
  uploadedAt: string; // ISO date string
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "project_manager" | "engineer" | "viewer" | "contractor";
  division?: string;
  zone?: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  lastActive: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical" | "success";
  relatedTo?: {
    type: "project" | "station" | "issue" | "milestone";
    id: string;
  };
  read: boolean;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  stationId: string;
  type: "routine" | "emergency" | "upgrade";
  startDate: string;
  endDate: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  assignedTo: string[];
  description: string;
  findings?: string;
  actions?: string;
  cost?: number;
  attachments: Attachment[];
}

export interface Contractor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  specialization: string[];
  rating: number; // 1-5
  activeProjects: number;
  completedProjects: number;
  contractStartDate: string;
  contractEndDate: string;
}

export interface WeatherForecast {
  id: string;
  stationId: string;
  date: string;
  sunrise: string;
  sunset: string;
  maxTemperature: number;
  minTemperature: number;
  condition: "sunny" | "partially_cloudy" | "cloudy" | "rainy" | "stormy";
  precipitationChance: number; // percentage
  windSpeed: number; // in km/h
  predictedProduction: number; // in kWh
}

export interface FinancialSummary {
  id: string;
  period: string; // YYYY-MM
  totalProduction: number; // in kWh
  revenueGenerated: number;
  maintenanceCost: number;
  operationalCost: number;
  netSavings: number;
  roi: number; // percentage
  carbonOffsetValue: number;
}

export interface Alert {
  id: string;
  stationId: string;
  type:
    | "production_drop"
    | "system_failure"
    | "grid_issue"
    | "security"
    | "weather_warning"
    | "maintenance_due";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  actions?: string;
}
