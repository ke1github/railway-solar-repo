// models/index.ts
export { default as RailwaySite } from "./RailwaySite";
export { default as EPCProject } from "./EPCProject";
export { default as RailwaySiteExtended } from "./RailwaySiteExtended";

// Import SolarProjectHierarchy model for backward compatibility
import SolarProjectHierarchy from "./SolarProjectHierarchy";
export { SolarProjectHierarchy };

// Hierarchical models
export { default as Zone } from "./Zone";
export { default as Division } from "./Division";
export { default as Station } from "./Station";
export { default as Site } from "./Site";
export { default as SolarInstallation } from "./SolarInstallation";
export { default as EnergyProduction } from "./EnergyProduction";

// Type exports
export type { IRailwaySite } from "./RailwaySite";
export type { IEPCProject } from "./EPCProject";
export type { IRailwaySiteExtended } from "./RailwaySiteExtended";
export type { ISolarProject } from "./SolarProjectHierarchy";
export type { IZone } from "./Zone";
export type { IDivision } from "./Division";
export type { IStation } from "./Station";
export type { ISite } from "./Site";
export type { ISolarInstallation } from "./SolarInstallation";
export type { IEnergyProduction } from "./EnergyProduction";
