// lib/adapters/model-adapters.ts
import {
  IRailwaySite,
  IRailwaySiteExtended,
  ISolarProject,
} from "../../models";
import type { Site } from "../../lib/schemas";

/**
 * Adapter functions to convert between legacy models and new models
 * This facilitates a gradual migration away from legacy models
 */

/**
 * Convert a RailwaySite document to a Site object
 */
export function railwaySiteToSite(railwaySite: IRailwaySite): Partial<Site> {
  return {
    siteCode: railwaySite.id,
    name: railwaySite.locationName,
    address: railwaySite.address,
    latitude: railwaySite.latitude,
    longitude: railwaySite.longitude,
    area: railwaySite.rooftopArea || 0,
    feasibleArea: railwaySite.feasibleArea || 0,
    feasibleCapacity: railwaySite.feasibleCapacity || 0,
    sanctionedLoad: parseFloat(railwaySite.sanctionedLoad) || 0,
    sanctionedLoadUnit: "kW",
    zoneCode: railwaySite.zone,
    status:
      railwaySite.status === "operational"
        ? "completed"
        : railwaySite.status === "planning"
        ? "identified"
        : railwaySite.status === "survey"
        ? "surveyed"
        : railwaySite.status === "construction"
        ? "in-progress"
        : "identified",
    projectPhase: railwaySite.status,
  };
}

/**
 * Convert a RailwaySiteExtended document to a Site object with AI metadata
 */
export function extendedSiteToSite(
  extendedSite: IRailwaySiteExtended
): Partial<Site> & Record<string, unknown> {
  // Create a base site object using the properties directly from extended site
  const baseSite: Partial<Site> = {
    siteCode: extendedSite.siteCode,
    // Use other available properties
    zoneCode: extendedSite.zoneCode || "",
    divisionCode: extendedSite.divisionCode || "",
    stationCode: extendedSite.stationCode || "",
  };

  // Create extended properties as a separate object to avoid type errors
  const extendedProps = {
    zoneName: extendedSite.zoneName,
    divisionName: extendedSite.divisionName,
    stationName: extendedSite.stationName,
  };

  // Add AI-specific fields from the extended model
  return {
    ...baseSite,
    ...extendedProps,
    aiMetadata: {
      // Extract relevant fields for AI metadata
      documents: extendedSite.documents || [],
      photos: extendedSite.photos || [],
      // Add any additional fields that might be useful
      aiGenerated: true,
    },
  };
}

/**
 * Convert a SolarProject document to separate Phase objects
 */
export function solarProjectToPhases(
  project: ISolarProject
): Array<Record<string, unknown>> {
  return project.phases.map((phase) => ({
    name: phase.name,
    description: phase.description,
    startDate: phase.startDate,
    endDate: phase.endDate,
    status: phase.status,
    workPackages: phase.workPackages.map((wp) => ({
      name: wp.name,
      description: wp.description,
      startDate: wp.startDate,
      endDate: wp.endDate,
      status: wp.status,
      tasks: wp.tasks.map((task) => ({
        name: task.name,
        description: task.description,
        status: task.status,
        progress: task.progress,
        priority: task.priority,
        assignedTo: task.assignedTo,
        startDate: task.startDate,
        // Use only properties that exist on ITask
        attachments: task.attachments,
      })),
    })),
  }));
}

/**
 * Log deprecation warnings for legacy models
 */
export function logModelDeprecation(modelName: string): void {
  console.warn(
    `[DEPRECATED] The ${modelName} model is deprecated and scheduled for removal. ` +
      `Please refer to docs/MODEL_CONSOLIDATION_PLAN.md for migration guidance.`
  );
}
