// lib/mock-data-init.ts
/**
 * Mock Data Initialization
 *
 * This file provides a function to initialize the mock data on application startup.
 * It's imported in the app/layout.tsx file to ensure data is available for all routes.
 */

import { initializeMockData } from "./mock-data";

// This function will be called on app initialization
export default async function initMockData() {
  try {
    console.log("Initializing mock data on app startup...");
    await initializeMockData();
    console.log("Mock data initialization complete");
    return { success: true };
  } catch (error) {
    console.error("Failed to initialize mock data:", error);
    return { success: false, error };
  }
}
