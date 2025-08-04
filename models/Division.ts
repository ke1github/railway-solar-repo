// models/Division.ts
import mongoose, { Schema, Document } from "mongoose";
import { IZone } from "./Zone";

export interface IDivision extends Document {
  code: string;
  name: string;
  zoneId: mongoose.Types.ObjectId | IZone;
  zoneCode: string;
  description?: string;
  headquarter?: string;
  establishedYear?: number;
  area?: number; // in square km
  totalStations?: number;
  divisionType?: "operational" | "commercial" | "administrative" | "mixed";
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: "active" | "inactive" | "planned" | "merged";
  annualBudget?: number;
  budgetCurrency?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DivisionSchema: Schema = new Schema(
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
    description: {
      type: String,
      default: "",
    },
    headquarter: {
      type: String,
      trim: true,
    },
    establishedYear: {
      type: Number,
      min: 1850,
      max: new Date().getFullYear(),
    },
    area: {
      type: Number,
      min: 0,
    },
    totalStations: {
      type: Number,
      min: 0,
      default: 0,
    },
    divisionType: {
      type: String,
      enum: ["operational", "commercial", "administrative", "mixed"],
      default: "mixed",
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "planned", "merged"],
      default: "active",
      index: true,
    },
    annualBudget: {
      type: Number,
      min: 0,
    },
    budgetCurrency: {
      type: String,
      default: "INR",
      uppercase: true,
    },
  },
  {
    timestamps: true,
    collection: "divisions",
  }
);

// Compound indexes for better query performance
DivisionSchema.index({ zoneId: 1, status: 1 });
DivisionSchema.index({ zoneCode: 1, code: 1 }, { unique: true });

// Virtual for getting the full division name with zone
DivisionSchema.virtual("fullName").get(function (this: IDivision) {
  return `${this.name} Division (${this.zoneCode})`;
});

// Static methods for aggregations
DivisionSchema.statics.getDivisionsInZone = async function (
  zoneId: mongoose.Types.ObjectId
) {
  return await this.find({ zoneId }).sort({ name: 1 });
};

DivisionSchema.statics.getDivisionStats = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$zoneId",
        zoneCode: { $first: "$zoneCode" },
        totalDivisions: { $sum: 1 },
        activeDivisions: {
          $sum: {
            $cond: [{ $eq: ["$status", "active"] }, 1, 0],
          },
        },
        totalStations: { $sum: "$totalStations" },
        avgStationsPerDivision: { $avg: "$totalStations" },
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
        totalDivisions: 1,
        activeDivisions: 1,
        totalStations: 1,
        avgStationsPerDivision: 1,
      },
    },
    {
      $sort: { totalDivisions: -1 },
    },
  ]);
};

const Division =
  (mongoose.models.Division as mongoose.Model<IDivision>) ||
  mongoose.model<IDivision>("Division", DivisionSchema);

export default Division;
