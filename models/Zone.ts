// models/Zone.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IZone extends Document {
  code: string;
  name: string;
  description?: string;
  region?: string;
  headOffice?: string;
  establishedYear?: number;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  totalStations?: number;
  totalDivisions?: number;
  status: "active" | "inactive" | "planned";
  createdAt: Date;
  updatedAt: Date;
}

const ZoneSchema: Schema = new Schema(
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
    description: {
      type: String,
      default: "",
    },
    region: {
      type: String,
      trim: true,
      index: true,
    },
    headOffice: {
      type: String,
      trim: true,
    },
    establishedYear: {
      type: Number,
      min: 1850,
      max: new Date().getFullYear(),
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
    totalStations: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalDivisions: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "planned"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "zones",
  }
);

// Virtual for getting the full address
ZoneSchema.virtual("fullAddress").get(function (this: IZone) {
  return this.headOffice
    ? `${this.name} Zone, ${this.headOffice}`
    : `${this.name} Zone`;
});

// Compound indexes for better query performance
ZoneSchema.index({ region: 1, status: 1 });

// Static methods for aggregations
ZoneSchema.statics.getZoneStats = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalZones: { $sum: 1 },
        activeZones: {
          $sum: {
            $cond: [{ $eq: ["$status", "active"] }, 1, 0],
          },
        },
        regions: { $addToSet: "$region" },
      },
    },
  ]);
};

const Zone =
  (mongoose.models.Zone as mongoose.Model<IZone>) ||
  mongoose.model<IZone>("Zone", ZoneSchema);

export default Zone;
