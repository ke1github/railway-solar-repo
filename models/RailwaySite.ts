// models/RailwaySite.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRailwaySite extends Document {
  id: string;
  serialNumber: number;
  address: string;
  latitude: number;
  longitude: number;
  sanctionedLoad: string;
  locationName: string;
  cluster: string;
  zone: string;
  consigneeDetails: string;
  rooftopArea: number;
  feasibleArea: number;
  feasibleCapacity: number;
  status: 'planning' | 'survey' | 'design' | 'construction' | 'operational' | 'maintenance';
  installationDate?: Date;
  lastMaintenanceDate?: Date;
  energyGenerated?: number;
  efficiency?: number;
  createdAt: Date;
  updatedAt: Date;
}

const RailwaySiteSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  serialNumber: {
    type: Number,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
    index: true
  },
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  sanctionedLoad: {
    type: String,
    default: ''
  },
  locationName: {
    type: String,
    required: true,
    index: true
  },
  cluster: {
    type: String,
    required: true,
    enum: ['KGP', 'MCA', 'BLS', 'GII', 'HALDIA', 'DGHA', 'KGP 2'],
    index: true
  },
  zone: {
    type: String,
    required: true,
    index: true
  },
  consigneeDetails: {
    type: String,
    required: true
  },
  rooftopArea: {
    type: Number,
    required: true,
    min: 0
  },
  feasibleArea: {
    type: Number,
    required: true,
    min: 0
  },
  feasibleCapacity: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['planning', 'survey', 'design', 'construction', 'operational', 'maintenance'],
    default: 'planning',
    index: true
  },
  installationDate: {
    type: Date,
    default: null
  },
  lastMaintenanceDate: {
    type: Date,
    default: null
  },
  energyGenerated: {
    type: Number,
    default: 0,
    min: 0
  },
  efficiency: {
    type: Number,
    default: 85,
    min: 0,
    max: 100
  }
}, {
  timestamps: true,
  collection: 'railway_sites'
});

// Compound indexes for better query performance
RailwaySiteSchema.index({ cluster: 1, status: 1 });
RailwaySiteSchema.index({ latitude: 1, longitude: 1 });
RailwaySiteSchema.index({ feasibleCapacity: -1 });

// Virtual for total project metrics
RailwaySiteSchema.virtual('capacityRange').get(function(this: IRailwaySite) {
  if (this.feasibleCapacity >= 30) return 'high';
  if (this.feasibleCapacity >= 15) return 'medium';
  return 'low';
});

// Static methods for aggregations
RailwaySiteSchema.statics.getProjectStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalSites: { $sum: 1 },
        totalCapacity: { $sum: '$feasibleCapacity' },
        totalArea: { $sum: '$feasibleArea' },
        clusters: { $addToSet: '$cluster' },
        avgCapacity: { $avg: '$feasibleCapacity' },
        maxCapacity: { $max: '$feasibleCapacity' },
        minCapacity: { $min: '$feasibleCapacity' }
      }
    }
  ]);
  
  return stats[0] || {
    totalSites: 0,
    totalCapacity: 0,
    totalArea: 0,
    clusters: [],
    avgCapacity: 0,
    maxCapacity: 0,
    minCapacity: 0
  };
};

RailwaySiteSchema.statics.getClusterStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$cluster',
        count: { $sum: 1 },
        totalCapacity: { $sum: '$feasibleCapacity' },
        totalArea: { $sum: '$feasibleArea' },
        avgCapacity: { $avg: '$feasibleCapacity' },
        statuses: { $addToSet: '$status' }
      }
    },
    {
      $sort: { totalCapacity: -1 }
    }
  ]);
};

export default mongoose.models.RailwaySite || mongoose.model<IRailwaySite>('RailwaySite', RailwaySiteSchema);
