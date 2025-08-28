// lib/data-adapter.ts
/**
 * Data Adapter - A flexible interface for data operations
 *
 * This file provides a consistent interface for data operations, whether using
 * mock data or real backend services. This allows us to switch implementations
 * without changing the calling code.
 *
 * Currently using mock data, can be replaced with Appwrite or other services later.
 */

import { v4 as uuidv4 } from "uuid";

// Type for filter values
export type FilterValue = string | number | boolean | null;

// Type for any entity with an ID
export interface Entity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Mock database to store our data
interface MockData {
  [collection: string]: Entity[];
}

const mockDatabase: MockData = {
  sites: [],
  epcProjects: [],
  solarInstallations: [],
  energyProduction: [],
};

// Generic CRUD operations interface
export const dataAdapter = {
  // Create a record
  async create<T extends Entity>(
    collection: string,
    data: Omit<T, "id">
  ): Promise<T> {
    const newItem = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!mockDatabase[collection]) {
      mockDatabase[collection] = [];
    }

    const typedItem = newItem as unknown as Entity;
    mockDatabase[collection].push(typedItem);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return newItem as unknown as T; // Return a copy to prevent mutation
  },

  // Read all records (with optional filters)
  async getAll<T extends Entity>(
    collection: string,
    filters?: Record<string, FilterValue>
  ): Promise<T[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!mockDatabase[collection]) {
      return [];
    }

    let results = [...mockDatabase[collection]];

    // Apply filters if provided
    if (filters) {
      results = results.filter((item) => {
        return Object.entries(filters).every(([key, value]) => {
          // Handle nested properties with dot notation (e.g., "location.city")
          if (key.includes(".")) {
            const parts = key.split(".");
            let nestedValue: any = item;
            for (const part of parts) {
              if (nestedValue === undefined || nestedValue === null)
                return false;
              nestedValue = nestedValue[part];
            }
            return nestedValue === value;
          }

          // Handle search filter (case insensitive)
          if (key === "search" && typeof value === "string") {
            const searchStr = value.toLowerCase();
            return Object.values(item).some(
              (v) =>
                typeof v === "string" && v.toLowerCase().includes(searchStr)
            );
          }

          // Handle regular property
          return (item as any)[key] === value;
        });
      });
    }

    return results as unknown as T[];
  },

  // Read a single record by ID
  async getById<T extends Entity>(
    collection: string,
    id: string
  ): Promise<T | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!mockDatabase[collection]) {
      return null;
    }

    const item = mockDatabase[collection].find((item) => item.id === id);
    return item ? ({ ...item } as unknown as T) : null;
  },

  // Update a record
  async update<T extends Entity>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<T | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!mockDatabase[collection]) {
      return null;
    }

    const index = mockDatabase[collection].findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    const updatedItem = {
      ...mockDatabase[collection][index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockDatabase[collection][index] = updatedItem;

    return updatedItem as unknown as T;
  },

  // Delete a record
  async delete(collection: string, id: string): Promise<boolean> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!mockDatabase[collection]) {
      return false;
    }

    const index = mockDatabase[collection].findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    mockDatabase[collection].splice(index, 1);
    return true;
  },

  // Custom query for more complex operations
  async query<T extends Entity>(
    collection: string,
    queryFn: (items: Entity[]) => Entity[]
  ): Promise<T[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (!mockDatabase[collection]) {
      return [];
    }

    const results = queryFn([...mockDatabase[collection]]);
    return results as unknown as T[];
  },

  // Populate mock data (for development/testing)
  async seedCollection<T extends Entity>(
    collection: string,
    data: T[]
  ): Promise<void> {
    mockDatabase[collection] = data.map((item) => ({
      ...item,
      id: item.id || uuidv4(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    }));
  },
};

// Helper function to convert URL query parameters to filters
export const queryToFilters = (
  queryString?: string
): Record<string, FilterValue> | undefined => {
  if (!queryString) return undefined;

  const params = new URLSearchParams(queryString);
  const filters: Record<string, FilterValue> = {};

  // Convert params to filters
  params.forEach((value, key) => {
    if (value === "all") return; // Skip 'all' values
    if (value === "") return; // Skip empty values

    // Try to parse numbers and booleans
    if (value === "true") filters[key] = true;
    else if (value === "false") filters[key] = false;
    else if (!isNaN(Number(value))) filters[key] = Number(value);
    else filters[key] = value;
  });

  return Object.keys(filters).length > 0 ? filters : undefined;
};
