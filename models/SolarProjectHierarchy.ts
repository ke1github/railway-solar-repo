// models/SolarProjectHierarchy.ts
import mongoose, { Schema } from "mongoose";

// Define the comprehensive project hierarchy schema

// Project Task Schema
const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "on-hold", "cancelled"],
      default: "not-started",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    assignedTo: {
      type: String,
    },
    dependsOn: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    notes: {
      type: String,
    },
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        uploadDate: Date,
      },
    ],
    aiAnalysis: {
      riskLevel: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
      },
      potentialDelays: [String],
      recommendations: [String],
      lastAnalyzed: Date,
    },
  },
  { timestamps: true }
);

// Work Package Schema (a group of related tasks)
const WorkPackageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    description: {
      type: String,
    },
    tasks: [TaskSchema],
    status: {
      type: String,
      enum: ["not-started", "in-progress", "completed", "on-hold"],
      default: "not-started",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    budget: {
      allocated: Number,
      spent: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },
    manager: {
      name: String,
      contact: String,
      email: String,
    },
  },
  { timestamps: true }
);

// Project Phase Schema
const PhaseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["planned", "in-progress", "completed", "on-hold"],
      default: "planned",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    workPackages: [WorkPackageSchema],
    deliverables: [
      {
        name: String,
        description: String,
        dueDate: Date,
        status: {
          type: String,
          enum: ["pending", "in-review", "approved", "rejected"],
          default: "pending",
        },
      },
    ],
    milestones: [
      {
        name: String,
        description: String,
        dueDate: Date,
        achievedDate: Date,
        status: {
          type: String,
          enum: ["upcoming", "achieved", "missed", "rescheduled"],
          default: "upcoming",
        },
      },
    ],
  },
  { timestamps: true }
);

// Project Team Member Schema
const TeamMemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  email: String,
  phone: String,
  expertise: [String],
  availability: {
    startDate: Date,
    endDate: Date,
    workingHours: Number,
    allocatedPercentage: Number,
  },
});

// Material Schema
const MaterialSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    required: true,
  },
  quantity: {
    required: Number,
    allocated: Number,
    received: Number,
    installed: Number,
    damaged: Number,
  },
  unit: String,
  cost: {
    perUnit: Number,
    total: Number,
    currency: {
      type: String,
      default: "INR",
    },
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
  },
  status: {
    type: String,
    enum: [
      "planned",
      "ordered",
      "shipped",
      "delivered",
      "installed",
      "returned",
    ],
    default: "planned",
  },
  purchaseOrder: {
    number: String,
    date: Date,
    documentUrl: String,
  },
  deliveryDetails: {
    expectedDate: Date,
    actualDate: Date,
    receivedBy: String,
    quality: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
    },
  },
});

// Document Schema
const DocumentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    default: "1.0",
  },
  status: {
    type: String,
    enum: ["draft", "under-review", "approved", "obsolete"],
    default: "draft",
  },
  url: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: String,
  lastModifiedDate: Date,
  lastModifiedBy: String,
  tags: [String],
  aiGeneratedMetadata: {
    summary: String,
    keywords: [String],
    entities: [String],
    contentQuality: Number,
    lastAnalyzed: Date,
  },
});

// Risk Schema
const RiskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  category: String,
  probability: {
    type: Number,
    min: 0,
    max: 1,
  },
  impact: {
    type: Number,
    min: 1,
    max: 10,
  },
  severity: {
    type: Number,
    min: 1,
    max: 10,
  },
  status: {
    type: String,
    enum: ["identified", "analyzing", "mitigating", "resolved", "accepted"],
    default: "identified",
  },
  owner: String,
  identifiedDate: {
    type: Date,
    default: Date.now,
  },
  resolutionDate: Date,
  mitigation: {
    strategy: String,
    actions: [String],
    contingencyPlan: String,
  },
  relatedTasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

// Main Project Schema
const SolarProjectSchema = new Schema(
  {
    projectCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "RailwaySite",
      required: true,
    },
    siteCode: {
      type: String,
      required: true,
    },
    capacity: {
      planned: Number,
      installed: Number,
      operational: Number,
      unit: {
        type: String,
        default: "kWp",
      },
    },
    status: {
      type: String,
      enum: [
        "planning",
        "approved",
        "execution",
        "completed",
        "cancelled",
        "on-hold",
      ],
      default: "planning",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    dates: {
      planned: {
        start: Date,
        end: Date,
      },
      actual: {
        start: Date,
        end: Date,
      },
      commissioning: Date,
    },
    location: {
      stationName: String,
      stationCode: String,
      division: String,
      zone: String,
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    budget: {
      approved: Number,
      allocated: Number,
      spent: Number,
      remaining: Number,
      currency: {
        type: String,
        default: "INR",
      },
    },
    team: [TeamMemberSchema],
    phases: [PhaseSchema],
    materials: [MaterialSchema],
    documents: [DocumentSchema],
    risks: [RiskSchema],
    stakeholders: [
      {
        name: String,
        organization: String,
        role: String,
        contact: String,
        email: String,
      },
    ],
    aiInsights: {
      predictedCompletionDate: Date,
      predictedFinalCost: Number,
      riskAssessment: {
        overall: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        schedule: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        budget: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        quality: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
      },
      keyPerformanceIndicators: {
        schedulePerformanceIndex: Number,
        costPerformanceIndex: Number,
        qualityIndex: Number,
        safetyIndex: Number,
      },
      recommendations: [String],
      lastAnalyzed: {
        type: Date,
        default: Date.now,
      },
    },
    weatherData: [
      {
        date: Date,
        conditions: String,
        temperature: Number,
        humidity: Number,
        windSpeed: Number,
        rainfall: Number,
        impactLevel: {
          type: String,
          enum: ["none", "low", "medium", "high"],
          default: "none",
        },
      },
    ],
  },
  { timestamps: true }
);

// Compile models only if they haven't been compiled already
export const SolarProject =
  mongoose.models.SolarProject ||
  mongoose.model("SolarProject", SolarProjectSchema);
export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export const WorkPackage =
  mongoose.models.WorkPackage ||
  mongoose.model("WorkPackage", WorkPackageSchema);
export const Phase =
  mongoose.models.Phase || mongoose.model("Phase", PhaseSchema);

// Export types for TypeScript
export interface ITask extends mongoose.Document {
  name: string;
  description?: string;
  status: "not-started" | "in-progress" | "completed" | "on-hold" | "cancelled";
  progress: number;
  priority: "low" | "medium" | "high" | "critical";
  startDate?: Date;
  dueDate?: Date;
  completedDate?: Date;
  assignedTo?: string;
  dependsOn?: mongoose.Types.ObjectId[];
  notes?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    uploadDate: Date;
  }[];
  aiAnalysis?: {
    riskLevel: "low" | "medium" | "high";
    potentialDelays?: string[];
    recommendations?: string[];
    lastAnalyzed?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkPackage extends mongoose.Document {
  name: string;
  code?: string;
  description?: string;
  tasks: ITask[];
  status: "not-started" | "in-progress" | "completed" | "on-hold";
  progress: number;
  startDate?: Date;
  endDate?: Date;
  budget?: {
    allocated?: number;
    spent?: number;
    currency: string;
  };
  manager?: {
    name?: string;
    contact?: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IPhase extends mongoose.Document {
  name: string;
  description?: string;
  order: number;
  status: "planned" | "in-progress" | "completed" | "on-hold";
  progress: number;
  startDate?: Date;
  endDate?: Date;
  workPackages: IWorkPackage[];
  deliverables?: {
    name: string;
    description?: string;
    dueDate?: Date;
    status: "pending" | "in-review" | "approved" | "rejected";
  }[];
  milestones?: {
    name: string;
    description?: string;
    dueDate?: Date;
    achievedDate?: Date;
    status: "upcoming" | "achieved" | "missed" | "rescheduled";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISolarProject extends mongoose.Document {
  projectCode: string;
  name: string;
  description?: string;
  siteId: mongoose.Types.ObjectId;
  siteCode: string;
  capacity: {
    planned?: number;
    installed?: number;
    operational?: number;
    unit: string;
  };
  status:
    | "planning"
    | "approved"
    | "execution"
    | "completed"
    | "cancelled"
    | "on-hold";
  priority: "low" | "medium" | "high" | "critical";
  progress: number;
  dates: {
    planned?: {
      start?: Date;
      end?: Date;
    };
    actual?: {
      start?: Date;
      end?: Date;
    };
    commissioning?: Date;
  };
  location: {
    stationName?: string;
    stationCode?: string;
    division?: string;
    zone?: string;
    address?: string;
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
  };
  budget?: {
    approved?: number;
    allocated?: number;
    spent?: number;
    remaining?: number;
    currency: string;
  };
  team?: {
    name: string;
    role: string;
    email?: string;
    phone?: string;
    expertise?: string[];
    availability?: {
      startDate?: Date;
      endDate?: Date;
      workingHours?: number;
      allocatedPercentage?: number;
    };
  }[];
  phases: IPhase[];
  materials?: {
    name: string;
    description?: string;
    category: string;
    quantity: {
      required: number;
      allocated?: number;
      received?: number;
      installed?: number;
      damaged?: number;
    };
    unit?: string;
    cost?: {
      perUnit?: number;
      total?: number;
      currency: string;
    };
    supplier?: {
      name?: string;
      contact?: string;
      email?: string;
    };
    status:
      | "planned"
      | "ordered"
      | "shipped"
      | "delivered"
      | "installed"
      | "returned";
    purchaseOrder?: {
      number?: string;
      date?: Date;
      documentUrl?: string;
    };
    deliveryDetails?: {
      expectedDate?: Date;
      actualDate?: Date;
      receivedBy?: string;
      quality?: "excellent" | "good" | "fair" | "poor";
    };
  }[];
  documents?: {
    title: string;
    description?: string;
    category: string;
    version: string;
    status: "draft" | "under-review" | "approved" | "obsolete";
    url?: string;
    uploadDate: Date;
    uploadedBy?: string;
    lastModifiedDate?: Date;
    lastModifiedBy?: string;
    tags?: string[];
    aiGeneratedMetadata?: {
      summary?: string;
      keywords?: string[];
      entities?: string[];
      contentQuality?: number;
      lastAnalyzed?: Date;
    };
  }[];
  risks?: {
    title: string;
    description?: string;
    category?: string;
    probability?: number;
    impact?: number;
    severity?: number;
    status: "identified" | "analyzing" | "mitigating" | "resolved" | "accepted";
    owner?: string;
    identifiedDate: Date;
    resolutionDate?: Date;
    mitigation?: {
      strategy?: string;
      actions?: string[];
      contingencyPlan?: string;
    };
    relatedTasks?: mongoose.Types.ObjectId[];
  }[];
  stakeholders?: {
    name?: string;
    organization?: string;
    role?: string;
    contact?: string;
    email?: string;
  }[];
  aiInsights?: {
    predictedCompletionDate?: Date;
    predictedFinalCost?: number;
    riskAssessment?: {
      overall: "low" | "medium" | "high";
      schedule: "low" | "medium" | "high";
      budget: "low" | "medium" | "high";
      quality: "low" | "medium" | "high";
    };
    keyPerformanceIndicators?: {
      schedulePerformanceIndex?: number;
      costPerformanceIndex?: number;
      qualityIndex?: number;
      safetyIndex?: number;
    };
    recommendations?: string[];
    lastAnalyzed: Date;
  };
  weatherData?: {
    date: Date;
    conditions?: string;
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    rainfall?: number;
    impactLevel: "none" | "low" | "medium" | "high";
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Default export
export default SolarProject;
