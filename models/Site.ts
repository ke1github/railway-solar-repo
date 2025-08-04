// models/Site.ts
import mongoose, { Schema, Document } from "mongoose";
import { IStation } from "./Station";
import { IDivision } from "./Division";
import { IZone } from "./Zone";

export interface ISite extends Document {
  siteCode: string;
  name: string;
  stationId: mongoose.Types.ObjectId | IStation;
  stationCode: string;
  divisionId: mongoose.Types.ObjectId | IDivision;
  divisionCode: string;
  zoneId: mongoose.Types.ObjectId | IZone;
  zoneCode: string;
  siteType: "rooftop" | "land" | "carport" | "hybrid" | "other";
  address: string;
  latitude: number;
  longitude: number;
  area: number; // Total area in square meters
  feasibleArea: number; // Feasible area for installation in square meters
  feasibleCapacity: number; // Potential capacity in kWp
  sanctionedLoad: number; // Sanctioned electrical load in kW
  sanctionedLoadUnit: string;
  electricityConsumerNumber?: string;
  electricitySupplier?: string;
  electricityTariff?: number;
  annualConsumption?: number; // Annual electricity consumption in kWh
  peakDemand?: number; // Peak electricity demand in kW
  shadingPercentage?: number; // Percentage of site affected by shading
  tiltAngle?: number; // Optimal tilt angle for solar panels
  azimuthAngle?: number; // Optimal azimuth angle for solar panels
  structureType?: "RCC" | "metal" | "hybrid" | "other";
  structureAge?: number; // Age of the structure in years
  structuralAssessment?: "suitable" | "needs-reinforcement" | "unsuitable";
  accessibilityRating?: "easy" | "moderate" | "difficult";
  nearestRoad?: number; // Distance to nearest road in meters
  interconnectionPoint?: string; // Description of the electrical interconnection point
  distanceToInterconnection?: number; // Distance to interconnection point in meters
  waterSource?: boolean; // Availability of water for panel cleaning
  security?: string; // Security measures available at the site
  permitStatus?: "not-required" | "pending" | "approved" | "rejected";
  environmentalClearance?: boolean; // Environmental clearance status
  siteSurveyDate?: Date; // Date of the site survey
  surveyedBy?: string; // Name of the surveyor
  obstaclesNearby?: string[]; // List of obstacles that may affect installation
  notes?: string; // Additional notes about the site
  photos?: {
    url: string;
    caption?: string;
    date: Date;
    category: "site" | "roof" | "equipment" | "obstacle" | "other";
  }[];
  documents?: {
    title: string;
    url: string;
    type: string;
    uploadDate: Date;
  }[];
  suitabilityScore?: number; // Overall suitability score from 0-100
  status:
    | "identified"
    | "surveyed"
    | "approved"
    | "rejected"
    | "in-progress"
    | "completed";
  projectPhase:
    | "planning"
    | "survey"
    | "design"
    | "procurement"
    | "construction"
    | "commissioning"
    | "operational"
    | "maintenance";
  expectedAnnualGeneration?: number; // Expected annual electricity generation in kWh
  expectedPRRatio?: number; // Expected performance ratio (0-1)
  constructionStartDate?: Date;
  commissioningDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSchema: Schema = new Schema(
  {
    siteCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    stationId: {
      type: Schema.Types.ObjectId,
      ref: "Station",
      required: true,
      index: true,
    },
    stationCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    divisionId: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: true,
      index: true,
    },
    divisionCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    zoneId: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
      index: true,
    },
    zoneCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    siteType: {
      type: String,
      enum: ["rooftop", "land", "carport", "hybrid", "other"],
      default: "rooftop",
      index: true,
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    area: {
      type: Number,
      required: true,
      min: 0,
    },
    feasibleArea: {
      type: Number,
      required: true,
      min: 0,
    },
    feasibleCapacity: {
      type: Number,
      required: true,
      min: 0,
    },
    sanctionedLoad: {
      type: Number,
      required: true,
      min: 0,
    },
    sanctionedLoadUnit: {
      type: String,
      enum: ["kW", "MW", "kVA", "MVA"],
      default: "kW",
    },
    electricityConsumerNumber: {
      type: String,
      trim: true,
    },
    electricitySupplier: {
      type: String,
      trim: true,
    },
    electricityTariff: {
      type: Number,
      min: 0,
    },
    annualConsumption: {
      type: Number,
      min: 0,
    },
    peakDemand: {
      type: Number,
      min: 0,
    },
    shadingPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    tiltAngle: {
      type: Number,
      min: 0,
      max: 90,
    },
    azimuthAngle: {
      type: Number,
      min: 0,
      max: 360,
    },
    structureType: {
      type: String,
      enum: ["RCC", "metal", "hybrid", "other"],
    },
    structureAge: {
      type: Number,
      min: 0,
    },
    structuralAssessment: {
      type: String,
      enum: ["suitable", "needs-reinforcement", "unsuitable"],
    },
    accessibilityRating: {
      type: String,
      enum: ["easy", "moderate", "difficult"],
    },
    nearestRoad: {
      type: Number,
      min: 0,
    },
    interconnectionPoint: {
      type: String,
      trim: true,
    },
    distanceToInterconnection: {
      type: Number,
      min: 0,
    },
    waterSource: {
      type: Boolean,
      default: false,
    },
    security: {
      type: String,
      trim: true,
    },
    permitStatus: {
      type: String,
      enum: ["not-required", "pending", "approved", "rejected"],
      default: "not-required",
    },
    environmentalClearance: {
      type: Boolean,
      default: true,
    },
    siteSurveyDate: {
      type: Date,
    },
    surveyedBy: {
      type: String,
      trim: true,
    },
    obstaclesNearby: [
      {
        type: String,
        trim: true,
      },
    ],
    notes: {
      type: String,
      trim: true,
    },
    photos: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        category: {
          type: String,
          enum: ["site", "roof", "equipment", "obstacle", "other"],
          default: "site",
        },
      },
    ],
    documents: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          trim: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    suitabilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: [
        "identified",
        "surveyed",
        "approved",
        "rejected",
        "in-progress",
        "completed",
      ],
      default: "identified",
      index: true,
    },
    projectPhase: {
      type: String,
      enum: [
        "planning",
        "survey",
        "design",
        "procurement",
        "construction",
        "commissioning",
        "operational",
        "maintenance",
      ],
      default: "planning",
      index: true,
    },
    expectedAnnualGeneration: {
      type: Number,
      min: 0,
    },
    expectedPRRatio: {
      type: Number,
      min: 0,
      max: 1,
    },
    constructionStartDate: {
      type: Date,
    },
    commissioningDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "sites",
  }
);

// Compound indexes for better query performance
SiteSchema.index({ stationId: 1, status: 1 });
SiteSchema.index({ divisionId: 1, projectPhase: 1 });
SiteSchema.index({ zoneId: 1, siteType: 1 });
SiteSchema.index({ latitude: 1, longitude: 1 });
SiteSchema.index({ feasibleCapacity: -1, suitabilityScore: -1 });

// Virtual for payback period calculation
SiteSchema.virtual("estimatedPaybackYears").get(function (this: ISite) {
  if (
    !this.feasibleCapacity ||
    !this.electricityTariff ||
    !this.expectedAnnualGeneration
  ) {
    return null;
  }

  // Estimated cost: $700 per kWp installed
  const installationCost = this.feasibleCapacity * 700;
  // Annual savings: expected generation × electricity tariff
  const annualSavings = this.expectedAnnualGeneration * this.electricityTariff;

  return annualSavings > 0 ? installationCost / annualSavings : null;
});

// Virtual for capacity utilization factor
SiteSchema.virtual("capacityUtilizationFactor").get(function (this: ISite) {
  if (!this.expectedAnnualGeneration || !this.feasibleCapacity) {
    return null;
  }

  // CUF = Annual Generation (kWh) / (Capacity (kW) × 24 hours × 365 days)
  return this.expectedAnnualGeneration / (this.feasibleCapacity * 24 * 365);
});

// Static methods for aggregations
SiteSchema.statics.getSitesByZone = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$zoneId",
        zoneCode: { $first: "$zoneCode" },
        totalSites: { $sum: 1 },
        totalCapacity: { $sum: "$feasibleCapacity" },
        averageCapacity: { $avg: "$feasibleCapacity" },
        siteTypes: { $addToSet: "$siteType" },
      },
    },
    {
      $lookup: {
        from: "zones",
        localField: "_id",
        foreignField: "_id",
        as: "zoneInfo",
      },
    },
    {
      $unwind: {
        path: "$zoneInfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        zoneCode: 1,
        zoneName: "$zoneInfo.name",
        totalSites: 1,
        totalCapacity: 1,
        averageCapacity: 1,
        siteTypes: 1,
      },
    },
    {
      $sort: { totalCapacity: -1 },
    },
  ]);
};

SiteSchema.statics.getSitesByPhase = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$projectPhase",
        count: { $sum: 1 },
        totalCapacity: { $sum: "$feasibleCapacity" },
        sites: {
          $push: {
            siteCode: "$siteCode",
            name: "$name",
            capacity: "$feasibleCapacity",
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

const Site =
  (mongoose.models.Site as mongoose.Model<ISite>) ||
  mongoose.model<ISite>("Site", SiteSchema);

export default Site;
