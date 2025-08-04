// models/SolarInstallation.ts
import mongoose, { Schema, Document } from "mongoose";
import { IStation } from "./Station";

export interface ISolarInstallation extends Document {
  stationId: mongoose.Types.ObjectId | IStation;
  stationCode: string;
  capacity: number; // in kW
  installationDate: Date;
  commissionDate?: Date;
  panelType: string;
  numberOfPanels: number;
  installedArea: number; // in square meters
  contractor?: string;
  maintenanceSchedule: "monthly" | "quarterly" | "biannually" | "annually";
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  expectedLifespan: number; // in years
  warrantyPeriod?: number; // in years
  totalCost?: number;
  costCurrency?: string;
  status:
    | "planned"
    | "under-installation"
    | "operational"
    | "maintenance"
    | "decommissioned";
  generationData?: {
    lifetimeGeneration: number; // in kWh
    averageDailyGeneration: number; // in kWh
    bestDayGeneration: number; // in kWh
    bestDayDate?: Date;
  };
  mounting?: {
    type: "rooftop" | "ground" | "canopy" | "facade" | "other";
    angle?: number;
    orientation?: string;
  };
  inverters?: {
    count: number;
    brand?: string;
    model?: string;
    capacity?: number; // in kW
  };
  batteries?: {
    installed: boolean;
    capacity?: number; // in kWh
    type?: string;
  };
  gridConnection?: {
    isGridConnected: boolean;
    connectionType?: "net-metering" | "gross-metering" | "off-grid";
    meteringId?: string;
  };
  documents?: {
    name: string;
    url: string;
    type: string;
    uploadDate: Date;
  }[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SolarInstallationSchema: Schema = new Schema(
  {
    stationId: {
      type: Schema.Types.ObjectId,
      ref: "Station",
      required: true,
      index: true,
    },
    stationCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 0,
    },
    installationDate: {
      type: Date,
      required: true,
    },
    commissionDate: {
      type: Date,
    },
    panelType: {
      type: String,
      required: true,
    },
    numberOfPanels: {
      type: Number,
      required: true,
      min: 1,
    },
    installedArea: {
      type: Number,
      required: true,
      min: 0,
    },
    contractor: {
      type: String,
      trim: true,
    },
    maintenanceSchedule: {
      type: String,
      enum: ["monthly", "quarterly", "biannually", "annually"],
      default: "quarterly",
    },
    lastMaintenance: {
      type: Date,
    },
    nextMaintenance: {
      type: Date,
    },
    expectedLifespan: {
      type: Number,
      min: 1,
      default: 25,
    },
    warrantyPeriod: {
      type: Number,
      min: 0,
    },
    totalCost: {
      type: Number,
      min: 0,
    },
    costCurrency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: [
        "planned",
        "under-installation",
        "operational",
        "maintenance",
        "decommissioned",
      ],
      default: "planned",
      index: true,
    },
    generationData: {
      lifetimeGeneration: {
        type: Number,
        default: 0,
      },
      averageDailyGeneration: {
        type: Number,
        default: 0,
      },
      bestDayGeneration: {
        type: Number,
        default: 0,
      },
      bestDayDate: {
        type: Date,
      },
    },
    mounting: {
      type: {
        type: String,
        enum: ["rooftop", "ground", "canopy", "facade", "other"],
        default: "rooftop",
      },
      angle: {
        type: Number,
      },
      orientation: {
        type: String,
      },
    },
    inverters: {
      count: {
        type: Number,
        default: 1,
      },
      brand: {
        type: String,
      },
      model: {
        type: String,
      },
      capacity: {
        type: Number,
      },
    },
    batteries: {
      installed: {
        type: Boolean,
        default: false,
      },
      capacity: {
        type: Number,
      },
      type: {
        type: String,
      },
    },
    gridConnection: {
      isGridConnected: {
        type: Boolean,
        default: true,
      },
      connectionType: {
        type: String,
        enum: ["net-metering", "gross-metering", "off-grid"],
      },
      meteringId: {
        type: String,
      },
    },
    documents: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "solarInstallations",
  }
);

// Pre-save middleware to calculate next maintenance date
SolarInstallationSchema.pre("save", function (next) {
  if (
    this.lastMaintenance &&
    this.lastMaintenance instanceof Date &&
    !isNaN(this.lastMaintenance.getTime())
  ) {
    const lastMaintenance = new Date(this.lastMaintenance);
    const nextMaintenance = new Date(lastMaintenance);

    switch (this.maintenanceSchedule) {
      case "monthly":
        nextMaintenance.setMonth(nextMaintenance.getMonth() + 1);
        break;
      case "quarterly":
        nextMaintenance.setMonth(nextMaintenance.getMonth() + 3);
        break;
      case "biannually":
        nextMaintenance.setMonth(nextMaintenance.getMonth() + 6);
        break;
      case "annually":
        nextMaintenance.setFullYear(nextMaintenance.getFullYear() + 1);
        break;
    }

    this.nextMaintenance = nextMaintenance;
  }

  next();
});

// Create indexes for better query performance
SolarInstallationSchema.index({ capacity: 1 });
SolarInstallationSchema.index({ installationDate: 1 });
SolarInstallationSchema.index({ status: 1 });
SolarInstallationSchema.index({ "mounting.type": 1 });
SolarInstallationSchema.index({
  "gridConnection.isGridConnected": 1,
  "gridConnection.connectionType": 1,
});

// Static methods for aggregations
SolarInstallationSchema.statics.getTotalInstalledCapacity = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalCapacity: { $sum: "$capacity" },
        totalInstallations: { $sum: 1 },
        totalPanels: { $sum: "$numberOfPanels" },
        totalArea: { $sum: "$installedArea" },
      },
    },
  ]);
};

SolarInstallationSchema.statics.getCapacityByStation = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$stationId",
        stationCode: { $first: "$stationCode" },
        totalCapacity: { $sum: "$capacity" },
        installationCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "stations",
        localField: "_id",
        foreignField: "_id",
        as: "station",
      },
    },
    {
      $unwind: {
        path: "$station",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        stationCode: 1,
        stationName: "$station.name",
        totalCapacity: 1,
        installationCount: 1,
      },
    },
    {
      $sort: { totalCapacity: -1 },
    },
  ]);
};

const SolarInstallation =
  (mongoose.models.SolarInstallation as mongoose.Model<ISolarInstallation>) ||
  mongoose.model<ISolarInstallation>(
    "SolarInstallation",
    SolarInstallationSchema
  );

export default SolarInstallation;
