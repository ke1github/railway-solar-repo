// lib/appwrite.ts
import { Client, Account, Databases, Storage, Functions } from "appwrite";

const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "";
const appwriteProjectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
const appwriteDatabaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

// Initialize the Appwrite client
export const appwriteClient = new Client();

appwriteClient.setEndpoint(appwriteEndpoint).setProject(appwriteProjectId);

// Initialize Appwrite services
export const account = new Account(appwriteClient);
export const databases = new Databases(appwriteClient);
export const storage = new Storage(appwriteClient);
export const functions = new Functions(appwriteClient);

// Collection IDs for different entities
export const COLLECTION_IDS = {
  SITES: "sites",
  EPC_PROJECTS: "epc_projects",
  SOLAR_INSTALLATIONS: "solar_installations",
  ENERGY_PRODUCTION: "energy_production",
  RAILWAY_HIERARCHY: "railway_hierarchy",
  SOLAR_PROJECT_HIERARCHY: "solar_project_hierarchy",
};

// Helper function to check if the Appwrite client is initialized
export const isAppwriteConfigured = (): boolean => {
  return Boolean(appwriteEndpoint && appwriteProjectId && appwriteDatabaseId);
};

// Types for Appwrite schema matching
export interface AppwriteSite {
  $id?: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: string;
  capacity: number;
  commissioned?: string; // ISO date string
  description?: string;
  type: string;
  zone?: string;
  division?: string;
  images?: string[]; // Array of storage file IDs
}

export interface AppwriteEPCProject {
  $id?: string;
  name: string;
  client: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: string;
  capacity: number;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string;
  budget: number;
  contractValue: number;
  progress: number;
  siteId?: string; // Reference to a site document
}

export interface AppwriteSolarInstallation {
  $id?: string;
  name: string;
  siteId: string;
  installationType: string;
  capacity: number;
  panels: number;
  efficiency: number;
  installationDate: string; // ISO date string
  lastMaintenance?: string; // ISO date string
  status: string;
  manufacturer: string;
  modelNumber: string;
  warrantyEnd?: string; // ISO date string
  orientation?: string;
  tilt?: number;
}

export interface AppwriteEnergyProduction {
  $id?: string;
  installationId: string;
  date: string; // ISO date string
  energy: number; // kWh
  peakPower: number; // kW
  sunshine: number; // hours
  efficiency: number; // percentage
  co2Saved: number; // kg
  revenue?: number;
}

// Helper functions for working with Appwrite
export const appwriteService = {
  // Generic function to fetch a document by ID
  async getDocument<T>(collectionId: string, documentId: string): Promise<T> {
    return databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      collectionId,
      documentId
    ) as Promise<T>;
  },

  // Generic function to fetch documents with query
  async listDocuments<T>(
    collectionId: string,
    queries: string[] = []
  ): Promise<{ documents: T[]; total: number }> {
    const response = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      collectionId,
      queries
    );

    return {
      documents: response.documents as unknown as T[],
      total: response.total,
    };
  },

  // Generic function to create a document
  async createDocument<T>(
    collectionId: string,
    data: any,
    documentId?: string
  ): Promise<T> {
    return databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      collectionId,
      documentId || "unique()",
      data
    ) as Promise<T>;
  },

  // Generic function to update a document
  async updateDocument<T>(
    collectionId: string,
    documentId: string,
    data: any
  ): Promise<T> {
    return databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      collectionId,
      documentId,
      data
    ) as Promise<T>;
  },

  // Generic function to delete a document
  async deleteDocument(
    collectionId: string,
    documentId: string
  ): Promise<void> {
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      collectionId,
      documentId
    );
  },

  // Upload a file to Appwrite Storage
  async uploadFile(file: File, permissions?: string[]): Promise<string> {
    const response = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
      "unique()",
      file,
      permissions
    );
    return response.$id;
  },

  // Get a file view URL from Appwrite Storage
  getFileView(fileId: string): string {
    return storage.getFileView(
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
      fileId
    );
  },
};
