// models/Station.ts
import mongoose, { Schema, Document } from "mongoose";
import { IZone } from "./Zone";
import { IDivision } from "./Division";

export interface IStation extends Document {
  code: string;
  name: string;
  divisionId: mongoose.Types.ObjectId | IDivision;
  divisionCode: string;
  zoneId: mongoose.Types.ObjectId | IZone;
  zoneCode: string;
  stationType: "major" | "minor" | "halt" | "junction" | "terminal";
  category: string; // Station category (A1, A, B, C, D, E, F)
  address: string;
  latitude?: number;
  longitude?: number;
  elevation?: number; // in meters
  platforms?: number;
  tracks?: number;
  establishedYear?: number;
  annualFootfall?: number;
  amenities?: string[];
  nearbyLandmarks?: string[];
  status: "operational" | "under-construction" | "closed" | "planned";
  hasWifi?: boolean;
  hasFoodCourt?: boolean;
  hasElectricityMeters?: boolean;
  electricityConnectionDetails?: {
    consumerNumber?: string;
    sanctionedLoad?: number;
    loadUnit?: string;
    connectionType?: string;
    supplier?: string;
  };
  rooftopArea?: number; // in square meters
  parkingArea?: number; // in square meters
  landArea?: number; // in square meters
  createdAt: Date;
  updatedAt: Date;
}

const StationSchema: Schema = new Schema(
  {
    code: {
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
    stationType: {
      type: String,
      enum: ["major", "minor", "halt", "junction", "terminal"],
      default: "minor",
      index: true,
    },
    category: {
      type: String,
      enum: ["A1", "A", "B", "C", "D", "E", "F"],
      default: "D",
      index: true,
    },
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },
    elevation: {
      type: Number,
    },
    platforms: {
      type: Number,
      min: 1,
    },
    tracks: {
      type: Number,
      min: 1,
    },
    establishedYear: {
      type: Number,
      min: 1850,
      max: new Date().getFullYear(),
    },
    annualFootfall: {
      type: Number,
      min: 0,
    },
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    nearbyLandmarks: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["operational", "under-construction", "closed", "planned"],
      default: "operational",
      index: true,
    },
    hasWifi: {
      type: Boolean,
      default: false,
    },
    hasFoodCourt: {
      type: Boolean,
      default: false,
    },
    hasElectricityMeters: {
      type: Boolean,
      default: true,
    },
    electricityConnectionDetails: {
      consumerNumber: {
        type: String,
        trim: true,
      },
      sanctionedLoad: {
        type: Number,
        min: 0,
      },
      loadUnit: {
        type: String,
        enum: ["kW", "MW", "kVA", "MVA"],
        default: "kW",
      },
      connectionType: {
        type: String,
        trim: true,
      },
      supplier: {
        type: String,
        trim: true,
      },
    },
    rooftopArea: {
      type: Number,
      min: 0,
    },
    parkingArea: {
      type: Number,
      min: 0,
    },
    landArea: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "stations",
  }
);

// Compound indexes for better query performance
StationSchema.index({ divisionId: 1, status: 1 });
StationSchema.index({ zoneId: 1, divisionId: 1 });
StationSchema.index({ latitude: 1, longitude: 1 });
StationSchema.index({ stationType: 1, category: 1 });

// Virtual for full station name with code
StationSchema.virtual("fullName").get(function (this: IStation) {
  return `${this.name} (${this.code})`;
});

// Virtual for solar potential calculation based on rooftop area
StationSchema.virtual("solarPotential").get(function (this: IStation) {
  if (!this.rooftopArea) return 0;
  // Estimated solar potential: 100 Wp per square meter of rooftop area
  return Math.round(this.rooftopArea * 0.1); // In kWp
});

// Static methods for aggregations
StationSchema.statics.getStationsInDivision = async function (
  divisionId: mongoose.Types.ObjectId
) {
  return await this.find({ divisionId }).sort({ name: 1 });
};

StationSchema.statics.getStationsByCategory = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        averageRooftopArea: { $avg: "$rooftopArea" },
        totalRooftopArea: { $sum: "$rooftopArea" },
        stations: { $push: { code: "$code", name: "$name" } },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

StationSchema.statics.getSolarPotentialByZone = async function () {
  return await this.aggregate([
    {
      $match: {
        rooftopArea: { $gt: 0 },
      },
    },
    {
      $addFields: {
        solarPotential: { $multiply: ["$rooftopArea", 0.1] },
      },
    },
    {
      $group: {
        _id: "$zoneId",
        zoneCode: { $first: "$zoneCode" },
        totalStations: { $sum: 1 },
        totalRooftopArea: { $sum: "$rooftopArea" },
        totalSolarPotential: { $sum: "$solarPotential" },
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
        totalStations: 1,
        totalRooftopArea: 1,
        totalSolarPotential: 1,
        avgSolarPotentialPerStation: {
          $divide: ["$totalSolarPotential", "$totalStations"],
        },
      },
    },
    {
      $sort: { totalSolarPotential: -1 },
    },
  ]);
};

const Station =
  (mongoose.models.Station as mongoose.Model<IStation>) ||
  mongoose.model<IStation>("Station", StationSchema);

export default Station;
