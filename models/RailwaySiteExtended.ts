// models/RailwaySiteExtended.ts
import mongoose, { Schema } from "mongoose";

// Extending the RailwaySite model to include additional fields for AI functionality

// Types for tracking documents and photos
interface ISiteDocument {
  name: string;
  type: string;
  url: string;
  tags: string[];
  aiGeneratedMetadata?: {
    contentSummary?: string;
    detectedEntities?: string[];
    relevance?: number;
  };
  uploadedAt: Date;
}

interface IPhoto {
  name: string;
  url: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  tags: string[];
  aiGeneratedTags?: string[];
  aiDetectedObjects?: string[];
  notes?: string;
}

// Types for project tracking
interface TaskStatus {
  name: string;
  status: "pending" | "in-progress" | "completed" | "delayed";
  assignedTo?: string;
  plannedStartDate?: Date;
  actualStartDate?: Date;
  plannedEndDate?: Date;
  actualEndDate?: Date;
  completionPercentage: number;
  notes?: string;
  lastUpdated: Date;
  updatedBy?: string;
}

interface ProjectMilestone {
  name: string;
  description: string;
  plannedDate: Date;
  actualDate?: Date;
  status: "pending" | "in-progress" | "completed" | "delayed";
  completionPercentage: number;
  tasks: TaskStatus[];
  dependencies?: string[]; // IDs of other milestones this depends on
  lastUpdated: Date;
  criticalPath: boolean;
}

interface MaterialTracking {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: "ordered" | "shipped" | "delivered" | "installed" | "defective";
  orderDate?: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  installationDate?: Date;
  supplier?: string;
  invoiceNumber?: string;
  notes?: string;
}

interface TeamMember {
  name: string;
  role: string;
  contactInfo: string;
  expertise: string[];
  availability: {
    startDate: Date;
    endDate?: Date;
  }[];
}

interface WeatherData {
  date: Date;
  temperature: number;
  conditions: string;
  rainfall: number;
  humidity: number;
  windSpeed: number;
  workingHoursLost?: number;
  impact: "none" | "low" | "medium" | "high";
}

// Main interface
export interface IRailwaySiteExtended extends mongoose.Document {
  // Reference to original site
  siteId: mongoose.Types.ObjectId;
  siteCode: string;

  // Railway Hierarchy References
  stationId?: mongoose.Types.ObjectId;
  stationName?: string;
  stationCode?: string;
  divisionId?: mongoose.Types.ObjectId;
  divisionName?: string;
  divisionCode?: string;
  zoneId?: mongoose.Types.ObjectId;
  zoneName?: string;
  zoneCode?: string;

  // Enhanced project tracking
  projectProgress: {
    overallCompletion: number;
    milestones: ProjectMilestone[];
    currentPhase: string;
    startDate: Date;
    estimatedCompletionDate: Date;
    revisedCompletionDate?: Date;
    lastUpdated: Date;
  };

  // Materials and logistics
  materials: MaterialTracking[];
  team: TeamMember[];

  // Documents and photos
  documents: ISiteDocument[];
  photos: IPhoto[];

  // Weather and environmental factors
  weatherHistory: WeatherData[];

  // AI-generated data
  aiInsights: {
    predictedCompletionDate?: Date;
    riskAssessment?: "low" | "medium" | "high";
    potentialDelays?: string[];
    suggestionForImprovement?: string[];
    nearbyRelatedSites?: {
      siteId: string;
      distance: number;
    }[];
    lastUpdated: Date;
  };

  // Timeline of status changes for historical tracking
  statusTimeline: {
    status: string;
    timestamp: Date;
    updatedBy?: string;
    notes?: string;
  }[];
}

const RailwaySiteExtendedSchema: Schema = new Schema(
  {
    // Reference to original site
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "RailwaySite",
      required: true,
      unique: true,
    },
    siteCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Railway Hierarchy References
    stationId: {
      type: Schema.Types.ObjectId,
      ref: "Station",
      index: true,
    },
    stationName: {
      type: String,
      index: true,
    },
    stationCode: {
      type: String,
      index: true,
    },
    divisionId: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      index: true,
    },
    divisionName: {
      type: String,
      index: true,
    },
    divisionCode: {
      type: String,
      index: true,
    },
    zoneId: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      index: true,
    },
    zoneName: {
      type: String,
      index: true,
    },
    zoneCode: {
      type: String,
      index: true,
    },

    // Enhanced project tracking
    projectProgress: {
      overallCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      milestones: [
        {
          name: String,
          description: String,
          plannedDate: Date,
          actualDate: Date,
          status: {
            type: String,
            enum: ["pending", "in-progress", "completed", "delayed"],
            default: "pending",
          },
          completionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
          },
          tasks: [
            {
              name: String,
              status: {
                type: String,
                enum: ["pending", "in-progress", "completed", "delayed"],
                default: "pending",
              },
              assignedTo: String,
              plannedStartDate: Date,
              actualStartDate: Date,
              plannedEndDate: Date,
              actualEndDate: Date,
              completionPercentage: {
                type: Number,
                default: 0,
                min: 0,
                max: 100,
              },
              notes: String,
              lastUpdated: Date,
              updatedBy: String,
            },
          ],
          dependencies: [String],
          lastUpdated: Date,
          criticalPath: Boolean,
        },
      ],
      currentPhase: String,
      startDate: Date,
      estimatedCompletionDate: Date,
      revisedCompletionDate: Date,
      lastUpdated: Date,
    },

    // Materials and logistics
    materials: [
      {
        name: String,
        category: String,
        quantity: Number,
        unit: String,
        status: {
          type: String,
          enum: ["ordered", "shipped", "delivered", "installed", "defective"],
          default: "ordered",
        },
        orderDate: Date,
        expectedDeliveryDate: Date,
        actualDeliveryDate: Date,
        installationDate: Date,
        supplier: String,
        invoiceNumber: String,
        notes: String,
      },
    ],

    team: [
      {
        name: String,
        role: String,
        contactInfo: String,
        expertise: [String],
        availability: [
          {
            startDate: Date,
            endDate: Date,
          },
        ],
      },
    ],

    // Documents and photos
    documents: [
      {
        name: String,
        type: String,
        url: String,
        tags: [String],
        aiGeneratedMetadata: {
          contentSummary: String,
          detectedEntities: [String],
          relevance: Number,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    photos: [
      {
        name: String,
        url: String,
        location: {
          latitude: Number,
          longitude: Number,
        },
        timestamp: Date,
        tags: [String],
        aiGeneratedTags: [String],
        aiDetectedObjects: [String],
        notes: String,
      },
    ],

    // Weather and environmental factors
    weatherHistory: [
      {
        date: Date,
        temperature: Number,
        conditions: String,
        rainfall: Number,
        humidity: Number,
        windSpeed: Number,
        workingHoursLost: Number,
        impact: {
          type: String,
          enum: ["none", "low", "medium", "high"],
          default: "none",
        },
      },
    ],

    // AI-generated data
    aiInsights: {
      predictedCompletionDate: Date,
      riskAssessment: {
        type: String,
        enum: ["low", "medium", "high"],
      },
      potentialDelays: [String],
      suggestionForImprovement: [String],
      nearbyRelatedSites: [
        {
          siteId: String,
          distance: Number,
        },
      ],
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },

    // Timeline of status changes for historical tracking
    statusTimeline: [
      {
        status: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        updatedBy: String,
        notes: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const RailwaySiteExtended =
  mongoose.models.RailwaySiteExtended ||
  mongoose.model<IRailwaySiteExtended>(
    "RailwaySiteExtended",
    RailwaySiteExtendedSchema
  );

export default RailwaySiteExtended;
