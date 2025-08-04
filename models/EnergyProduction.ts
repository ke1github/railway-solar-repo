// models/EnergyProduction.ts
import mongoose, { Schema, Document } from "mongoose";
import { ISolarInstallation } from "./SolarInstallation";

export interface IEnergyProduction extends Document {
  installationId: mongoose.Types.ObjectId | ISolarInstallation;
  date: Date;
  startHour?: number; // 0-23
  endHour?: number; // 0-23
  energyProduced: number; // in kWh
  peakOutput: number; // in kW
  sunHours: number;
  weatherConditions: "sunny" | "partly cloudy" | "cloudy" | "rainy";
  temperature?: number; // in Celsius
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnergyProductionSchema: Schema = new Schema(
  {
    installationId: {
      type: Schema.Types.ObjectId,
      ref: "SolarInstallation",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    startHour: {
      type: Number,
      min: 0,
      max: 23,
    },
    endHour: {
      type: Number,
      min: 0,
      max: 23,
    },
    energyProduced: {
      type: Number,
      required: true,
      min: 0,
    },
    peakOutput: {
      type: Number,
      required: true,
      min: 0,
    },
    sunHours: {
      type: Number,
      required: true,
      min: 0,
    },
    weatherConditions: {
      type: String,
      enum: ["sunny", "partly cloudy", "cloudy", "rainy"],
      required: true,
    },
    temperature: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "energyProduction",
  }
);

// Create a compound index for date queries and installation
EnergyProductionSchema.index({ installationId: 1, date: 1 }, { unique: true });
EnergyProductionSchema.index({ date: 1 });
EnergyProductionSchema.index({ weatherConditions: 1 });

// Static methods for aggregations
EnergyProductionSchema.statics.getDailyProductionStats = async function (
  installationId: mongoose.Types.ObjectId,
  startDate: Date,
  endDate: Date
) {
  return await this.aggregate([
    {
      $match: {
        installationId: new mongoose.Types.ObjectId(installationId),
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        totalEnergy: { $sum: "$energyProduced" },
        avgPeakOutput: { $avg: "$peakOutput" },
        totalSunHours: { $sum: "$sunHours" },
        recordCount: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

EnergyProductionSchema.statics.getMonthlyProductionStats = async function (
  installationId: mongoose.Types.ObjectId,
  year: number
) {
  return await this.aggregate([
    {
      $match: {
        installationId: new mongoose.Types.ObjectId(installationId),
        date: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" },
        },
        totalEnergy: { $sum: "$energyProduced" },
        avgPeakOutput: { $avg: "$peakOutput" },
        avgSunHours: { $avg: "$sunHours" },
        daysReported: {
          $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
    },
    {
      $addFields: {
        daysCount: { $size: "$daysReported" },
        monthName: {
          $let: {
            vars: {
              monthsInYear: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
            },
            in: {
              $arrayElemAt: [
                "$$monthsInYear",
                { $subtract: ["$_id.month", 1] },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        year: "$_id.year",
        monthName: 1,
        totalEnergy: 1,
        avgPeakOutput: 1,
        avgSunHours: 1,
        daysCount: 1,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);
};

// Virtual getter for efficiency calculation (energy produced vs potential)
EnergyProductionSchema.virtual("efficiency").get(function (
  this: IEnergyProduction
) {
  // Calculate based on peak output, sun hours, and energy produced
  if (!this.peakOutput || !this.sunHours) return 0;

  const potentialEnergy = this.peakOutput * this.sunHours;
  if (potentialEnergy === 0) return 0;

  return (this.energyProduced / potentialEnergy) * 100;
});

const EnergyProduction =
  (mongoose.models.EnergyProduction as mongoose.Model<IEnergyProduction>) ||
  mongoose.model<IEnergyProduction>("EnergyProduction", EnergyProductionSchema);

export default EnergyProduction;
