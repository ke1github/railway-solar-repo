// models/EPCProject.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IEPCProject extends Document {
  projectId: string;
  projectName: string;
  siteId: string;
  projectType: "solar_installation" | "maintenance" | "upgrade" | "expansion";

  // Project Phases
  phases: {
    engineering: {
      status: "not_started" | "in_progress" | "completed" | "on_hold";
      startDate?: Date;
      completedDate?: Date;
      assignedTeam: string[];
      documents: string[];
      progress: number; // 0-100
    };
    procurement: {
      status: "not_started" | "in_progress" | "completed" | "on_hold";
      startDate?: Date;
      completedDate?: Date;
      vendor: string;
      purchaseOrders: string[];
      deliverySchedule: Date;
      progress: number;
    };
    construction: {
      status: "not_started" | "in_progress" | "completed" | "on_hold";
      startDate?: Date;
      completedDate?: Date;
      contractor: string;
      milestones: Array<{
        name: string;
        targetDate: Date;
        completedDate?: Date;
        status: "pending" | "completed" | "delayed";
      }>;
      progress: number;
    };
  };

  // Resource Management
  resources: {
    budget: {
      total: number;
      allocated: number;
      spent: number;
      currency: string;
    };
    timeline: {
      plannedStartDate: Date;
      plannedEndDate: Date;
      actualStartDate?: Date;
      actualEndDate?: Date;
    };
    team: Array<{
      memberId: string;
      name: string;
      role: string;
      phase: "engineering" | "procurement" | "construction";
      allocation: number; // percentage
    }>;
  };

  // Quality & Compliance
  qualityControl: {
    inspections: Array<{
      type: string;
      date: Date;
      inspector: string;
      status: "passed" | "failed" | "pending";
      notes: string;
    }>;
    certifications: string[];
    compliance: Array<{
      requirement: string;
      status: "compliant" | "non_compliant" | "pending";
      evidence: string;
    }>;
  };

  // Risk Management
  risks: Array<{
    id: string;
    description: string;
    probability: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    mitigation: string;
    status: "open" | "mitigated" | "closed";
    owner: string;
  }>;

  // Status & Health
  overallStatus: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  healthScore: number; // 0-100 calculated metric
  priority: "low" | "medium" | "high" | "critical";

  createdAt: Date;
  updatedAt: Date;
}

const EPCProjectSchema = new Schema<IEPCProject>(
  {
    projectId: { type: String, required: true, unique: true },
    projectName: { type: String, required: true },
    siteId: { type: String, required: true },
    projectType: {
      type: String,
      enum: ["solar_installation", "maintenance", "upgrade", "expansion"],
      required: true,
    },

    phases: {
      engineering: {
        status: {
          type: String,
          enum: ["not_started", "in_progress", "completed", "on_hold"],
          default: "not_started",
        },
        startDate: Date,
        completedDate: Date,
        assignedTeam: [String],
        documents: [String],
        progress: { type: Number, default: 0, min: 0, max: 100 },
      },
      procurement: {
        status: {
          type: String,
          enum: ["not_started", "in_progress", "completed", "on_hold"],
          default: "not_started",
        },
        startDate: Date,
        completedDate: Date,
        vendor: String,
        purchaseOrders: [String],
        deliverySchedule: Date,
        progress: { type: Number, default: 0, min: 0, max: 100 },
      },
      construction: {
        status: {
          type: String,
          enum: ["not_started", "in_progress", "completed", "on_hold"],
          default: "not_started",
        },
        startDate: Date,
        completedDate: Date,
        contractor: String,
        milestones: [
          {
            name: String,
            targetDate: Date,
            completedDate: Date,
            status: {
              type: String,
              enum: ["pending", "completed", "delayed"],
              default: "pending",
            },
          },
        ],
        progress: { type: Number, default: 0, min: 0, max: 100 },
      },
    },

    resources: {
      budget: {
        total: { type: Number, required: true },
        allocated: { type: Number, default: 0 },
        spent: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
      },
      timeline: {
        plannedStartDate: { type: Date, required: true },
        plannedEndDate: { type: Date, required: true },
        actualStartDate: Date,
        actualEndDate: Date,
      },
      team: [
        {
          memberId: String,
          name: String,
          role: String,
          phase: {
            type: String,
            enum: ["engineering", "procurement", "construction"],
          },
          allocation: { type: Number, min: 0, max: 100 },
        },
      ],
    },

    qualityControl: {
      inspections: [
        {
          type: { type: String, required: true },
          date: { type: Date, required: true },
          inspector: { type: String, required: true },
          status: {
            type: String,
            enum: ["passed", "failed", "pending"],
            default: "pending",
          },
          notes: String,
        },
      ],
      certifications: [String],
      compliance: [
        {
          requirement: String,
          status: {
            type: String,
            enum: ["compliant", "non_compliant", "pending"],
            default: "pending",
          },
          evidence: String,
        },
      ],
    },

    risks: [
      {
        id: { type: String, required: true },
        description: { type: String, required: true },
        probability: {
          type: String,
          enum: ["low", "medium", "high"],
          required: true,
        },
        impact: {
          type: String,
          enum: ["low", "medium", "high"],
          required: true,
        },
        mitigation: String,
        status: {
          type: String,
          enum: ["open", "mitigated", "closed"],
          default: "open",
        },
        owner: String,
      },
    ],

    overallStatus: {
      type: String,
      enum: ["planning", "active", "on_hold", "completed", "cancelled"],
      default: "planning",
    },
    healthScore: { type: Number, default: 100, min: 0, max: 100 },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
  },
  {
    timestamps: true,
    collection: "epc_projects",
  }
);

// Indexes for better performance
EPCProjectSchema.index({ projectId: 1 });
EPCProjectSchema.index({ siteId: 1 });
EPCProjectSchema.index({ overallStatus: 1 });
EPCProjectSchema.index({ priority: 1 });
EPCProjectSchema.index({ "phases.engineering.status": 1 });
EPCProjectSchema.index({ "phases.procurement.status": 1 });
EPCProjectSchema.index({ "phases.construction.status": 1 });

// Calculate health score based on various factors
EPCProjectSchema.methods.calculateHealthScore = function () {
  let score = 100;

  // Deduct for delays
  const now = new Date();
  if (
    this.resources.timeline.plannedEndDate < now &&
    this.overallStatus !== "completed"
  ) {
    score -= 20;
  }

  // Deduct for budget overruns
  const budgetUtilization =
    this.resources.budget.spent / this.resources.budget.total;
  if (budgetUtilization > 1.1) score -= 15;

  // Deduct for open high-risk items
  const highRisks = this.risks.filter(
    (r: unknown) => r.probability === "high" && r.status === "open"
  );
  score -= highRisks.length * 10;

  // Deduct for failed inspections
  const failedInspections = this.qualityControl.inspections.filter(
    (i: unknown) => i.status === "failed"
  );
  score -= failedInspections.length * 5;

  this.healthScore = Math.max(0, score);
  return this.healthScore;
};

// Get overall project progress
EPCProjectSchema.methods.getOverallProgress = function () {
  const engineeringWeight = 0.3;
  const procurementWeight = 0.3;
  const constructionWeight = 0.4;

  return Math.round(
    this.phases.engineering.progress * engineeringWeight +
      this.phases.procurement.progress * procurementWeight +
      this.phases.construction.progress * constructionWeight
  );
};

export default mongoose.models.EPCProject ||
  mongoose.model<IEPCProject>("EPCProject", EPCProjectSchema);
